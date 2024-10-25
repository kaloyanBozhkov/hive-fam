import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";

import AOS from "@/app/_components/next-components/AOS.next";
import cssVariables from "../../tailwind/plugins";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "./_components/organisms/Header.organism";
import { Toaster } from "./_components/shadcn/Toaster.shadcn";
import { URLToasts } from "./_components/organisms/URLToasts.organism";
export const metadata = {
  title: "HiveFam",
  description: "Bringing back the 00s sound. SOFIA | BULGARIA",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">{cssVariables}</style>
        <GoogleAnalytics gaId="G-9XF47FL1PM" />
      </head>
      <body>
        <TRPCReactProvider>
          <AOS>
            <div className="grid-page min-h-screen w-full pb-4">
              <Header />
              {children}
<<<<<<< HEAD
              <Toaster />
              <URLToasts />
=======
>>>>>>> f3fb6be1da6876d7d8db7efbbd91fe90e89bde5c
            </div>
          </AOS>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
