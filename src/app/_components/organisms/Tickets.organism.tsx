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
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const cart = z.object({
  eventName: z.string(),
  regularQuantity: z.number(),
});

const Tickets = ({
  eventName,
  className,
  eventPrice,
  eventCurrency,
}: {
  eventName: string;
  eventPrice: number;
  className?: string;
  eventCurrency: string;
}) => {
  const form = useForm<z.infer<typeof cart>>({
    resolver: zodResolver(cart),
    defaultValues: {
      eventName,
      regularQuantity: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof cart>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <input
          type="hidden"
          {...form.register("eventName")}
          value={eventName}
        />
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="regularQuantity"
            render={({ field }) => (
              <FormItem className="mt-0 grid grid-cols-2 items-center gap-[20px]">
                <FormLabel className="mr-auto">
                  <Stack>
                    <p className="text-[18px] leading-[120%]">Regular Access</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Group className="!mt-0 ml-auto gap-[12px]">
                    <Button
                      onClick={() => {
                        const newVal = form.getValues("regularQuantity") - 1;
                        form.setValue(
                          "regularQuantity",
                          newVal < 0 ? 0 : newVal,
                        );
                      }}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      {...field}
                      className="w-[62px]"
                      min={0}
                      max={99}
                      onChange={({ currentTarget: { value } }) => {
                        field.onChange(+value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        const newVal = form.getValues("regularQuantity") + 1;
                        form.setValue(
                          "regularQuantity",
                          newVal > 99 ? 99 : newVal,
                        );
                      }}
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
          <div className="grid w-full grid-cols-2 gap-[20px]">
            <p className="mr-auto font-rex-bold text-[20px]">Total</p>
            <p className="ml-auto font-rex-bold text-[20px]">
              {(form.getValues().regularQuantity * eventPrice).toFixed(2)}{" "}
              {eventCurrency}
            </p>
          </div>
          <Button disabled={form.getValues().regularQuantity <= 0}>
            <Group className="items-center gap-[12px]">
              <FontAwesomeIcon icon={faCreditCard} />
              <span>CHECKOUT</span>
            </Group>
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default Tickets;