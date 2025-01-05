"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const CheckboxBase = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CheckboxBase.displayName = CheckboxPrimitive.Root.displayName;

type ChekcboxWithTextProps = {
  label: string;
  subtitle?: string;
};

function CheckboxWithText({
  label,
  subtitle,
  ...props
}: ChekcboxWithTextProps) {
  return (
    <div className="items-top flex space-x-2">
      <CheckboxBase {...props} id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

const Checkbox = ({
  label,
  subtitle,
  ...props
}: ChekcboxWithTextProps &
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) => {
  if (label || subtitle)
    return <CheckboxWithText label={label} subtitle={subtitle} {...props} />;

  return <CheckboxBase {...props} />;
};

export { Checkbox };
