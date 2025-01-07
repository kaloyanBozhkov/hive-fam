"use client";
import { z } from "zod";
import Group from "../layouts/Group.layout";
import Stack from "../layouts/Stack.layout";
import { Input } from "../shadcn/Input.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/shadcn/Form.shadcn";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import DotsLoader from "../atoms/DotsLoader.atom";
import { claimFreeTickets } from "@/server/actions/claimFreeTIckets";
import { useRouter } from "next/navigation";

const MAX_FREE_TICKETS_AT_ONCE = 30;

const cart = z.object({
  quantity: z.number(),
  email: z.string().email("Must provide a vlaid email"),
  name: z.string().min(2),
});

const FreeTickets = ({
  eventName,
  className,
  eventId,
}: {
  eventId: string;
  eventName: string;
  className?: string;
}) => {
  const router = useRouter();
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const form = useForm<z.infer<typeof cart>>({
    resolver: zodResolver(cart),
    defaultValues: {
      quantity: 0,
      email: "",
      name: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof cart>) => {
      setCheckoutProcessing(true);
      claimFreeTickets({ eventId, ...values })
        .then(({ success, reason, sessionId }) => {
          if (success) {
            router.push(`/order/${sessionId}`);
            return;
          }

          if (reason === "ALREADY_CLAIMED_WITH_THAT_EMAIL") {
            form.setError("email", {
              message:
                "This email has already been used to claim one or more tickets.",
            });
            setCheckoutProcessing(false);
          }
        })
        .catch((error) => {
          console.warn(error);
          setCheckoutProcessing(false);
        });
    },
    [eventName, form, eventId, router],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="w-full text-left">
                  <Stack>
                    <p>Full name</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage className="col-span-2 w-full text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="w-full text-left">
                  <Stack>
                    <p>Email</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="john.doe@gmail.com"
                  />
                </FormControl>
                <FormMessage className="col-span-2 w-full text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 items-center gap-[20px] -sm:grid-cols-1 -sm:items-start -sm:pt-2">
                <FormLabel className="mr-auto -sm:-mb-2">
                  <Stack>
                    <p>Number of Tickets</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Group className="!mt-0 ml-auto gap-[12px] -sm:ml-[unset]">
                    <Button
                      onClick={() => {
                        const newVal = form.getValues("quantity") - 1;
                        form.setValue("quantity", newVal < 0 ? 0 : newVal);
                      }}
                      type="button"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      {...field}
                      className="w-[62px] -sm:w-full"
                      min={0}
                      max={MAX_FREE_TICKETS_AT_ONCE}
                      onChange={({ currentTarget: { value } }) => {
                        field.onChange(+value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        const newVal = form.getValues("quantity") + 1;
                        form.setValue(
                          "quantity",
                          newVal > MAX_FREE_TICKETS_AT_ONCE
                            ? MAX_FREE_TICKETS_AT_ONCE
                            : newVal,
                        );
                      }}
                      type="button"
                    >
                      +
                    </Button>
                  </Group>
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <div className="h-[1px] w-full border-b-[1px] border-dashed border-black " />
          <Button type="submit" disabled={form.watch("quantity") < 1}>
            {checkoutProcessing ? (
              <DotsLoader modifier="primary" />
            ) : (
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faTicket} />
                <span>CLAIM TICKET{form.watch("quantity") > 1 ? "S" : ""}</span>
              </Group>
            )}
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default FreeTickets;
