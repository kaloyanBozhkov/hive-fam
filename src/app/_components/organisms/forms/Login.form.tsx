"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "../../shadcn/Form.shadcn";
import { Button } from "../../shadcn/Button.shadcn";
import { Input } from "../../shadcn/Input.shadcn";

const login = z.object({
  username: z.string(),
  password: z.string(),
});

const LoginForm = ({
  className,
  onLogin,
}: {
  className?: string;
  onLogin: (creds: z.infer<typeof login>) => void;
}) => {
  const form = useForm<z.infer<typeof login>>({
    resolver: zodResolver(login),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onLogin(data))}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mt-0r">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Username</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-0">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Password</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.watch("username") || !form.watch("password")}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default LoginForm;
