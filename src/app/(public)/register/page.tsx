"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Create the reader account
      await api.register({ name, email, password });
      
      // 2. Log in using the registration credentials to establish the session cookie
      const user = await api.login({ email, password });

      if (user) {
        localStorage.setItem("siet_logged_in", "true");
        localStorage.setItem("siet_user_role", user.role);
      }
      
      // 3. Redirect to public home
      router.push("/");
    } catch (err: any) {
      console.error("Registration/Login failure:", err);
      setError("Failed to create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md border border-line bg-paper-2 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="font-util text-eyebrow text-accent uppercase tracking-widest">
            join our reader community
          </p>
          <h1 className="font-display text-h2 font-semibold text-ink leading-tight">
            Create Reader Account
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-name"
              className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider"
            >
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-ink text-sm font-sans"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider"
            >
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="reader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-ink text-sm font-sans"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-password"
              className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-ink text-sm font-sans"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-left font-util text-[11px] text-accent uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-util text-eyebrow uppercase tracking-wider text-paper bg-ink hover:bg-accent hover:border-accent border border-ink transition-colors py-2.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Alternate login link */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-xs text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-ink font-medium">
              Login here
            </Link>
          </p>
          <div>
            <Link href="/" className="font-util text-eyebrow text-ink-soft hover:text-ink uppercase tracking-wider transition-colors">
              ← Public Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
