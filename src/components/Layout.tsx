import { UserButton, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "./SigninButton";
import { useEffect } from "react";

declare global {
  interface Window {
    chrome: {
      runtime: {
        sendMessage: (
          id: string,
          message: any,
          options?: { includeTlsChannelId: string } | null,
          callback?: (response: any) => void
        ) => void | Promise<void>;
      };
    };
  }
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isSignedIn && window.chrome && window.chrome.runtime) {
      void window.chrome.runtime.sendMessage(
        localStorage.getItem("id")!,
        {
          method: "SET",
          body: {
            userId: auth.userId,
          },
        },
        null,
        () => {}
      );
    }
  }, [auth]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="min-h-[60px] flex-grow-0 bg-black">
          <nav className="flex min-h-[60px] w-full items-center justify-between p-2">
            <div className="flex flex-wrap gap-x-4">
              <Link href="/">
                <Image src="/favicon.ico" alt="Logo" width={30} height={20} />
              </Link>
              <Link href="/dashboard" className="font-semibold text-white">
                Dashboard
              </Link>
            </div>
            {auth.isSignedIn !== false ? <UserButton /> : <SignInButton />}
          </nav>
        </header>
        {children}
      </div>
    </>
  );
};
