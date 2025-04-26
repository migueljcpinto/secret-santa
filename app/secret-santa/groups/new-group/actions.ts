"use server";

import { createClient } from "@/utils/supabase/server";

export type CreateGroupState = {
  success: boolean | null;
  message?: string;
};

export async function createGroup(
  previousState: CreateGroupState,
  formData: FormData
) {
  console.log(previousState); // Ensure previousState is used
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return {
      success: false,
      message: "An error occurred while creating the group",
    };
  }

  const names = formData.getAll("name");
  const email = formData.getAll("email");
  const groupName = formData.get("group-name");

  console.log(names, email, groupName);
}
