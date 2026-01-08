"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HexColorPicker, RgbColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover.shadcn";
import { Button } from "./Button.shadcn";
import { Input } from "./Input.shadcn";
import type { ButtonProps } from "./Button.shadcn";
import { useForwardedRef } from "@/app/hooks/shadcn/useForwardRef.shadcn";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  withOpacity?: boolean;
}

const parseRgba = (value: string) => {
  if (!value) return { r: 0, g: 0, b: 0, a: 1 };
  const match = value.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );
  if (match) {
    return {
      r: parseInt(match[1] ?? "0"),
      g: parseInt(match[2] ?? "0"),
      b: parseInt(match[3] ?? "0"),
      a: match[4] ? parseFloat(match[4]) : 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
  (
    {
      disabled,
      value,
      onChange,
      onBlur,
      name,
      className,
      withOpacity = false,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    // Local state to prevent update loops during dragging
    const [localRgba, setLocalRgba] = useState(() => parseRgba(value));
    const [localHex, setLocalHex] = useState(value || "#000");
    const isDraggingRef = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Sync local state when external value changes (only when not actively dragging)
    useEffect(() => {
      if (isDraggingRef.current) return;
      if (withOpacity) {
        setLocalRgba(parseRgba(value));
      } else {
        setLocalHex(value || "#000");
      }
    }, [value, withOpacity]);

    const debouncedOnChange = useCallback(
      (newValue: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onChange(newValue);
        }, 50);
      },
      [onChange],
    );

    const handlePickerChange = useCallback(
      (color: { r: number; g: number; b: number } | string) => {
        isDraggingRef.current = true;
        if (typeof color === "string") {
          setLocalHex(color);
          debouncedOnChange(color);
        } else {
          const newRgba = { ...color, a: localRgba.a };
          setLocalRgba(newRgba);
          debouncedOnChange(
            `rgba(${color.r}, ${color.g}, ${color.b}, ${newRgba.a})`,
          );
        }
      },
      [debouncedOnChange, localRgba.a],
    );

    const handlePickerEnd = useCallback(() => {
      isDraggingRef.current = false;
    }, []);

    const displayValue = useMemo(() => {
      if (withOpacity) {
        return `rgba(${localRgba.r}, ${localRgba.g}, ${localRgba.b}, ${localRgba.a})`;
      }
      return localHex;
    }, [localRgba, localHex, withOpacity]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn("block", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            style={{
              backgroundColor: displayValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full"
          onPointerUp={handlePickerEnd}
          onPointerLeave={handlePickerEnd}
        >
          {withOpacity ? (
            <>
              <RgbColorPicker color={localRgba} onChange={handlePickerChange} />
              <Input
                onChange={(e) => {
                  onChange(e?.currentTarget?.value);
                }}
                ref={ref}
                value={displayValue}
              />
            </>
          ) : (
            <>
              <HexColorPicker color={localHex} onChange={handlePickerChange} />
              <Input
                maxLength={7}
                onChange={(e) => {
                  onChange(e?.currentTarget?.value);
                }}
                ref={ref}
                value={localHex}
              />
            </>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
