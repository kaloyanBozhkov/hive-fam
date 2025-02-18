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
import { BGTemplate } from "./_components/templates/BG.template";

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
        {org?.display_name && <title>{org?.display_name}</title>}
        {org?.description && (
          <meta name="description" content={org?.description} />
        )}
        {(org?.favicon_data_url ?? org?.brand_logo_data_url) && (
          <link
            rel="icon"
            href={
              org?.favicon_data_url ??
              org?.brand_logo_data_url ??
              "/favicon.ico"
            }
          />
        )}
      </head>
      <body className="relative">
        <TRPCReactProvider>
          <AOS>
            <div className="grid-page relative z-[1] min-h-screen w-full pb-4">
              <Header brandName={org?.display_name ?? ""} />
              {children}
              <Toaster />
              <URLToasts />
            </div>
          </AOS>
        </TRPCReactProvider>
        <BGTemplate bg={org?.bg_image} bgColor={org?.bg_color} />
      </body>
    </html>
  );
}
