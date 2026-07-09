"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail, Shield, User } from "lucide-react";
import Link from "next/link";

/**
 * Interactive Client Form for user account registration.
 */
export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      department: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Simulate backend registration latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registered successfully:", data);
      // Redirect or state change here
    } catch (err: any) {
      setErrorMsg("An account with this email already exists.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card/40 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-xl">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
        <p className="text-sm text-muted-foreground">
          Join the SIET community blogging network
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="email">
            Academic Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@siet.edu.in"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="role">
            Role
          </label>
          <div className="relative flex">
            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select
              id="role"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-muted-foreground"
              {...register("role")}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="writer">Community Writer</option>
            </select>
          </div>
          {errors.role && (
            <p className="text-[11px] font-medium text-destructive">{errors.role.message}</p>
          )}
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="department">
            Department
          </label>
          <Input
            id="department"
            type="text"
            placeholder="Information Technology"
            {...register("department")}
          />
          {errors.department && (
            <p className="text-[11px] font-medium text-destructive">{errors.department.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Action */}
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            <>
              Sign Up <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}
