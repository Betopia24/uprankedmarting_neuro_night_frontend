"use client";

import Image from "next/image";
import { useAuth } from "./AuthProvider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/features/auth/LogoutButton";
import { LucideLogOut } from "lucide-react";

export default function ProfileButton() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-lg px-2 py-2 bg-slate-50 border border-gray-200 text-black hover:bg-slate-100"
        >
          <UserImage image={user.image} username={user.name} />
          <span className="text-sm font-medium capitalize">{user.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 border-gray-200 z-[9999]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b border-b-gray-200 pb-2">
            <UserImage image={user.image} username={user.name} />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <LogoutButton className="w-full" size="sm">
              <LucideLogOut /> Sign Out
            </LogoutButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserImage({ image, username }: { image?: string; username: string }) {
  console.log(image);
  return image ? (
    <Image
      src={image}
      alt={username}
      width={32}
      height={32}
      className="size-8 rounded-full object-cover"
      unoptimized
    />
  ) : (
    <span className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
      {username.slice(0, 1).toUpperCase()}
    </span>
  );
}
