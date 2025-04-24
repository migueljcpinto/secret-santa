import { Gift, UsersRound } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 text-red-400" />
            <span>
              Secret
              <span className="font-thin">Santa</span>{" "}
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/secret-santa/groups"
              className="text-foreground text-sm flex gap-2 hover:text-gray-900"
            >
              <UsersRound className="h-4 w-4" />
              My Groups
            </Link>

            <Link
              href="/secret-santa/groups/new-group"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              New Group
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
