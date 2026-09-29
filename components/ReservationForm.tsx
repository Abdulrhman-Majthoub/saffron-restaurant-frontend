"use client";

import { FormEvent, useState } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/reservations`;

type ReservationFormData = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: string;
};

const initialFormData: ReservationFormData = {
  guestName: "",
  guestEmail: "",
  guestPhone: "07",
  reservationDate: "",
  reservationTime: "",
  guestCount: "2",
};

function formatReservationDate(date: string) {
  if (!date) {
    return "Choose a date";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ReservationForm() {
  const [formData, setFormData] =
    useState<ReservationFormData>(initialFormData);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    const remainingDigits = event.target.value.replace(/\D/g, "").slice(0, 8);

    setFormData({
      ...formData,
      guestPhone: `07${remainingDigits}`,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          guestCount: Number(formData.guestCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reservation could not be completed.");
      }

      setMessage(
        `Your table is confirmed. Reservation #${data.id} is waiting for you.`,
      );
      setFormData(initialFormData);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not complete your reservation.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Full Name
          <input
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            name="guestEmail"
            type="email"
            value={formData.guestEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Date
          <span
            className="date-picker-display"
            onClick={(event) => {
              event.currentTarget
                .querySelector<HTMLInputElement>(".date-picker-input")
                ?.showPicker();
            }}
          >
            <span>{formatReservationDate(formData.reservationDate)}</span>
            <span className="date-picker-icon">⌄</span>

            <input
              className="date-picker-input"
              name="reservationDate"
              type="date"
              value={formData.reservationDate}
              onChange={handleChange}
              required
              aria-label="Reservation date"
            />
          </span>
        </label>

        <label>
          Time
          <select
            name="reservationTime"
            value={formData.reservationTime}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a time
            </option>
            <option>5:00 PM</option>
            <option>6:00 PM</option>
            <option>7:00 PM</option>
            <option>8:00 PM</option>
            <option>9:00 PM</option>
            <option>10:00 PM</option>
            <option>11:00 PM</option>
          </select>
        </label>

        <label>
          Guests
          <select
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
          >
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "Guest" : "Guests"}
                </option>
              ),
            )}
          </select>
        </label>

        <label>
          Phone Number
          <span className="phone-field">
            <span className="phone-prefix">07</span>

            <input
              type="tel"
              value={formData.guestPhone.slice(2)}
              onChange={handlePhoneChange}
              inputMode="numeric"
              autoComplete="tel"
              minLength={8}
              maxLength={8}
              required
            />
          </span>
        </label>
      </div>

      <button
        className="button button-gold reservation-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Confirming..." : "Confirm Reservation"}
        <span>→</span>
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
