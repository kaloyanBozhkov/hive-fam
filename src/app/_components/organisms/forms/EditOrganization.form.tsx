"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Path, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import Stack from "../../layouts/Stack.layout";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "../../shadcn/Form.shadcn";
import { Button } from "../../shadcn/Button.shadcn";
import { Input } from "../../shadcn/Input.shadcn";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../../shadcn/Textarea.shadcn";
import { FileUploadField } from "./fields/FileUploadField";
import { BGChooser } from "../../molecules/BGChooser.molecule";
import { Switch } from "../../shadcn/Switch.shadcn";
import usePreviewSettingsStore from "@/zustand/previewSettings";
import { ColorPicker } from "../../shadcn/ColorPicker.molecule";
import { Slider } from "../../shadcn/Slider.shadcn";
import { Label } from "../../shadcn/Label.shadcn";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../shadcn/Select.shadcn";
import Group from "../../layouts/Group.layout";
import { PreviewLastSavedQRCode } from "../../molecules/PreviewLastSavedQRCode";
import { TaxCalculationType } from "@prisma/client";
import { TaxCalculationTypeToLabel } from "@/utils/pricing";

// Default theme colors from globals.css (rgba format for opacity support)
const DEFAULT_THEME_COLORS = {
  primary_bg: "rgba(15, 23, 42, 1)",
  primary_hover_bg: "rgba(10, 15, 26, 1)",
  primary_text: "rgba(241, 245, 249, 1)",
  secondary_bg: "rgba(241, 245, 249, 1)",
  secondary_hover_bg: "rgba(226, 232, 240, 1)",
  secondary_text: "rgba(15, 23, 42, 1)",
  outline_bg: "rgba(255, 255, 255, 1)",
  outline_hover_bg: "rgba(241, 245, 249, 1)",
  outline_text: "rgba(0, 0, 0, 1)",
  ghost_bg: "rgba(0, 0, 0, 0)",
  ghost_hover_bg: "rgba(241, 245, 249, 1)",
  ghost_text: "rgba(0, 0, 0, 1)",
  link_bg: "rgba(0, 0, 0, 0)",
  link_hover_bg: "rgba(0, 0, 0, 0)",
  link_text: "rgba(15, 23, 42, 1)",
  destructive_bg: "rgba(239, 68, 68, 1)",
  destructive_hover_bg: "rgba(220, 38, 38, 1)",
  destructive_text: "rgba(241, 245, 249, 1)",
};

const organization = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    display_name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    brand_logo_data_url: z.string().optional().nullable(),
    favicon_data_url: z.string().optional().nullable(),
    bg_image: z.string().optional().nullable(),
    bg_color: z.string().optional().nullable(),
    bg_opacity: z.number().min(0).max(1).optional(),
    bg_size: z.string().optional(),
    large_banners_desktop: z.boolean().optional(),
    qr_brand_text: z.string().nullable(),
    qr_dark_color: z.string().nullable(),
    qr_bright_color: z.string().nullable(),
    tax_percentage: z.number().min(0).max(100),
    tax_calculation_type: z
      .nativeEnum(TaxCalculationType)
      .default(TaxCalculationType.TAX_ADDED_TO_PRICE_ON_CHECKOUT),
    default_language: z.string().default("en"),
    with_google_translations: z.boolean().default(true),
    theme_primary_bg: z.string().optional().nullable(),
    theme_primary_hover_bg: z.string().optional().nullable(),
    theme_primary_text: z.string().optional().nullable(),
    theme_secondary_bg: z.string().optional().nullable(),
    theme_secondary_hover_bg: z.string().optional().nullable(),
    theme_secondary_text: z.string().optional().nullable(),
    theme_outline_bg: z.string().optional().nullable(),
    theme_outline_hover_bg: z.string().optional().nullable(),
    theme_outline_text: z.string().optional().nullable(),
    theme_ghost_bg: z.string().optional().nullable(),
    theme_ghost_hover_bg: z.string().optional().nullable(),
    theme_ghost_text: z.string().optional().nullable(),
    theme_link_bg: z.string().optional().nullable(),
    theme_link_hover_bg: z.string().optional().nullable(),
    theme_link_text: z.string().optional().nullable(),
    theme_destructive_bg: z.string().optional().nullable(),
    theme_destructive_hover_bg: z.string().optional().nullable(),
    theme_destructive_text: z.string().optional().nullable(),
  })
  .transform((data) => {
    if (data.tax_calculation_type === TaxCalculationType.TAX_HIDDEN_IN_PRICE) {
      return {
        ...data,
        tax_percentage: 0,
      };
    }
    return data;
  });

