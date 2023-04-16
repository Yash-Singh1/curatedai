import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="flex-grow-0 bg-black min-h-[60px]">
          <nav className="flex w-full items-center justify-between p-2 min-h-[60px]">
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
