"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
  const emails = formData.getAll("email");
  const groupName = formData.get("group-name");

  const { data: newGroup, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      owner_id: authUser.user?.id,
    })
    .select()
    .single();

  if (groupError) {
    return {
      success: false,
      message: "An error occurred while creating the group. Please try again.",
    };
  }

  const participants = names.map((name, index) => ({
    group_id: newGroup.id,
    name,
    email: emails[index],
  }));

  const { data: createdParticipants, error: participantsError } = await supabase
    .from("participants")
    .insert(participants)
    .select();

  if (participantsError) {
    return {
      success: false,
      message:
        "An error occurred while adding participants to the group. Please try again.",
    };
  }

  const drawnParticipants = drawGroup(createdParticipants);

  const { error: drawError } = await supabase
    .from("participants")
    .upsert(drawnParticipants);

  if (drawError) {
    return {
      success: false,
      message: "An error occurred in the draw. Please try again.",
    };
  }

  redirect(`secret-santa/groups/${newGroup.id}`);
}

type Participant = {
  id: string;
  group_id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};

function drawGroup(participants: Participant[]) {
  const selectedParticipants: string[] = [];

  return participants.map((participant) => {
    const availableParticipants = participants.filter(
      (p) => p.id !== participant.id && !selectedParticipants.includes(p.id)
    );

    const assignedParticipant =
      availableParticipants[
        Math.floor(Math.random() * availableParticipants.length)
      ];

    selectedParticipants.push(assignedParticipant.id);

    return {
      ...participant,
      assigned_to: assignedParticipant.id,
    };
  });
}
