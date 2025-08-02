'use client';

import Image from "next/image";
import close from "@/images/close.svg";
import ActiveLink from "../ActiveLink";
import navbarData from "@/data/navbarData";
import { useState } from "react";
import { motion } from "framer-motion";
import burgerMenu from "@/images/burger-menu.svg";

export default function MobileNavigation() {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    return <><button onClick={toggle} className="cursor-pointer"><Image src={burgerMenu} alt="menu" /></button>
        <motion.div transition={{ duration: 0.3, ease: "linear" }} animate={{ y: open ? 0 : "-100%" }} className="fixed top-0 inset-x-0 bg-grey-600 text-white pt-8 pb-14 space-y-6 px-6">
            <div className="flex justify-end">
                <button onClick={toggle} className="cursor-pointer"><Image src={close} alt="close" /></button>
            </div>
            <ul className="flex flex-col gap-4">
                {navbarData.map((item) => (
                    <li key={item.name}>
                        <ActiveLink className="w-full" href={item.href()}>{item.name}</ActiveLink>
                    </li>
                ))}
            </ul>
        </motion.div></>
}