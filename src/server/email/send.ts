import { z } from "zod";
import { resend } from "./resend";

const emailRequestSchema = z.object({
  to: z.string().nonempty(),
  subject: z.string().nonempty(),
  text: z.string().optional(),
  html: z.string().nonempty(),
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

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
