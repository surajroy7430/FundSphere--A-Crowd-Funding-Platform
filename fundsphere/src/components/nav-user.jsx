"use client";

import { ArrowLeftFromLine, ShieldUser, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function NavUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fallbackName = (() => {
    if (!user?.username) return "U";

    const parts = user?.username.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    const first = parts[0][0]?.toUpperCase() || "";
    const last = parts[parts.length - 1][0]?.toUpperCase() || "";
    return first + last;
  })();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <div className="relative">
            <Avatar className="size-8">
              <AvatarImage src="" width={32} height={32} alt={fallbackName} />
              <AvatarFallback>{fallbackName}</AvatarFallback>
            </Avatar>

            {/* Active green dot */}
            <Badge className="absolute bottom-0 right-0 block size-2 rounded-full p-0 bg-green-500 ring-2 ring-background"></Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex flex-col min-w-0">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.username}
          </span>
          <span className="truncate text-sm font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <UserCog size={16} className="opacity-60" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>

          {(user?.role === "admin" || user?.role === "moderator") && (
            <DropdownMenuItem
              onClick={() =>
                navigate(
                  user.role === "admin"
                    ? "/admin-dashboard"
                    : "/moderator-dashboard"
                )
              }
            >
              <ShieldUser size={16} className="opacity-60" aria-hidden="true" />
              <span>
                {user.role === "admin" ? "Admin Area" : "Moderator Area"}
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <ArrowLeftFromLine
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
