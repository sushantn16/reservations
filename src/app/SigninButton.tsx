import Link from "next/link"
import { Button } from "~/@/components/button"
import { useSession } from "next-auth/react"


export const SigninButton = () => {
    const { data: session, status } = useSession()
    return (
        <Button asChild>
            <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}>{session ? "Sign out" : "Sign in"}
            </Link>
        </Button>
    )
}