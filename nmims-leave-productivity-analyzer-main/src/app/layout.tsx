import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NMIMS Leave & Productivity Analyzer",
  description: "Employee attendance, leave usage, and productivity analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}