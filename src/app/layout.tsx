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
import MainPageLoader from "./_components/templates/MainPageLoader.template";
import { LanguageSwitcher } from "./_components/organisms/translations/LanguageSwitcher.organism";
import { ScriptsForTranslation } from "./_components/organisms/translations/ScriptsForTranslations";

function generateThemeCSS(org: Awaited<ReturnType<typeof getOrg>>) {
  const themeVars: string[] = [];

  // Primary
  if (org.theme_primary_bg) themeVars.push(`--theme-primary-bg: ${org.theme_primary_bg};`);
  if (org.theme_primary_hover_bg) themeVars.push(`--theme-primary-hover-bg: ${org.theme_primary_hover_bg};`);
  if (org.theme_primary_text) themeVars.push(`--theme-primary-text: ${org.theme_primary_text};`);

  // Secondary
  if (org.theme_secondary_bg) themeVars.push(`--theme-secondary-bg: ${org.theme_secondary_bg};`);
  if (org.theme_secondary_hover_bg) themeVars.push(`--theme-secondary-hover-bg: ${org.theme_secondary_hover_bg};`);
  if (org.theme_secondary_text) themeVars.push(`--theme-secondary-text: ${org.theme_secondary_text};`);

  // Outline
  if (org.theme_outline_bg) themeVars.push(`--theme-outline-bg: ${org.theme_outline_bg};`);
  if (org.theme_outline_hover_bg) themeVars.push(`--theme-outline-hover-bg: ${org.theme_outline_hover_bg};`);
  if (org.theme_outline_text) themeVars.push(`--theme-outline-text: ${org.theme_outline_text};`);

  // Ghost
  if (org.theme_ghost_bg) themeVars.push(`--theme-ghost-bg: ${org.theme_ghost_bg};`);
  if (org.theme_ghost_hover_bg) themeVars.push(`--theme-ghost-hover-bg: ${org.theme_ghost_hover_bg};`);
  if (org.theme_ghost_text) themeVars.push(`--theme-ghost-text: ${org.theme_ghost_text};`);

  // Link
  if (org.theme_link_bg) themeVars.push(`--theme-link-bg: ${org.theme_link_bg};`);
  if (org.theme_link_hover_bg) themeVars.push(`--theme-link-hover-bg: ${org.theme_link_hover_bg};`);
  if (org.theme_link_text) themeVars.push(`--theme-link-text: ${org.theme_link_text};`);

  // Destructive
  if (org.theme_destructive_bg) themeVars.push(`--theme-destructive-bg: ${org.theme_destructive_bg};`);
  if (org.theme_destructive_hover_bg) themeVars.push(`--theme-destructive-hover-bg: ${org.theme_destructive_hover_bg};`);
  if (org.theme_destructive_text) themeVars.push(`--theme-destructive-text: ${org.theme_destructive_text};`);

  if (themeVars.length === 0) return "";

  return `:root { ${themeVars.join(" ")} }`;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await getOrg();
  const themeCSS = generateThemeCSS(org);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">{cssVariables}</style>
        {themeCSS && <style type="text/css">{themeCSS}</style>}
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
        {org.with_google_translations && (
          <LanguageSwitcher defaultLanguage={org.default_language} />
        )}
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
