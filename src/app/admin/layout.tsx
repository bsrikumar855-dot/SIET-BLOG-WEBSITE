import * as React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heads = await headers();
  const pathname = heads.get("x-pathname") || "/admin";

  // Bypass auth gate specifically for the login page route
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Retrieve user session
  const user = await getSession();

  if (!user) {
    redirect("/admin/login");
  }

  // Generate page path navigation breadcrumb label
  const pathParts = pathname.split("/").filter(Boolean).slice(1);
  const pathLabel = pathParts.length > 0 
    ? pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ") 
    : "Dashboard";

  return (
    <div className="flex bg-paper text-ink min-h-screen">
      {/* Sidebar Navigation */}
      <AdminSidebar user={user} />

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="border-b border-line bg-paper px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="font-util text-xs uppercase tracking-wider text-ink-soft pl-12 lg:pl-0">
            {pathLabel}
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            <span className="font-util text-[10px] uppercase tracking-wider text-ink-soft bg-paper-2 border border-line px-2.5 py-0.5">
              Secure Session
            </span>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
