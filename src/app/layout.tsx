import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knightfall - High-Stakes Chess Wagering",
  description: "Cinematic, high-stakes chess wagering app with social features, teams, and tournaments.",
  keywords: "chess, wagering, gaming, tournaments, social, high-stakes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-knight-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
