import { FacebookIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "~/@/components/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "~/@/components/drawer";
import { DiscordLogoIcon } from '@radix-ui/react-icons'

const SigninDrawer = () => {
    const { data: session } = useSession()

    return (
        <Drawer dismissible={false} open={!session}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Signin</DrawerTitle>
                    <DrawerDescription>Please sign in to acess this page</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex flex-col items-center" >
                    <Button className="m-3 w-[300px]" onClick={()=> signIn('google', { callbackUrl: window.location.href })}>
                        <FacebookIcon className="mr-2 h-4 w-4" /> Login with Google
                    </Button>
                    <Button className="m-3 w-[300px]" onClick={()=> signIn('discord', { callbackUrl: window.location.href })}>
                        <DiscordLogoIcon className="mr-2 h-4 w-4" /> Login with Discord
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )

}
export default SigninDrawer;