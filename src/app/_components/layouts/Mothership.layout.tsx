import { GeistSans } from "geist/font/sans";
import type { organization as Organization } from "@prisma/client";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ScriptsForTranslation } from "../organisms/translations/ScriptsForTranslations";
import { LanguageSwitcher } from "../organisms/translations/LanguageSwitcher.organism";

export default function MothershipLayout({
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
        <LanguageSwitcher />
        <div className="size-full bg-black text-white">{children}</div>
      </body>
    </html>
  );
}
