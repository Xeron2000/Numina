// src/components/logo.tsx
import Link from "next/link";
import { LineChart } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LineChart className="h-6 w-6" />
      <span className="font-semibold text-xl">Numina</span>
    </Link>
  );
}