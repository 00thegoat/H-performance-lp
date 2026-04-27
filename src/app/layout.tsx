import type { Metadata } from "next";
import "./globals.css";
import "@/snapshot/styles.css";
import SiteAnimations from "@/components/SiteAnimations";

export const metadata: Metadata = {
  title: "H Performance — We Build the Foundation of Your Business",
  description:
    "We combine Management, Data, Technology, and Media to deliver complete, secure, and scalable operational structures for your company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="responsive">
        <SiteAnimations />
        {children}
      </body>
    </html>
  );
}
