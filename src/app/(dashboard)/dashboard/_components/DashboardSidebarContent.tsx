"use client";

import { useSidebar } from "./SidebarProvider";
import { motion } from "framer-motion";
import DashboardActiveLink from "./DashboardActiveLink";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Users,
  UserCog,
  PhoneCall,
  FileUp,
  Mic,
  Workflow,
  Settings,
  BarChart3,
  MessageSquare,
  Phone,
  CreditCard,
  Blocks,
} from "lucide-react";

export type SidebarItemType = {
  name: string;
  href: string;
  icon: string;
  children?: SidebarItemType[];
};

type SidebarContentType = {
  mainItems: SidebarItemType[];
  subItems?: SidebarItemType[];
};

const icons = {
  layoutDashboard: LayoutDashboard,
  users: Users,
  userCog: UserCog,
  phoneCall: PhoneCall,
  fileUp: FileUp,
  mic: Mic,
  workflow: Workflow,
  settings: Settings,
  barChart3: BarChart3,
  messageSquare: MessageSquare,
  phone: Phone,
  creditCard: CreditCard,
  blocks: Blocks,
};

export default function SidebarContent({
  mainItems,
  subItems,
}: SidebarContentType) {
  const { isCollapsedSidebar } = useSidebar();
  return (
    <div className="h-full flex flex-col justify-between gap-6 px-2">
      <ul className={cn("space-y-2")}>
        {mainItems.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <li key={item.name}>
              <DashboardActiveLink
                className={cn("flex items-center whitespace-nowrap h-10")}
                href={item.href}
              >
                <span className="flex h-10 w-12 shrink-0 items-center justify-center">
                  <Icon className="size-4" />
                </span>
                <AnimatedLabel>{item.name}</AnimatedLabel>
              </DashboardActiveLink>
            </li>
          );
        })}
      </ul>
      {subItems && (
        <ul className={cn("space-y-2", isCollapsedSidebar && "space-y-4")}>
          {subItems.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <li key={item.name}>
                <DashboardActiveLink
                  className={cn("flex items-center whitespace-nowrap")}
                  href={item.href}
                >
                  <span className="flex h-10 w-12 shrink-0 items-center justify-center">
                    <Icon className="size-4" />
                  </span>
                  <AnimatedLabel>{item.name}</AnimatedLabel>
                </DashboardActiveLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const animatedLabelVariants = {
  collapsed: {
    opacity: 0,
  },
  expanded: {
    opacity: 1,
  },
};

function AnimatedLabel({ children }: React.PropsWithChildren) {
  const { isExpanded } = useSidebar();

  return (
    isExpanded && (
      <motion.span
        variants={animatedLabelVariants}
        initial="collapsed"
        animate="expanded"
      >
        {children}
      </motion.span>
    )
  );
}
