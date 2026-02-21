import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <SmoothScrollProvider>
         <Navbar />
      {children}
      <Footer />
    </SmoothScrollProvider>
     
    </>
  );
}
