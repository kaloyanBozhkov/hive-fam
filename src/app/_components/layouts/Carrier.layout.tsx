import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import AOS from "@/app/_components/next-components/AOS.next";
import cssVariables from "../../../../tailwind/plugins";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "../../_components/organisms/Header.organism";
import { Toaster } from "../../_components/shadcn/Toaster.shadcn";
import { URLToasts } from "../../_components/organisms/URLToasts.organism";
import { BGTemplate } from "../../_components/templates/BG.template";
import MainPageLoader from "../../_components/templates/MainPageLoader.template";
import { LanguageSwitcher } from "../../_components/organisms/translations/LanguageSwitcher.organism";
import { ScriptsForTranslation } from "../../_components/organisms/translations/ScriptsForTranslations";
import type { organization as Organization } from "@prisma/client";

export default function CarrierLayout({
  children,
  org,
}: {
  children: React.ReactNode;
  org: Organization;
}) {
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
        <ScriptsForTranslation />
      </head>
      <body className="relative">
        <LanguageSwitcher defaultLanguage={org.default_language} />
        <MainPageLoader>
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
          <BGTemplate org={org} />
        </MainPageLoader>
      </body>
    </html>
  );
}
