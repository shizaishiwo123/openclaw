import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "致温嘉璇 💕",
  description: "一封来自心底的表白",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
