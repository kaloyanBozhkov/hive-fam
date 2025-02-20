"use client";
import { useEffect } from "react";

// sometimes rendered component on FE is not translated so we gotta do 2nd round
export const RetranslateChildren = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const id = setTimeout(() => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "auto",
            includedLanguages: "en,bg",
            autoDisplay: true,
          },
          "google_translate_element",
        );
      }
    }, 300);
    return () => clearTimeout(id);
  }, [children]);
  return <div id="google_translate_element">{children}</div>;
};
