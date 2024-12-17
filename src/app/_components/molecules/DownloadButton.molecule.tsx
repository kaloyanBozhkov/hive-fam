"use client";

import { Button, type ButtonProps } from "../shadcn/Button.shadcn";
import html2canvas from "html2canvas";
import { forceDownload } from "@/utils/common";

export const DownloadButton = ({
  selector,
  fileName,
  alsoHideSelector,
  label = "Download",
  ...btnProps
}: {
  selector: string;
  fileName: string;
  label?: string;
  alsoHideSelector?: string;
} & Partial<ButtonProps>) => {
  const btnId = `download-${selector}`;
  const downloadTicket = () => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.style.display = "none";
    if (alsoHideSelector) {
      const alsoHide = document.querySelectorAll(alsoHideSelector);
      alsoHide.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    }
    const ticket = document.querySelector(selector);
    if (!ticket) return;
    html2canvas(ticket as HTMLElement, { useCORS: true })
      .then((canvas) => {
        forceDownload(canvas.toDataURL(), fileName);
        btn.style.display = "block";
        if (alsoHideSelector) {
          const alsoHide = document.querySelectorAll(alsoHideSelector);
          alsoHide.forEach((el) => {
            (el as HTMLElement).style.display = "block";
          });
        }
      })
      .catch(() => {
        console.log("Failed to download");
      });
  };

  return (
    <Button onClick={downloadTicket} id={btnId} {...btnProps}>
      {label}
    </Button>
  );
};
