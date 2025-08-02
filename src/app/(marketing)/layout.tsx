import Navbar from "@/components/marketing/Navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return <> <Navbar /> {children}</>;
}