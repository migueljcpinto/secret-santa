import NewGroupForm from "@/components/new-group-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewGroupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const loggedUser = {
    id: data.user?.id as string,
    email: data.user?.email as string,
  };

  if (!loggedUser.id) {
    return (
      <div className="mt-40">You must be logged in to create a new group.</div>
    );
  }

  return (
    <div className="mt-40">
      <NewGroupForm loggedUser={loggedUser} />
    </div>
  );
}
