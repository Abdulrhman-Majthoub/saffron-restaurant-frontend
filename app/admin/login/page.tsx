"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001/auth/login";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid login.");
      }

      const data = await response.json();

      localStorage.setItem("saffron_admin_token", data.accessToken);
      router.push("/admin");
    } catch {
      setMessage("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <a className="login-logo" href="/">
          SAFFRON
          <small>FINE DINING</small>
        </a>

        <p className="admin-eyebrow">Private Access</p>
        <h1>Admin login</h1>
        <p>Sign in to manage reservations and your dining room.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@saffron.am"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {message && <p className="login-message">{message}</p>}
        </form>
      </section>
    </main>
  );
}