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
          Digite o seu email para receber um link de login
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
                  placeholder="Digite seu email"
                  required
                />
              </div>
              {state.success === true && (
                <Alert className="text-muted-foreground">
                  <MailCheck className="h-4 w-4 text-green-600!" />
                  <AlertTitle>Email enviado!</AlertTitle>
                  <AlertDescription>
                    Verifique sua caixa de entrada e clique no link para fazer
                    login.
                  </AlertDescription>
                </Alert>
              )}
              {state.success === false && (
                <Alert className="text-muted-foreground">
                  <Siren className="h-4 w-4 text-red-600!" />
                  <AlertTitle>Erro ao enviar email!</AlertTitle>
                  <AlertDescription>
                    Não foi possível enviar o link de login. Verifique o email
                    digitado e tente novamente.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                {pending && <Loader className="animate-spin" />}
                Enviar link de login
              </Button>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
