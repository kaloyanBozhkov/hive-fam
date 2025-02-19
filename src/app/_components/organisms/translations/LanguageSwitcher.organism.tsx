"use client";
import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/_components/shadcn/DropdownMenu.shadcn";
import { FlagIcon, FlagIconCode } from "react-flag-kit";
import "./LanguageSwitcher.styles.css";

const COOKIE_NAME = "googtrans";

interface LanguageDescriptor {
  name: string;
  title: string;
}

declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[];
      defaultLanguage: string;
    };
  }
}

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [languageConfig, setLanguageConfig] = useState<any>();

  useEffect(() => {
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    if (global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
    if (languageValue) {
      setCurrentLanguage(languageValue);
    }
    if (global.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, []);

  if (!currentLanguage || !languageConfig) {
    return null;
  }

  const switchLanguage = (lang: string) => () => {
    setCookie(null, COOKIE_NAME, "/auto/" + lang);
    window.location.reload();
  };

  return (
    <div className="notranslate animate-it-in fixed bottom-[-1px] z-[100] text-center lg:right-[50px]">
      <DropdownMenu>
        <DropdownMenuTrigger className="notranslate text-center">
          <div className="mx-3 flex cursor-pointer items-center gap-2 rounded-tl-lg rounded-tr-lg border-l border-r border-t bg-white px-4 py-1 shadow-lg">
            <FlagIcon
              code={
                (currentLanguage === "en"
                  ? "gb"
                  : currentLanguage
                ).toUpperCase() as FlagIconCode
              }
              size={20}
            />
            {languageConfig.languages.find(
              (ld: LanguageDescriptor) => ld.name === currentLanguage,
            )?.title || "Select Language"}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languageConfig.languages
            .filter((l: LanguageDescriptor) => l.name !== currentLanguage)
            .map((ld: LanguageDescriptor) => (
              <DropdownMenuItem
                key={`l_s_${ld.name}`}
                onClick={switchLanguage(ld.name)}
                className="notranslate flex cursor-pointer items-center gap-2"
              >
                <FlagIcon
                  code={
                    (ld.name === "en"
                      ? "gb"
                      : ld.name
                    ).toUpperCase() as FlagIconCode
                  }
                  size={20}
                />
                {ld.title}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };
