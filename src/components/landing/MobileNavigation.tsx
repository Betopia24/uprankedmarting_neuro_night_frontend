"use client";

import Image from "next/image";
import ActiveLink from "../ActiveLink";
import navbarData from "@/data/navbarData";
import { useState } from "react";
import { motion } from "framer-motion";
import burgerMenu from "@/images/burger-menu.svg";
import { LucideX } from "lucide-react";
import AuthActions from "./AuthActions";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <>
      <button onClick={toggle} className="cursor-pointer size-10">
        <Image src={burgerMenu} alt="menu" />
      </button>
      <motion.div
        transition={{ duration: 0.3, ease: "linear" }}
        animate={{ y: open ? 0 : "-100%" }}
        className="fixed z-[9999] top-0 inset-x-0 bg-gray-50 text-gray-900 pt-8 pb-14 space-y-6 px-6 shadow-2xl rounded"
      >
        <div className="flex justify-end">
          <button onClick={toggle} className="cursor-pointer">
            <LucideX />
          </button>
        </div>
        <ul className="flex flex-col gap-4">
          {navbarData.map((item) => (
            <li key={item.name}>
              <ActiveLink className="w-full" href={item.href()} onClick={() => setOpen(false)}>
                {item.name}
              </ActiveLink>
            </li>
          ))}
          <li className="flex gap-4">
            <AuthActions />
          </li>
        </ul>
      </motion.div>
    </>
  );
}
