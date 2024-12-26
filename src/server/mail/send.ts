import { transporter } from "./nodemailer";
import { z } from "zod";

const emailRequestSchema = z.object({
  to: z.string().nonempty(),
  subject: z.string().nonempty(),
  text: z.string().optional(),
  html: z.string().optional(),
  from: z.string().nonempty(),
});

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from,
}: z.infer<typeof emailRequestSchema>) => {
  const validationResult = emailRequestSchema.safeParse({
    to,
    subject,
    text,
    html,
    from,
  });

  if (!validationResult.success) throw Error("Invalid sendEmail request");

  // Send the email
  await transporter.sendMail({
    from,
    to, // Recipient address
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  });
};
