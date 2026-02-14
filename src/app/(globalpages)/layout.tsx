import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
