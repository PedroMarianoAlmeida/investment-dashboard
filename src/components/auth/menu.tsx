"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { Menu, CircleUserRound } from "lucide-react";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  Menubar,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NoImage = () => <CircleUserRound className="!w-full !h-full" />;

interface MenuCommonProps {
  trigger: ReactNode;
  content: ReactNode;
}
const MenuCommon = ({ trigger, content }: MenuCommonProps) => {
  return (
    <Menubar className="bg-accent rounded-full h-12">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-transparent data-[state=open]:bg-transparent">
          <div className="flex gap-2 items-center cursor-pointer">
            <Menu />
            {trigger}
          </div>
        </MenubarTrigger>
        <MenubarContent>{content}</MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export const AuthMenu = () => {
  const { data: session } = useSession();

  if (!session)
    return (
      <MenuCommon
        content={
          <MenubarItem onClick={() => signIn()} className="justify-center">
            Sign In
          </MenubarItem>
        }
        trigger={
          <Avatar className="w-10 h-10">
            <NoImage />
          </Avatar>
        }
      />
    );

  return (
    <MenuCommon
      content={
        <>
          <MenubarItem onClick={() => signOut()} className="justify-center">
            Sign Out
          </MenubarItem>
          <MenubarItem asChild className="flex justify-center w-full">
            <Link href="/dashboard" className="block text-center">
              Dashboard
            </Link>
          </MenubarItem>
        </>
      }
      trigger={
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={session.user?.image ?? ""}
            alt={session.user?.name ?? "Visitor"}
            className="w-full h-full"
          />
          <AvatarFallback>
            <NoImage />
          </AvatarFallback>
        </Avatar>
      }
    />
  );
};
