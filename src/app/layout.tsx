import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";

import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Investment Dashboard",
  description: "by Pedro Almeida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
