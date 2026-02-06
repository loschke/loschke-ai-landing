import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { actions } from "astro:actions";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema as any),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    setServerError(null);
    
    const { error } = await actions.sendContact(data);

    if (error) {
      console.error(error);
      setServerError(error.message || "Ein Fehler ist aufgetreten.");
      setStatus("error");
      return;
    }

    setStatus("success");
    reset();
  };

  if (status === "success") {
    return (
      <div className="py-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 flex items-center justify-center bg-accent text-white text-sm font-bold">✓</span>
          <h3 className="text-xl sm:text-2xl font-black tracking-[-0.02em] text-[#151416]">
            Nachricht ist raus!
          </h3>
        </div>
        <p className="text-base sm:text-lg font-light leading-[1.75] text-[#525252] mb-6">
          Vielen Dank für deine Nachricht. Ich melde mich in der Regel innerhalb von 1–2 Werktagen.
        </p>
        <button 
          onClick={() => setStatus("idle")} 
          className="text-sm font-medium text-accent border-b border-transparent hover:border-accent transition-colors duration-250 cursor-pointer bg-transparent p-0"
        >
          Noch eine Nachricht senden →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {status === "error" && (
        <div className="px-4 py-3 bg-red-50 border-l-2 border-red-500 text-red-700 text-sm">
          {serverError || "Es gab einen Fehler beim Senden. Bitte versuche es später erneut."}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-medium text-[#151416]/40 tracking-[0.08em] uppercase mb-2">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          placeholder="Wie heißt du?"
          className="w-full px-0 py-3 text-base sm:text-lg font-light text-[#151416] bg-transparent border-0 border-b border-[#151416]/15 focus:border-accent outline-none transition-colors duration-300 placeholder:text-[#151416]/25"
        />
        {errors.name && <p className="text-red-600 text-xs mt-2">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-[#151416]/40 tracking-[0.08em] uppercase mb-2">
          E-Mail
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="deine@email.de"
          className="w-full px-0 py-3 text-base sm:text-lg font-light text-[#151416] bg-transparent border-0 border-b border-[#151416]/15 focus:border-accent outline-none transition-colors duration-300 placeholder:text-[#151416]/25"
        />
        {errors.email && <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-[#151416]/40 tracking-[0.08em] uppercase mb-2">
          Nachricht
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          placeholder="Worum geht's? Schreib einfach drauf los."
          className="w-full px-0 py-3 text-base sm:text-lg font-light text-[#151416] bg-transparent border-0 border-b border-[#151416]/15 focus:border-accent outline-none transition-colors duration-300 resize-y placeholder:text-[#151416]/25"
        />
        {errors.message && <p className="text-red-600 text-xs mt-2">{errors.message.message}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-block bg-[#151416] text-white px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
        >
          {status === "submitting" ? "Wird gesendet…" : "Nachricht senden"}
        </button>
      </div>
    </form>
  );
}
