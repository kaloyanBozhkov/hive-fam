import { twMerge } from "tailwind-merge";

export default function RichTextReader({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "[&_a:hover]:text-blue-600 [&_a]:text-blue-500",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
