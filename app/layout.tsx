import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linux Command Line Hacker Academy",
  description: "An interactive, source-grounded Linux command-line learning and practice system with chapters, labs, achievements, quizzes, and local progress tracking.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
