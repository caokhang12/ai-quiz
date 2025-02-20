"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
type Props = {
  user: Pick<User, "id" | "email" | "name" | "image">;
};

const UserAcountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-lg">{user.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-gray-400 text-sm pt-0 truncate">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">meow</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-500 font-semibold cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
          <LogOut className="w-6 h-6" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAcountNav;
