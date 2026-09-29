"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

type ReservationStatus = "confirmed" | "cancelled";

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderType: "pickup" | "dine_in";
  tableNumber?: string;
  status: OrderStatus;
  totalAmount: string | number;
  createdAt: string;
  items: {
    id: number;
    productName: string;
    unitPrice: string | number;
    quantity: number;
  }[];
};

type Reservation = {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialRequest?: string;
  status: ReservationStatus;
};

export default function AdminPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">(
    "orders",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("saffron_admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function loadDashboard() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [ordersResponse, reservationsResponse] = await Promise.all([
          fetch(`${API_URL}/orders`, { headers }),
          fetch(`${API_URL}/reservations`, { headers }),
        ]);

        if (!ordersResponse.ok || !reservationsResponse.ok) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const [ordersData, reservationsData] = await Promise.all([
          ordersResponse.json(),
          reservationsResponse.json(),
        ]);

        setOrders(ordersData);
        setReservations(reservationsData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load the dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [router]);

  async function updateOrderStatus(id: number, status: OrderStatus) {
    const token = window.localStorage.getItem("saffron_admin_token");

    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Unable to update the order.");
      }

      const updatedOrder = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === id ? updatedOrder : order)),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update the order.",
      );
    }
  }

  async function updateReservationStatus(
    id: number,
    status: ReservationStatus,
  ) {
    const token = window.localStorage.getItem("saffron_admin_token");

    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Unable to update the reservation.");
      }

      const updatedReservation = await response.json();

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update the reservation.",
      );
    }
  }

  function logout() {
    window.localStorage.removeItem("saffron_admin_token");
    router.push("/admin/login");
  }

  const newOrders = orders.filter((order) => order.status === "new").length;
  const activeReservations = reservations.filter(
    (reservation) => reservation.status === "confirmed",
  ).length;

  return (
    <main className="restaurant-admin">
      <header className="restaurant-admin-header">
        <div>
          <p className="eyebrow">Saffron Operations</p>
          <h1>Restaurant Dashboard</h1>
        </div>

        <div className="admin-header-actions">
          <button type="button" onClick={() => router.push("/")}>
            View Website
          </button>

          <button className="admin-logout" type="button" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <article>
          <span>New Orders</span>
          <strong>{newOrders}</strong>
        </article>

        <article>
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </article>

        <article>
          <span>Active Reservations</span>
          <strong>{activeReservations}</strong>
        </article>
      </section>

      <section className="admin-content">
        <div className="admin-tabs">
          <button
            className={activeTab === "orders" ? "active" : ""}
            type="button"
            onClick={() => setActiveTab("orders")}
          >
            Orders ({orders.length})
          </button>

          <button
            className={activeTab === "reservations" ? "active" : ""}
            type="button"
            onClick={() => setActiveTab("reservations")}
          >
            Reservations ({reservations.length})
          </button>
        </div>

        {errorMessage && <p className="admin-error">{errorMessage}</p>}

        {isLoading && <p className="admin-loading">Loading dashboard...</p>}

        {!isLoading && activeTab === "orders" && (
          <div className="admin-list">
            {orders.length === 0 ? (
              <div className="admin-empty">
                <h2>No orders yet.</h2>
                <p>New customer orders will appear here immediately.</p>
              </div>
            ) : (
              orders.map((order) => (
                <article className="admin-order-card" key={order.id}>
                  <div className="admin-order-top">
                    <div>
                      <p className="order-number">Order #{order.id}</p>
                      <h2>{order.customerName}</h2>
                      <p>
                        {order.orderType === "pickup"
                          ? "Pickup"
                          : `Dine-in · Table ${order.tableNumber}`}
                      </p>
                    </div>

                    <div className="admin-order-status">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                      >
                        <option value="new">New</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <strong>
                        {Number(order.totalAmount).toFixed(2)} JOD
                      </strong>
                    </div>
                  </div>

                  <div className="admin-order-items">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <span>
                          {item.quantity} × {item.productName}
                        </span>

                        <strong>
                          {(Number(item.unitPrice) * item.quantity).toFixed(2)}{" "}
                          JOD
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="admin-customer-details">
                    <span>{order.customerEmail}</span>
                    {order.customerPhone && <span>{order.customerPhone}</span>}
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {!isLoading && activeTab === "reservations" && (
          <div className="admin-list">
            {reservations.length === 0 ? (
              <div className="admin-empty">
                <h2>No reservations yet.</h2>
                <p>New table reservations will appear here.</p>
              </div>
            ) : (
              reservations.map((reservation) => (
                <article className="admin-order-card" key={reservation.id}>
                  <div className="admin-order-top">
                    <div>
                      <p className="order-number">
                        Reservation #{reservation.id}
                      </p>
                      <h2>{reservation.guestName}</h2>
                      <p>
                        {reservation.reservationDate} ·{" "}
                        {reservation.reservationTime} · {reservation.guestCount}{" "}
                        guests
                      </p>
                    </div>

                    <div className="admin-order-status">
                      <select
                        value={reservation.status}
                        onChange={(event) =>
                          updateReservationStatus(
                            reservation.id,
                            event.target.value as ReservationStatus,
                          )
                        }
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {reservation.specialRequest && (
                    <p className="admin-special-request">
                      {reservation.specialRequest}
                    </p>
                  )}

                  <div className="admin-customer-details">
                    <span>{reservation.guestEmail}</span>
                    {reservation.guestPhone && (
                      <span>{reservation.guestPhone}</span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
