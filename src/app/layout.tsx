import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Aptitude Simulator",
    default: "Game-Based Aptitude Assessment Simulator",
  },
  description: "Free interactive simulations designed to help you build speed, accuracy, memory and spatial reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
