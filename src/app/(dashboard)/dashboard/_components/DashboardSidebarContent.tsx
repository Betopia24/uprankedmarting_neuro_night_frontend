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
// import { getSubscriptionType } from "@/app/api/subscription/subscription";
// import { getServerAuth } from "@/lib/auth";
// import { Button } from "@/components/ui/button";
// import { Link } from 'next/link';
// import { useAuth } from "@/components/AuthProvider";

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

export default async function SidebarContent({
  mainItems,
  subItems,
}: SidebarContentType) {
  const { isCollapsedSidebar } = useSidebar();
  // const auth = await useAuth();

  // if (!auth.token) {
  //   console.error("Missing access token from getServerAuth()");
  //   return <div className="text-red-500">Unauthorized: No access token</div>;
  // }

  // let subscription;
  // try {
  //   subscription = await getSubscriptionType(auth.token);
  // } catch (err) {
  //   console.error("Error loading subscription:", err);
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-red-500 flex flex-col items-center">
  //         <h1 className="text-2xl font-semibold">Buy a number first</h1>
  //         {/* <Button variant={"link"} className="mt-4">
  //           <a href="/dashboard/organization/explore-numbers">Explore Numbers</a>
  //         </Button> */}
  //         <Link href="/dashboard/organization/explore-numbers">Explore Numbers</Link>
  //       </div>
  //     </div>
  //   );
  // }

  // console.log(subscription);

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
