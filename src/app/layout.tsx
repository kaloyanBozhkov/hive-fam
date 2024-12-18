import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";

import AOS from "@/app/_components/next-components/AOS.next";
import cssVariables from "../../tailwind/plugins";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "./_components/organisms/Header.organism";
import { Toaster } from "./_components/shadcn/Toaster.shadcn";
import { URLToasts } from "./_components/organisms/URLToasts.organism";
import { getOrg } from "@/server/actions/org";

export async function generateMetadata() {
  const org = await getOrg();
  return {
    title: org?.display_name,
    description: org?.description,
    icons: [
      {
        rel: "icon",
        url:
          org?.favicon_data_url ?? org?.brand_logo_data_url ?? "/favicon.ico",
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await getOrg();
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
              <Header brandName={org?.display_name ?? ""} />
              {children}
              <Toaster />
              <URLToasts />
            </div>
          </AOS>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
