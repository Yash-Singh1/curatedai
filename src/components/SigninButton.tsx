"use client";

import { useClerk } from "@clerk/nextjs/app-beta/client";

export const SignInButton = () => {
  const { openSignIn } = useClerk();

  return (
    <button
      className="flex h-8 items-center justify-center rounded-lg bg-slate-800/80 p-2 text-slate-200 transition-all hover:bg-slate-700/80 hover:transition-all active:bg-slate-700/80"
      onClick={() =>
        openSignIn({
          appearance: {
            variables: {
              colorPrimary: "#E24A8D",
            },
          },
        })
      }
    >
      Sign In
    </button>
  );
};
