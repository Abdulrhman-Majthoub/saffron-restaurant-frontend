"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string | number;
  imageUrl: string;
};

type BasketItem = Product & {
  quantity: number;
};

type OrderType = "pickup" | "dine_in";

export default function OrderMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Unable to load the menu.");
        }

        setProducts(await response.json());
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load the menu.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    const savedBasket = window.localStorage.getItem("saffron_basket");

    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket));
      } catch {
        window.localStorage.removeItem("saffron_basket");
      }
    }

    void loadProducts();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("saffron_basket", JSON.stringify(basket));
  }, [basket]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const totalItems = basket.reduce((total, item) => total + item.quantity, 0);

  const totalAmount = basket.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  function addToBasket(product: Product) {
    setBasket((currentBasket) => {
      const existingItem = currentBasket.find((item) => item.id === product.id);

      if (existingItem) {
        return currentBasket.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentBasket, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(productId: number, amount: number) {
    setBasket((currentBasket) =>
      currentBasket
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId: number) {
    setBasket((currentBasket) =>
      currentBasket.filter((item) => item.id !== productId),
    );
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (basket.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          orderType,
          tableNumber: orderType === "dine_in" ? tableNumber : undefined,
          items: basket.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message[0] : data.message,
        );
      }

      setBasket([]);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      setIsOrderConfirmed(true);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setTableNumber("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section id="full-menu" className="bg-[#f7f3ec] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d89c3d]">
              Order From Our Kitchen
            </p>

            <h2 className="mt-4 font-serif text-5xl text-[#241d18] md:text-6xl">
              The full Saffron menu.
            </h2>

            <p className="mt-5 leading-8 text-[#706c65]">
              Choose your favorites, add them to your basket, and enjoy Saffron
              wherever your evening takes you.
            </p>
          </div>

          {isLoading && (
            <p className="text-center text-[#706c65]">Loading menu...</p>
          )}

          {errorMessage && !isCheckoutOpen && (
            <p className="mb-6 text-center font-semibold text-red-700">
              {errorMessage}
            </p>
          )}

          {categories.map((category) => (
            <div
              id={category === "The Bar" ? "the-bar" : undefined}
              key={category}
              className="mb-20"
            >
              <h3 className="mb-7 font-serif text-3xl text-[#241d18]">
                {category}
              </h3>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden border border-[#e1d7ca] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="h-64 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                          }}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-serif text-2xl text-[#241d18]">
                            {product.name}
                          </h4>

                          <strong className="whitespace-nowrap text-[#d89c3d]">
                            {Number(product.price).toFixed(2)} JOD
                          </strong>
                        </div>

                        <p className="mt-3 min-h-14 leading-7 text-[#706c65]">
                          {product.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => addToBasket(product)}
                          className="mt-6 w-full border border-[#d89c3d] bg-[#d89c3d] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#211a15] transition hover:border-[#edb75d] hover:bg-[#edb75d]"
                        >
                          Add to Basket
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#241d18] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-2xl transition hover:bg-[#3a2d23]"
      >
        Basket
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d89c3d] text-xs text-[#211a15]">
          {totalItems}
        </span>
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <aside className="ml-auto flex min-h-screen w-full max-w-md flex-col bg-[#f8f4ed] p-7 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#ded3c5] pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d89c3d]">
                  Your Selection
                </p>
                <h2 className="mt-2 font-serif text-4xl text-[#241d18]">
                  Your Basket
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-4xl leading-none text-[#241d18]"
              >
                ×
              </button>
            </div>

            {basket.length === 0 ? (
              <div className="grid flex-1 place-items-center text-center">
                <div>
                  <p className="mb-6 text-[#706c65]">
                    Your basket is waiting for something delicious.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="border border-[#241d18] px-5 py-3 text-sm font-bold text-[#241d18]"
                  >
                    Explore Menu
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto py-6">
                  {basket.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_FOOD_IMAGE;
                        }}
                        className="h-24 w-20 object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-serif text-lg text-[#241d18]">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#d89c3d]">
                              {Number(item.price).toFixed(2)} JOD
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="h-fit text-xs font-bold uppercase text-red-700"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, -1)}
                            className="grid h-8 w-8 place-items-center border border-[#cdbfac] bg-white text-lg"
                          >
                            −
                          </button>

                          <span className="w-5 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, 1)}
                            className="grid h-8 w-8 place-items-center border border-[#cdbfac] bg-white text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#ded3c5] pt-6">
                  <div className="mb-5 flex justify-between text-xl text-[#241d18]">
                    <span>Total</span>
                    <strong>{totalAmount.toFixed(2)} JOD</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full border border-[#d89c3d] bg-[#d89c3d] px-5 py-4 text-sm font-bold uppercase tracking-wider text-[#211a15] transition hover:border-[#edb75d] hover:bg-[#edb75d]"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-5">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-[#f8f4ed] p-8 md:p-12">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-5 top-4 text-4xl leading-none text-[#241d18]"
            >
              ×
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d89c3d]">
              Checkout
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#241d18]">
              Almost at your table.
            </h2>

            <p className="mt-3 text-[#706c65]">
              Order total:{" "}
              <strong className="text-[#d89c3d]">
                {totalAmount.toFixed(2)} JOD
              </strong>
            </p>

            <form onSubmit={submitOrder} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-[#241d18]">
                Full Name
                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="border border-[#cdbfac] bg-white px-4 py-3 font-normal outline-none focus:border-[#d89c3d]"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-[#241d18]">
                Email Address
                <input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className="border border-[#cdbfac] bg-white px-4 py-3 font-normal outline-none focus:border-[#d89c3d]"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-[#241d18]">
                Phone Number
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className="border border-[#cdbfac] bg-white px-4 py-3 font-normal outline-none focus:border-[#d89c3d]"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-[#241d18]">
                Order Type
                <select
                  value={orderType}
                  onChange={(event) =>
                    setOrderType(event.target.value as OrderType)
                  }
                  className="border border-[#cdbfac] bg-white px-4 py-3 font-normal outline-none focus:border-[#d89c3d]"
                >
                  <option value="pickup">Pickup</option>
                  <option value="dine_in">Dine-in</option>
                </select>
              </label>

              {orderType === "dine_in" && (
                <label className="grid gap-2 text-sm font-bold text-[#241d18]">
                  Table Number
                  <input
                    required
                    value={tableNumber}
                    onChange={(event) => setTableNumber(event.target.value)}
                    placeholder="Example: 12"
                    className="border border-[#cdbfac] bg-white px-4 py-3 font-normal outline-none focus:border-[#d89c3d]"
                  />
                </label>
              )}

              {errorMessage && (
                <p className="font-semibold text-red-700">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 border border-[#d89c3d] bg-[#d89c3d] px-5 py-4 text-sm font-bold uppercase tracking-wider text-[#211a15] transition hover:border-[#edb75d] hover:bg-[#edb75d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isOrderConfirmed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-5">
          <div className="w-full max-w-lg bg-[#f8f4ed] p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d89c3d]">
              Order Received
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#241d18]">
              Your order is confirmed.
            </h2>

            <p className="mt-5 leading-8 text-[#706c65]">
              Thank you, {customerName}. Our kitchen will begin preparing your
              order shortly.
            </p>

            <button
              type="button"
              onClick={() => setIsOrderConfirmed(false)}
              className="mt-8 border border-[#d89c3d] bg-[#d89c3d] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#211a15] transition hover:border-[#edb75d] hover:bg-[#edb75d]"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
