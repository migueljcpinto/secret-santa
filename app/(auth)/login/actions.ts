"use server";

import { createClient } from "@/utils/supabase/server";

export type LoginState = {
  success: boolean | null;
  message?: string;
};

export async function login(previousState: LoginState, formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return {
      ...previousState,
      success: false,
      message: "Erro ao inicializar o cliente Supabase.",
    };
  }

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm` },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Email sent successfully",
  };
}
