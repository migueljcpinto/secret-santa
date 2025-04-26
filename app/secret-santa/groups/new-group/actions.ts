"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend";

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

  const { data: authUser, error: errorAuth } = await supabase.auth.getUser();

  if (errorAuth) {
    return {
      success: false,
      message: "An error occurred while creating the group",
    };
  }

  const names = formData.getAll("name");
  const emails = formData.getAll("email");
  const groupName = formData.get("group-name");

  const { data: newGroup, error: errorGroup } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      owner_id: authUser.user?.id,
    })
    .select()
    .single();

  if (errorGroup) {
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

  const { data: createdParticipants, error: errorParticipants } = await supabase
    .from("participants")
    .insert(participants)
    .select();

  if (errorParticipants) {
    return {
      success: false,
      message:
        "An error occurred while adding participants to the group. Please try again.",
    };
  }

  const drawnParticipants = drawGroup(createdParticipants);

  const { error: errorDraw } = await supabase
    .from("participants")
    .upsert(drawnParticipants);

  if (errorDraw) {
    return {
      success: false,
      message: "An error occurred in the draw. Please try again.",
    };
  }

  const { error: errorResend } = await sendEmailToParticipants(
    drawnParticipants,
    groupName as string
  );

  if (errorResend) {
    return {
      success: false,
      message: errorResend,
    };
  }

  redirect(`/secret-santa/groups/${newGroup.id}`);
}

type Participant = {
  id: string;
  group_id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};

// TODO: Precisa ser melhor a logica do sorteio!!!
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

async function sendEmailToParticipants(
  participants: Participant[],
  groupName: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await Promise.all(
      participants.map((participant) => {
        resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: participant.email,
          subject: `Secret friend draw - ${groupName}`,
          // TODO: Dar um template!!!
          html: `<p>You're taking part in the group's Secret Santa draw "${groupName}". <br /> <br />
          Your secret friend is <strong>${participants.find((p) => p.id === participant.assigned_to)?.name}</strong>!</p>
`,
        });
      })
    );

    return { error: null };
  } catch {
    return { error: "There was an error sending the emails." };
  }
}
