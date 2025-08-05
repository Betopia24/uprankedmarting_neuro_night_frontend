import {
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Megaphone,
  Package,
  Palette,
  Settings,
  Shield,
  ShoppingCart,
  Tag,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Zap,
  LucideIcon,
} from "lucide-react";

// Define the type for a single item within a submenu
export type NavItemType = {
  title: string;
  url: string;
  badge?: string | number | null; // Submenu items can also have an optional badge
};

// Define the type for a main navigation item (the ones directly under 'overview', 'commerce', etc.)
export type SidebarSectionType = {
  title: string;
  url?: string; // URL is optional if it has navItems and acts as a group header
  icon: LucideIcon; // Correctly typed for Lucide icons
  badge?: string | number | null; // Badge can be string, number, or null/undefined
  navItems?: NavItemType[]; // Changed from 'submenu' to 'navItems' to match data
};

// Define the overall structure of the navigation data
type SidebarType = Record<string, SidebarSectionType[]>;

// --- Navigation Data ---
export const navigationData: SidebarType = {
  overview: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Sales Reports", url: "#" },
        { title: "Traffic Sources", url: "#" },
        { title: "Conversion Funnel", url: "#" },
        { title: "Customer Behavior", url: "#" },
        { title: "Product Performance", url: "#" },
        { title: "Revenue Analytics", url: "#" },
      ],
    },
  ],
  commerce: [
    {
      title: "Orders",
      icon: ShoppingCart,
      badge: "23",
      navItems: [
        { title: "All Orders", url: "#", badge: "156" },
        { title: "Pending Payment", url: "#", badge: "12" },
        { title: "Processing", url: "#", badge: "8" },
        { title: "Shipped", url: "#", badge: "45" },
        { title: "Delivered", url: "#" },
        { title: "Cancelled", url: "#", badge: "3" },
        { title: "Refunded", url: "#" },
        { title: "Returns", url: "#", badge: "5" },
        { title: "Exchanges", url: "#", badge: "2" },
        { title: "Abandoned Carts", url: "#", badge: "34" },
      ],
    },
    {
      title: "Products",
      icon: Package,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "All Products", url: "#" },
        { title: "Add Product", url: "#" },
        { title: "Categories", url: "#" },
        { title: "Collections", url: "#" },
        { title: "Brands", url: "#" },
        { title: "Attributes", url: "#" },
        { title: "Variants", url: "#" },
        { title: "Reviews", url: "#", badge: "18" },
        { title: "Bulk Import", url: "#" },
        { title: "Bulk Export", url: "#" },
        { title: "SEO Optimization", url: "#" },
      ],
    },
    {
      title: "Inventory",
      icon: Warehouse,
      badge: "Low Stock",
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Stock Overview", url: "#" },
        { title: "Stock Levels", url: "#" },
        { title: "Low Stock", url: "#", badge: "24" },
        { title: "Out of Stock", url: "#", badge: "7" },
        { title: "Stock Movements", url: "#" },
        { title: "Purchase Orders", url: "#" },
        { title: "Suppliers", url: "#" },
        { title: "Warehouses", url: "#" },
        { title: "Stock Transfers", url: "#" },
      ],
    },
    {
      title: "Customers",
      icon: Users,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "All Customers", url: "#" },
        { title: "Customer Groups", url: "#" },
        { title: "Customer Segments", url: "#" },
        { title: "Loyalty Program", url: "#" },
        { title: "Reward Points", url: "#" },
        { title: "Customer Support", url: "#", badge: "6" },
        { title: "Live Chat", url: "#", badge: "3" },
        { title: "Customer Feedback", url: "#" },
      ],
    },
  ],
  marketing: [
    {
      title: "Marketing",
      icon: Megaphone,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Campaigns", url: "#" },
        { title: "Email Marketing", url: "#" },
        { title: "SMS Marketing", url: "#" },
        { title: "Social Media", url: "#" },
        { title: "Influencer Program", url: "#" },
        { title: "Affiliate Program", url: "#" },
        { title: "SEO Tools", url: "#" },
        { title: "Content Marketing", url: "#" },
        { title: "A/B Testing", url: "#" },
      ],
    },
    {
      title: "Promotions",
      url: "#",
      icon: Tag,
      badge: null,
      navItems: [
        { title: "Discount Codes", url: "#" },
        { title: "Flash Sales", url: "#" },
        { title: "Bundle Offers", url: "#" },
        { title: "Buy X Get Y", url: "#" },
        { title: "Gift Cards", url: "#" },
        { title: "Loyalty Rewards", url: "#" },
        { title: "Seasonal Sales", url: "#" },
        { title: "Volume Discounts", url: "#" },
      ],
    },
  ],
  financial: [
    {
      title: "Finance",
      icon: DollarSign,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Revenue Overview", url: "#" },
        { title: "Profit & Loss", url: "#" },
        { title: "Expenses", url: "#" },
        { title: "Tax Management", url: "#" },
        { title: "Payouts", url: "#" },
        { title: "Invoices", url: "#" },
        { title: "Financial Reports", url: "#" },
        { title: "Budget Planning", url: "#" },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      badge: null,
      navItems: [
        { title: "Payment Methods", url: "#" },
        { title: "Payment Gateways", url: "#" },
        { title: "Transactions", url: "#" },
        { title: "Refunds", url: "#" },
        { title: "Disputes", url: "#", badge: "2" },
        { title: "Fraud Protection", url: "#" },
        { title: "Payment Analytics", url: "#" },
      ],
    },
  ],
  operations: [
    {
      title: "Shipping",
      icon: Truck,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Shipping Zones", url: "#" },
        { title: "Shipping Rates", url: "#" },
        { title: "Shipping Labels", url: "#" },
        { title: "Tracking", url: "#" },
        { title: "Carriers", url: "#" },
        { title: "Delivery Options", url: "#" },
        { title: "International", url: "#" },
      ],
    },
    {
      title: "Store Settings",
      url: "#",
      icon: Settings,
      badge: null,
      navItems: [
        { title: "General", url: "#" },
        { title: "Store Details", url: "#" },
        { title: "Checkout", url: "#" },
        { title: "Notifications", url: "#" },
        { title: "Legal Pages", url: "#" },
        { title: "Domains", url: "#" },
        { title: "Languages", url: "#" },
        { title: "Currencies", url: "#" },
      ],
    },
  ],
  content: [
    {
      title: "Content",
      icon: FileText,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Pages", url: "#" },
        { title: "Blog Posts", url: "#" },
        { title: "Navigation", url: "#" },
        { title: "Media Library", url: "#" },
        { title: "Banners", url: "#" },
        { title: "Testimonials", url: "#" },
        { title: "FAQ", url: "#" },
      ],
    },
    {
      title: "Design",
      icon: Palette,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Themes", url: "#" },
        { title: "Customize", url: "#" },
        { title: "Templates", url: "#" },
        { title: "Email Templates", url: "#" },
        { title: "Mobile App", url: "#" },
        { title: "PWA Settings", url: "#" },
      ],
    },
  ],
  tools: [
    {
      title: "Apps & Extensions",
      icon: Zap,
      badge: "New",
      navItems: [
        { title: "Overview", url: "#" },
        { title: "App Store", url: "#" },
        { title: "Installed Apps", url: "#" },
        { title: "Custom Apps", url: "#" },
        { title: "API Keys", url: "#" },
        { title: "Webhooks", url: "#" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "Sales Reports", url: "#" },
        { title: "Customer Reports", url: "#" },
        { title: "Product Reports", url: "#" },
        { title: "Inventory Reports", url: "#" },
        { title: "Marketing Reports", url: "#" },
        { title: "Custom Reports", url: "#" },
        { title: "Scheduled Reports", url: "#" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      badge: null,
      navItems: [
        { title: "Overview", url: "#" },
        { title: "User Permissions", url: "#" },
        { title: "Staff Accounts", url: "#" },
        { title: "Activity Logs", url: "#" },
        { title: "Two-Factor Auth", url: "#" },
        { title: "IP Restrictions", url: "#" },
        { title: "SSL Certificate", url: "#" },
      ],
    },
  ],
};
