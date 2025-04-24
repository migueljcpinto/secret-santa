"use client";

import { useActionState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { login, LoginState } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, MailCheck, Siren } from "lucide-react";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {
      success: null,
      message: "",
    }
  );

  return (
    <Card className="mx-auto  w-full text-center max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription className="py-2">
          Enter your email address to receive a login link{" "}
        </CardDescription>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {state.success === true && (
                <Alert className="text-muted-foreground">
                  <MailCheck className="h-4 w-4 text-green-600!" />
                  <AlertTitle>Email sent!</AlertTitle>
                  <AlertDescription>
                    Check your inbox and click the link to log in.
                  </AlertDescription>
                </Alert>
              )}
              {state.success === false && (
                <Alert className="text-muted-foreground">
                  <Siren className="h-4 w-4 text-red-600!" />
                  <AlertTitle>Email sending error!</AlertTitle>
                  <AlertDescription>
                    Unable to send the login link. Please check the email
                    entered and try again.
                  </AlertDescription>
                </Alert>
              )}
              <Button className="w-full cursor-pointer">
                {pending && <Loader className="animate-spin" />}
                Send login link
              </Button>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
