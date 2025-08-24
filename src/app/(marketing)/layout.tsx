import LenisProvider from "@/components/Lenis";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

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
