"use client";
import { Inter } from "next/font/google";
// import "./globals.css";
import Footer from "../../components/reusableComponent/footer";
import Header from "../../components/reusableComponent/header";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Customize AOS settings here
    });
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
