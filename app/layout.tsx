import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Log",
  description: "A private-first journal and shareable blog system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
