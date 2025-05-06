import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { ToastContainer } from "react-toastify";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });


const onestSans = Onest({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "Shoeven",
  description: "Inventory App for managing shoe inventories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={onestSans.className}
      >
        <ToastContainer/>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
