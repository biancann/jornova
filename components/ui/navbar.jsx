"use client";

import { Icon } from "@iconify/react";
import Logo from "../logo";
import { Button } from "./button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white h-14 flex items-center px-4">
      <div className="w-full flex items-center justify-between h-full">
        <div>
          <Logo className="h-4" />
        </div>
        <div className="h-full flex items-center gap-8">
          <Link href="/home" className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${pathname === "/home" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"}`}>
            <Icon icon="ph:house-bold" className="w-4 h-4" />
            Home
          </Link>
          <Link href="/journal" className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${pathname === "/journal" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"}`}>
            <Icon icon="ph:pen-nib-bold" className="w-4 h-4" />
            Journal
          </Link>
          <Link href="/mood" className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${pathname === "/mood" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"}`}>
            <Icon icon="ph:chart-bar-bold" className="w-4 h-4" />
            Analytics
          </Link>
        </div>
        <div>
          <Button className="gap-2">
            <Icon icon="ph:pen-nib-bold" className="w-4 h-4" />
            Write
          </Button>
        </div>
      </div>
    </nav>
  );
}
