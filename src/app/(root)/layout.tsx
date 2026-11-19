import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf7] text-[#12211c]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;