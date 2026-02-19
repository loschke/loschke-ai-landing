import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Resend } from 'resend';

export const server = {
  sendContact: defineAction({
    accept: 'json',
    input: z.object({
      name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
      email: z.string().email("Ungültige E-Mail-Adresse"),
      message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
    }),
    handler: async (input) => {
      const { name, email, message } = input;

      const apiKey = import.meta.env.RESEND_API_KEY;

      if (!apiKey) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Resend API key is not configured.',
        });
      }

      const resend = new Resend(apiKey);

      const { data, error } = await resend.emails.send({
        from: "Loschke AI <hallo@loschke.ai>",
        to: [import.meta.env.CONTACT_EMAIL || "info@loschke.ai"],
        subject: `Neue Kontaktanfrage von ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`,
        replyTo: email,
      });

      if (error) {
        console.error("Resend Error:", error);
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { success: true, data };
    },
  }),
};
