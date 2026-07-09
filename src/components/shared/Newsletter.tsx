"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium Newsletter signup subscription card.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8 md:p-10 shadow-lg glow-card relative overflow-hidden">
      {/* Decorative colored glow background circle */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Stay in the Academic Loop
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Subscribe to our weekly newsletter for the latest technical research, college announcements, placement drives, and campus news.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center space-y-2 py-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-foreground text-sm">Successfully Subscribed!</h4>
              <p className="text-xs text-muted-foreground">Thank you for joining our community newsletter.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto items-stretch"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter academic email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="pl-10 h-10 w-full"
                  disabled={status === "loading"}
                  required
                />
              </div>
              <Button type="submit" className="h-10 px-6 shrink-0" disabled={status === "loading"}>
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && (
          <p className="text-[11px] font-medium text-destructive animate-pulse">{errorMsg}</p>
        )}

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Zero spam. Unsubscribe at any time. We protect your academic registry data.
        </p>
      </div>
    </div>
  );
}
