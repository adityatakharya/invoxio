import type { Metadata } from "next";
import localFont from "next/font/local";
import { SocketContextProvider } from "../context/SocketContextProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Invoxio',
  description: "Secure chatrooms for every purpose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="000000" />
        </head>
      <SocketContextProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </SocketContextProvider>
    </html>
  );
}
