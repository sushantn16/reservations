import "~/styles/globals.css";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { Inter as FontSans } from "next/font/google"
import { cn } from "../@/lib/utils"
import Header from "./Header";
import Provider from "./Provider";
import { getServerAuthSession } from "~/server/auth";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  
  
}) {
  const session = await getServerAuthSession();
  return (
    
    <html lang="en">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased",fontSans.variable)} suppressHydrationWarning>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Provider session={session}>
          <Header/>
          {children}
          </Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
