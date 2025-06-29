import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-white">
        <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
