"use client";
import { Inter } from "next/font/google";
import "./globals.css";
// import Footer from "../app/components/reusableComponent/footer";
// import Header from "../app/components/reusableComponent/header";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Provider } from 'react-redux';
import store from '../redux/store';

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
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
