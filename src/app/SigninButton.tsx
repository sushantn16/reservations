import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "~/@/components/avatar"
signOut
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/@/components/dropdown-menu"


export const SigninButton = () => {
    const { data: session } = useSession()

    const handleUserAccountButton = async () => {
        if (session) {
            await signOut();
        } else {
            await signIn()
        }
    }

    return (
        <div className="flex">

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session?.user.image ?? ''} />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        {session ? "Account Information" : "Please Login"
                        }
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        {session &&
                            <>
                                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Link href="/order-online">My Orders</Link>
                                </DropdownMenuItem>
                            </>
                        }
                    <DropdownMenuItem onClick={handleUserAccountButton}>{session ? "Sign out" : "Sign in"}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}