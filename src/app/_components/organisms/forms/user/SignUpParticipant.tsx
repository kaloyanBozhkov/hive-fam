"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/_components/shadcn/Button.shadcn";
import { Input } from "@/app/_components/shadcn/Input.shadcn";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/shadcn/Form.shadcn";
import Stack from "@/app/_components/layouts/Stack.layout";
import { useEffect } from "react";

const participantSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  phone: z.string().nonempty("Phone number is required"),
  name: z.string().nonempty("Name is required"),
  surname: z.string().nonempty("Surname is required"),
  country: z.string().nonempty("Country is required"),
  custom_payload: z.any().optional(),
});

export type ParticipantData = z.infer<typeof participantSchema>;

const SignUpParticipant = ({
  onSignUp,
  customPayload,
  children,
}: {
  onSignUp: (data: ParticipantData) => void;
  customPayload?: Record<string, unknown>;
  children?: React.ReactNode;
}) => {
  const form = useForm({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      email: "",
      phone: "",
      name: "",
      surname: "",
      country: "",
      custom_payload: customPayload,
    },
  });

  useEffect(() => {
    form.setValue("custom_payload", customPayload);
  }, [customPayload]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4">
        <Stack className="gap-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          {children}
          <Button type="submit">Sign Up</Button>
        </Stack>
      </form>
    </Form>
  );
};

export default SignUpParticipant;
