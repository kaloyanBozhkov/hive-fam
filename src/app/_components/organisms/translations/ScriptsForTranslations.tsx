import Script from "next/script";
import { getPathname } from "@/server/utils.server";

export const ScriptsForTranslation = async () => {
  const pathname = await getPathname();
  const disabled = pathname?.includes("/staff/manage/");
  if (disabled) return null;
  return (
    <>
      <Script
        src="/assets/scripts/lang-config.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/scripts/translation.js"
        strategy="beforeInteractive"
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
        strategy="afterInteractive"
      />
    </>
  );
};
