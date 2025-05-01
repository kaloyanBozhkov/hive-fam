import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulgarian to English Translator",
  description: "Translate Bulgarian speech to English text in real-time",
};

export default function TranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="">{children}</div>;
}
