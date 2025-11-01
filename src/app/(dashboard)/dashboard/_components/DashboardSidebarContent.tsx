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
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { dashboardNavigation } from "@/data/dashboardNavbar";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import SkeletonSidebar from "@/components/SkeletonSidebar";

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
  const auth = useAuth();

  const [orgMenu, setOrgMenu] = useState<SidebarItemType[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      if (auth?.user?.role === "organization_admin" && auth?.token) {
        setLoading(true);
        try {
          const subscription = await getSubscriptionType(auth.token);

          const hasActive = subscription.status === "ACTIVE" || "TRIALING";

          if (hasActive) {
            setOrgMenu(dashboardNavigation.organization);
          } else {
            setOrgMenu(dashboardNavigation.organization.slice(0, 2));
          }
        } catch (error) {
          setOrgMenu(dashboardNavigation.organization.slice(0, 2));
        } finally {
          setLoading(false);
        }
      }
    };

    loadSubscription();
  }, [auth]);

  let finalMainItems: SidebarItemType[] = [];
  let finalSubItems: SidebarItemType[] = [];

  if (auth?.user?.role === "super_admin") {
    finalMainItems = dashboardNavigation.admin;
    finalSubItems = dashboardNavigation.subItems.admin;
  } else if (auth?.user?.role === "organization_admin") {
    if (orgMenu) {
      finalMainItems = orgMenu;
      finalSubItems = dashboardNavigation.subItems.organization;
    }
  } else if (auth?.user?.role === "agent") {
    finalMainItems = dashboardNavigation.agent;
    finalSubItems = dashboardNavigation.subItems.agent;
  } else {
    finalMainItems = mainItems;
    finalSubItems = subItems || [];
  }

  if (auth?.user?.role === "organization_admin" && (loading || !orgMenu)) {
    return <SkeletonSidebar />;
  }

  return (
    <div className="h-full flex flex-col justify-between gap-6 px-2">
      <ul className={cn("space-y-2")}>
        {finalMainItems.map((item) => {
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

      {finalSubItems.length > 0 && (
        <ul className={cn("space-y-2", isCollapsedSidebar && "space-y-4")}>
          {finalSubItems.map((item) => {
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
