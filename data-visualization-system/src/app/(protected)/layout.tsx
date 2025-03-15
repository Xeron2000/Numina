// app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { SideNavigation } from "@/components/layout/SideNavigation";
import { TopBar } from "@/components/layout/TopBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <SideNavigation className="border-r" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}