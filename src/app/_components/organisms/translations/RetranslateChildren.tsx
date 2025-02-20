"use client";
import { useEffect } from "react";

export const RetranslateChildren = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
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
  }, []);
  return <div id="google_translate_element">{children}</div>;
};