const EditOrganizationForm = ({
  className,
  initialData,
  onEdit,
  orgId,
}: {
  className?: string;
  initialData: z.infer<typeof organization>;
  orgId: string;
  onEdit: (
    organizationData: z.infer<typeof organization>,
  ) => Promise<{ success: boolean; error?: string }>;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [withBG, setWithBG] = useState(!!initialData.bg_image);
  const [bgSizeCustom, setBgSizeCustom] = useState(
    initialData.bg_size !== "contain" && initialData.bg_size !== "cover",
  );
  const setPreviewBG = usePreviewSettingsStore(
    ({ setPreviewBG }) => setPreviewBG,
  );
  const setPreviewBGColor = usePreviewSettingsStore(
    ({ setPreviewBGColor }) => setPreviewBGColor,
  );
  const setPreviewBGOpacity = usePreviewSettingsStore(
    ({ setPreviewBGOpacity }) => setPreviewBGOpacity,
  );
  const setPreviewBgSize = usePreviewSettingsStore(
    ({ setPreviewBGSize }) => setPreviewBGSize,
  );

  const form = useForm<z.infer<typeof organization>>({
    resolver: zodResolver(organization),
    defaultValues: {
      ...initialData,
      theme_primary_bg:
        initialData.theme_primary_bg ?? DEFAULT_THEME_COLORS.primary_bg,
      theme_primary_hover_bg:
        initialData.theme_primary_hover_bg ??
        DEFAULT_THEME_COLORS.primary_hover_bg,
      theme_primary_text:
        initialData.theme_primary_text ?? DEFAULT_THEME_COLORS.primary_text,
      theme_secondary_bg:
        initialData.theme_secondary_bg ?? DEFAULT_THEME_COLORS.secondary_bg,
      theme_secondary_hover_bg:
        initialData.theme_secondary_hover_bg ??
        DEFAULT_THEME_COLORS.secondary_hover_bg,
      theme_secondary_text:
        initialData.theme_secondary_text ?? DEFAULT_THEME_COLORS.secondary_text,
      theme_outline_bg:
        initialData.theme_outline_bg ?? DEFAULT_THEME_COLORS.outline_bg,
      theme_outline_hover_bg:
        initialData.theme_outline_hover_bg ??
        DEFAULT_THEME_COLORS.outline_hover_bg,
      theme_outline_text:
        initialData.theme_outline_text ?? DEFAULT_THEME_COLORS.outline_text,
      theme_ghost_bg:
        initialData.theme_ghost_bg ?? DEFAULT_THEME_COLORS.ghost_bg,
      theme_ghost_hover_bg:
        initialData.theme_ghost_hover_bg ?? DEFAULT_THEME_COLORS.ghost_hover_bg,
      theme_ghost_text:
        initialData.theme_ghost_text ?? DEFAULT_THEME_COLORS.ghost_text,
      theme_link_bg: initialData.theme_link_bg ?? DEFAULT_THEME_COLORS.link_bg,
      theme_link_hover_bg:
        initialData.theme_link_hover_bg ?? DEFAULT_THEME_COLORS.link_hover_bg,
      theme_link_text:
        initialData.theme_link_text ?? DEFAULT_THEME_COLORS.link_text,
      theme_destructive_bg:
        initialData.theme_destructive_bg ?? DEFAULT_THEME_COLORS.destructive_bg,
      theme_destructive_hover_bg:
        initialData.theme_destructive_hover_bg ??
        DEFAULT_THEME_COLORS.destructive_hover_bg,
      theme_destructive_text:
        initialData.theme_destructive_text ??
        DEFAULT_THEME_COLORS.destructive_text,
    },
  });

  const handleSubmit = (data: z.infer<typeof organization>) => {
    startTransition(async () => {
      const result = await onEdit(data);
      if (result.success) {
        router.push("/staff/manage/admin");
      } else {
        form.setError("name", { message: result.error });
      }
    });
  };

  const handleResetThemeColors = () => {
    form.setValue("theme_primary_bg", DEFAULT_THEME_COLORS.primary_bg);
    form.setValue("theme_primary_hover_bg", DEFAULT_THEME_COLORS.primary_hover_bg);
    form.setValue("theme_primary_text", DEFAULT_THEME_COLORS.primary_text);
    form.setValue("theme_secondary_bg", DEFAULT_THEME_COLORS.secondary_bg);
    form.setValue("theme_secondary_hover_bg", DEFAULT_THEME_COLORS.secondary_hover_bg);
    form.setValue("theme_secondary_text", DEFAULT_THEME_COLORS.secondary_text);
    form.setValue("theme_outline_bg", DEFAULT_THEME_COLORS.outline_bg);
    form.setValue("theme_outline_hover_bg", DEFAULT_THEME_COLORS.outline_hover_bg);
    form.setValue("theme_outline_text", DEFAULT_THEME_COLORS.outline_text);
    form.setValue("theme_ghost_bg", DEFAULT_THEME_COLORS.ghost_bg);
    form.setValue("theme_ghost_hover_bg", DEFAULT_THEME_COLORS.ghost_hover_bg);
    form.setValue("theme_ghost_text", DEFAULT_THEME_COLORS.ghost_text);
    form.setValue("theme_link_bg", DEFAULT_THEME_COLORS.link_bg);
    form.setValue("theme_link_hover_bg", DEFAULT_THEME_COLORS.link_hover_bg);
    form.setValue("theme_link_text", DEFAULT_THEME_COLORS.link_text);
    form.setValue("theme_destructive_bg", DEFAULT_THEME_COLORS.destructive_bg);
    form.setValue("theme_destructive_hover_bg", DEFAULT_THEME_COLORS.destructive_hover_bg);
    form.setValue("theme_destructive_text", DEFAULT_THEME_COLORS.destructive_text);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: Path<z.infer<typeof organization>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue(name, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formTaxCalcType = form.getValues("tax_calculation_type");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="brand_logo_data_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "brand_logo_data_url")}
                  />
                </FormControl>
                {field.value && (
                  <img
                    src={field.value}
                    alt="Logo preview"
                    className="mt-2 max-h-40 object-contain"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FileUploadField
            form={form}
            organizationId={orgId}
            name="brand_logo_data_url"
            label="Brand Logo"
            accept="image/*"
          />
          <FormField
            control={form.control}
            name="favicon_data_url"
            render={({ field }) => {
              // fallback to brand_logo_data_url if set
              const favicon = field.value;

              return (
                <FormItem>
                  <FormLabel>Favicon (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "favicon_data_url")}
                    />
                  </FormControl>
                  {favicon && (
                    <img
                      src={favicon}
                      alt="Favicon preview"
                      className="mt-2 max-h-40 object-contain"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="qr_brand_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QR Brand Text (optional)</FormLabel>
                <FormDescription>
                  This will appear on each Ticket&apos;s QR code, under the
                  brand logo. Leave empty to not show this at all.
                </FormDescription>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PreviewLastSavedQRCode orgId={orgId} />
          <FormField
            control={form.control}
            name="qr_dark_color"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    QR Code: Choose dark color
                  </FormLabel>
                  <FormDescription>
                    Usually black for maximum contrast
                  </FormDescription>
                </div>
                <Stack className="gap-2">
                  <FormControl>
                    <ColorPicker
                      onChange={(bg) => {
                        field.onChange(bg);
                      }}
                      value={form.getValues("qr_dark_color") ?? ""}
                    />
                  </FormControl>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="qr_bright_color"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    QR Code: Choose bright color
                  </FormLabel>
                  <FormDescription>
                    Usually white for maximum contrast
                  </FormDescription>
                </div>
                <Stack className="gap-2">
                  <FormControl>
                    <ColorPicker
                      onChange={(bg) => {
                        field.onChange(bg);
                      }}
                      value={form.getValues("qr_bright_color") ?? ""}
                    />
                  </FormControl>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bg_color"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Website Custom Background Color
                  </FormLabel>
                  <FormDescription>
                    This will set a custom background color to the whole
                    website.
                  </FormDescription>
                </div>
                <Stack className="gap-2">
                  <FormControl>
                    <ColorPicker
                      onChange={(bg) => {
                        field.onChange(bg);
                        setPreviewBGColor(bg);
                      }}
                      value={form.getValues("bg_color") ?? ""}
                    />
                  </FormControl>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bg_image"
            render={({ field }) => (
              <FormItem className="flex flex-row flex-wrap items-stretch justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    With Background Image/Effect
                  </FormLabel>
                  <FormDescription>
                    This will set a bg effect to the whole website.
                  </FormDescription>
                </div>
                <Stack className="gap-2">
                  <FormControl>
                    <Switch
                      checked={withBG}
                      onCheckedChange={() => {
                        setWithBG((prev) => {
                          if (!prev) {
                            field.onChange(null);
                            setPreviewBG(null);
                          }
                          return !prev;
                        });
                      }}
                    />
                  </FormControl>
                </Stack>
                {withBG && (
                  <div className="basis-full flex-wrap">
                    <BGChooser
                      onSelect={(bg) => {
                        field.onChange(bg);
                        setPreviewBG(bg);
                      }}
                      selectedBg={form.getValues("bg_image") ?? ""}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {withBG && (
            <FormField
              control={form.control}
              name="bg_opacity"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-wrap items-stretch justify-between gap-4 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Background Opacity
                    </FormLabel>
                    <FormDescription>
                      This will set the opacity of the background image.
                    </FormDescription>
                  </div>
                  <div className="basis-full flex-wrap">
                    <Stack className="gap-2">
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.05}
                          value={[form.getValues("bg_opacity") ?? 1]}
                          onValueChange={(value) => {
                            setPreviewBGOpacity(
                              (value as unknown as number[])[0] ?? 1,
                            );
                            field.onChange(
                              (value as unknown as number[])[0] ?? 1,
                            );
                          }}
                        />
                      </FormControl>
                    </Stack>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {withBG && (
            <FormField
              control={form.control}
              name="bg_size"
              render={({ field }) => {
                const bgSize = form.getValues("bg_size") ?? "";
                return (
                  <FormItem className="flex flex-col flex-wrap items-stretch justify-between gap-4 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Background Size
                      </FormLabel>
                      <FormDescription>
                        This will set the size of the background image.
                      </FormDescription>
                    </div>
                    <div className="basis-full flex-wrap">
                      <Stack className="gap-2">
                        <FormControl>
                          <Stack className="gap-2">
                            <Select
                              value={bgSize.includes("px") ? "custom" : bgSize}
                              onChange={(value) => {
                                if (value === "custom") {
                                  field.onChange(`100px 100px`);
                                  setBgSizeCustom(true);
                                  setPreviewBgSize(`100px 100px`);
                                } else {
                                  field.onChange(value);
                                  setBgSizeCustom(false);
                                  setPreviewBgSize(value);
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="contain">Contain</SelectItem>
                                <SelectItem value="cover">Cover</SelectItem>
                                <SelectItem value="custom">
                                  Custom size (in pixels)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {bgSizeCustom && (
                              <Stack className="mt-2 gap-4">
                                <Label>
                                  Custom Background Size:{" "}
                                  {bgSize.replace(" ", " x ")}
                                </Label>
                                <Group className="gap-2">
                                  <Stack className="gap-2">
                                    <Label>Width</Label>
                                    <Input
                                      type="number"
                                      value={parseInt(
                                        form
                                          .getValues("bg_size")
                                          ?.split("px")[0] ?? "",
                                      )}
                                      onChange={(e) => {
                                        const val = `${e.target.value}px ${form.getValues("bg_size")?.split("px")[1]}px`;
                                        setPreviewBgSize(val);
                                        field.onChange(val);
                                      }}
                                    />
                                  </Stack>
                                  <Stack className="gap-2">
                                    <Label>Height</Label>
                                    <Input
                                      type="number"
                                      value={parseInt(
                                        form
                                          .getValues("bg_size")
                                          ?.split("px")[1] ?? "",
                                      )}
                                      onChange={(e) => {
                                        const val = `${form.getValues("bg_size")?.split("px")[0]}px ${e.target.value}px`;
                                        setPreviewBgSize(val);
                                        field.onChange(val);
                                      }}
                                    />
                                  </Stack>
                                </Group>
                              </Stack>
                            )}
                          </Stack>
                        </FormControl>
                      </Stack>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormField
            control={form.control}
            name="large_banners_desktop"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Large Desktop Banners
                  </FormLabel>
                  <FormDescription>
                    Make your landing page banners larger on desktop
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_calculation_type"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Tax Calculation Type
                  </FormLabel>
                  <FormDescription>
                    How should tax be handled in regards to the overall price?
                  </FormDescription>
                </div>
                <FormControl>
                  <Select
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="max-w-[400px]">
                      <SelectValue
                        placeholder="Select a tax calculation type"
                        className={field.value ? "h-max" : ""}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="TAX_HIDDEN_IN_PRICE"
                        className="bg-red-50"
                      >
                        <Stack>
                          <p>
                            {TaxCalculationTypeToLabel(
                              TaxCalculationType.TAX_HIDDEN_IN_PRICE,
                            )}
                          </p>
                          <p
                            className="max-w-[400px] text-[12px] text-gray-500"
                            data-hide-when-selected-and-open="true"
                          >
                            Customers will not see tax mentioned during
                            checkout.
                            <b>
                              You should account for the tax amount when setting
                              up individual ticket prices.
                            </b>
                          </p>
                        </Stack>
                      </SelectItem>
                      <SelectItem value="TAX_ADDED_TO_PRICE_ON_CHECKOUT">
                        <Stack>
                          <p>
                            {TaxCalculationTypeToLabel(
                              TaxCalculationType.TAX_ADDED_TO_PRICE_ON_CHECKOUT,
                            )}
                          </p>
                          <p
                            className="max-w-[400px] text-[12px] text-gray-500"
                            data-hide-when-selected-and-open="true"
                          >
                            A price of 100€ and a tax percentage of 10% means
                            10€ tax will be added to the price on checkout, so
                            the final price on checkout will be 110€. Customers
                            will see 100€ on your website and when they reach
                            the final checkout step they will see 110€ for the
                            items + 10€ added tax.
                          </p>
                        </Stack>
                      </SelectItem>
                      <SelectItem value="TAX_IS_PART_OF_PRICE">
                        <Stack>
                          <p>
                            {TaxCalculationTypeToLabel(
                              TaxCalculationType.TAX_IS_PART_OF_PRICE,
                            )}
                          </p>
                          <p
                            className="max-w-[400px] text-[12px] text-gray-500"
                            data-hide-when-selected-and-open="true"
                          >
                            Adding a ticket with price of 10€ and having a tax
                            of 10% will automatically result in tickets costing
                            11€. Customers will not see any tax mentioned.
                          </p>
                        </Stack>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formTaxCalcType !== TaxCalculationType.TAX_HIDDEN_IN_PRICE && (
            <FormField
              control={form.control}
              name="tax_percentage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tax percentage</FormLabel>
                    <FormDescription>
                      How much tax should be added to the tickets sold?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input
                      className="max-w-[200px]"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseInt(e.target.value, 10),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* default_language */}
          <FormField
            control={form.control}
            name="default_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Language</FormLabel>
                <FormDescription>
                  This will be the default language for the website.
                </FormDescription>
                <FormControl>
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                      <SelectItem value="bg">Bulgarian</SelectItem>
                      <SelectItem value="cs">Czech</SelectItem>
                      <SelectItem value="da">Danish</SelectItem>
                      <SelectItem value="nl">Dutch</SelectItem>
                      <SelectItem value="et">Estonian</SelectItem>
                      <SelectItem value="fi">Finnish</SelectItem>
                      <SelectItem value="el">Greek</SelectItem>
                      <SelectItem value="hr">Croatian</SelectItem>
                      <SelectItem value="hu">Hungarian</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="is">Icelandic</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="with_google_translations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>With Google Translations</FormLabel>
                <Group className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <FormDescription>
                    If enabled, Google will automatically translate the website
                    content into the selected language.
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </Group>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Theme Colors Section */}
          <Stack className="gap-4 rounded-lg border p-4">
            <Group className="items-center justify-between">
              <Stack className="gap-1">
                <h3 className="text-lg font-semibold">Theme Colors</h3>
                <FormDescription>
                  Customize button colors for your organization&apos;s theme
                </FormDescription>
              </Stack>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetThemeColors}
              >
                Reset All
              </Button>
            </Group>

            {/* Primary */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Primary</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_primary_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_primary_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_primary_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>

            {/* Secondary */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Secondary</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_secondary_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_secondary_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_secondary_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>

            {/* Outline */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Outline</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_outline_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_outline_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_outline_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>

            {/* Ghost */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Ghost</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_ghost_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_ghost_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_ghost_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>

            {/* Link */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Link</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_link_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_link_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_link_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>

            {/* Destructive */}
            <Stack className="gap-2 rounded-md border p-3">
              <Label className="font-semibold">Destructive</Label>
              <Group className="gap-4">
                <FormField
                  control={form.control}
                  name="theme_destructive_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_destructive_hover_bg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Hover Background</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme_destructive_text"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          withOpacity
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Group>
            </Stack>
          </Stack>

          <input type="hidden" {...form.register("id")} />
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Update Details
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default EditOrganizationForm;
