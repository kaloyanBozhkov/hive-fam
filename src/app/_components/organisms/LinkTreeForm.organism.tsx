"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { Label } from "@/app/_components/shadcn/Label.shadcn";
import { useEffect } from "react";
import TextEditor from "../molecules/lexical/TextEditor";
import {
  FormControl,
  FormMessage,
  FormLabel,
  Form,
  FormItem,
  FormField,
} from "../shadcn/Form.shadcn";

const linkTreeSchema = z.object({
  description: z.string().nullable(),
});

type LinkTreeFormProps = {
  initialDescription: string;
  onSubmit: (formData: z.infer<typeof linkTreeSchema>) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

export const LinkTreeForm = ({
  initialDescription,
  onSubmit,
}: LinkTreeFormProps) => {
  const form = useForm<z.infer<typeof linkTreeSchema>>({
    resolver: zodResolver(linkTreeSchema),
    defaultValues: {
      description: initialDescription,
    },
  });

  const handleSubmit = async (data: z.infer<typeof linkTreeSchema>) => {
    await onSubmit(data);
  };

  useEffect(() => {
    form.reset({ description: initialDescription });
  }, [initialDescription, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="space-y-2">
          <Label htmlFor="description">Link Tree Description</Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TextEditor
                    className="min-h-[100px]"
                    onChanged={field.onChange}
                    content={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="md: w-fit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
