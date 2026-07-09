"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please specify email and password credentials.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await api.login({ email, password });
      // Redirect to the auth-gated admin workspace
      router.push("/admin");
    } catch (err: any) {
      console.error("Login failure:", err);
      setError("Authentication failed. Please verify credentials.");
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
            siet news archive
          </p>
          <h1 className="font-display text-h2 font-semibold text-ink leading-tight">
            Admin Portal
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="editor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-ink text-sm font-sans"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block font-util text-eyebrow text-ink-soft uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="login-password"
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
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/" className="font-util text-eyebrow text-ink-soft hover:text-ink uppercase tracking-wider transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </main>
  );
}
