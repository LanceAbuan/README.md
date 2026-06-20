"use client";

import { ThemeProvider } from "next-themes";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MantineProvider theme={theme}>
        <AnimatedBackground />
        <Header />
        <main className="relative z-10 flex-1 pt-16">{children}</main>
        <Footer />
      </MantineProvider>
    </ThemeProvider>
  );
}
