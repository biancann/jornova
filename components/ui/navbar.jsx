"use client";

import { Icon } from "@iconify/react";
import Logo from "../logo";
import { buttonVariants } from "./button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white h-14 flex items-center px-4 border-b shadow">
      <div className="w-full flex items-center justify-between h-full">
        <Link href="/">
          <Logo className="h-4" />
        </Link>
        <div className="h-full flex items-center gap-8">
          <Link
            href="/home"
            className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${
              pathname === "/home" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"
            }`}
          >
            <Icon icon="ph:house-bold" className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/journal"
            className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${
              pathname === "/journal" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"
            }`}
          >
            <Icon icon="ph:pen-nib-bold" className="w-4 h-4" />
            Journal
          </Link>
          {/* <Link
            href="/mood"
            className={`h-full gap-1.5 flex items-center px-2 border-b-2 transition-all ${
              pathname === "/mood" ? "border-indigo-500 text-indigo-500" : "border-transparent hover:border-gray-200"
            }`}
          >
            <Icon icon="ph:chart-bar-bold" className="w-4 h-4" />
            Analytics
          </Link> */}
        </div>
        <div>
          <Link href="/journal/new" className={buttonVariants() + " gap-2"}>
            <Icon icon="ph:pen-nib-bold" className="w-4 h-4" />
            Write
          </Link>
        </div>
      </div>
    </nav>
  );
}
