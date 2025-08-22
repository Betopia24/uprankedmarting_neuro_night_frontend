import LenisProvider from "@/components/Lenis";
import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <>
        <Navbar /> <main>{children}</main> <Footer />
      </>
    </LenisProvider>
  );
}
