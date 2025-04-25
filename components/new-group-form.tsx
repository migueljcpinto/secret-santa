"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

interface Participant {
  name: string;
  email: string;
}

export default function NewGroupForm({
  loggedUser,
}: {
  loggedUser: { id: string; email: string };
}) {
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: loggedUser.email },
  ]);

  const [groupName, setGroupName] = useState<string>("");

  function addParticipant() {
    setParticipants(participants.concat({ name: "", email: "" }));
  }

  function updateParticipant(
    index: number,
    field: keyof Participant,
    value: string
  ) {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  }

  function removeParticipant(index: number) {
    setParticipants(participants.filter((_, i) => i !== index));
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Create a new group</CardTitle>
        <CardDescription>
          Invite your friends to join your Secret Santa group!
        </CardDescription>
      </CardHeader>
      <form action={() => {}}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <h2 className="mt-12!">Participants</h2>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="grow space-y-2 w-full">
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  name="name"
                  placeholder="Enter the name"
                  value={participant.name}
                  onChange={(e) => {
                    updateParticipant(index, "name", e.target.value);
                  }}
                  required
                />
              </div>

              <div className="grow space-y-2 w-full">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  name="email"
                  type="email"
                  value={participant.email}
                  placeholder="Enter the email"
                  className="read-only:text-muted-foreground"
                  onChange={(e) => {
                    updateParticipant(index, "email", e.target.value);
                  }}
                  readOnly={participant.email === loggedUser.email}
                  required
                />
              </div>

              <div className="min-w-9">
                {participants.length > 1 &&
                  participant.email !== loggedUser.email && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={addParticipant}
            className="w-full md:w-auto"
          >
            Add a friend
          </Button>

          <Button
            type="submit"
            className="flex items-center space-x-2 w-full md:w-auto"
          >
            <Mail className="w-3 h-3" /> Create the Group and send the emails!
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
