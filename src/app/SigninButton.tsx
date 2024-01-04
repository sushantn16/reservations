import Link from "next/link"
import { Button } from "~/@/components/button"
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

    const handleUserAccountButton = () => {
        if (session) {
            signOut();
        } else {
            signIn()
        }
    }

    return (
        <div className="flex">

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session?.user.image ?? ''} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        {session ? "Account Information" : "Please Login"
                        }
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <>
                        {session &&
                            <>
                                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Link href="/order-online">My Orders</Link>
                                </DropdownMenuItem>
                            </>
                        }
                    </>

                    <DropdownMenuItem>
                        <Button onClick={handleUserAccountButton} variant="link">{session ? "Sign out" : "Sign in"}
                        </Button></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )

}