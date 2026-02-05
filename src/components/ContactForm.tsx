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
      <div className="bg-green-50 text-green-800 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Nachricht gesendet!</h3>
        <p>Vielen Dank für Ihre Anfrage. Wir melden uns in Kürze.</p>
        <button 
            onClick={() => setStatus("idle")} 
            className="mt-4 text-green-700 underline hover:text-green-900"
        >
            Neue Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      {status === "error" && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {serverError || "Es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut."}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Nachricht
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
        {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "submitting" ? "Wird gesendet..." : "Nachricht senden"}
      </button>
    </form>
  );
}
