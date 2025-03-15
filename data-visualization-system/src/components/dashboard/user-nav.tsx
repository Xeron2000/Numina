// components/user-nav.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { User, useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation";

export function UserNav() {
  const { logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // ✅ 直接初始化 user 和 initials
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);

    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
      setLoading(false);
    }

  }, [])

  return loading ? (<></>) : (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage />
            <AvatarFallback>{user?.username[0].toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>

        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => logout()}>
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}