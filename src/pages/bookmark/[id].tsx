import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { Layout } from "~/components/Layout";
import { type Bookmark } from "../dashboard";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import remarkGfm from "remark-gfm";

const Bookmark: NextPage = () => {
  const params = useSearchParams();
  const id = params.get("id") as string;
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id && auth.isSignedIn) {
      void fetch(
        `https://curatedai-backend.epiccodewizard2.repl.co/api/bookmark?id=${id}&userId=${auth.userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBookmark(data as Bookmark);
        });
    }
  }, [id, auth.isSignedIn]);

  return (
    <Layout>
      {typeof auth.isSignedIn === "undefined" || !bookmark ? (
        <main className="flex flex-grow items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-red-500 motion-safe:animate-[spin_0.5s_linear_infinite]"></div>
        </main>
      ) : (
        <main className="flex-grow bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 sm:p-6 md:p-12 lg:p-20 article">
          <h1
            onClick={() => {
              location.href = bookmark?.url || "#";
            }}
            tabIndex={0}
            className="group flex cursor-pointer text-4xl font-bold text-white hover:underline hover:decoration-dotted"
          >
            {bookmark.title}
            <div
              className="ml-2 hidden items-center justify-center group-hover:flex"
              dangerouslySetInnerHTML={{
                __html: `<svg width="40" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>`,
              }}
            />
          </h1>
          <ReactMarkdown
            className="mt-4 text-white"
            remarkPlugins={[remarkGfm]}
          >
            {bookmark.text.replaceAll(
              /\(\/(.*?)\)/g,
              `(http://${new URL(bookmark.url || "").hostname}/$1)`
            )}
          </ReactMarkdown>
          <div className="w-max rounded-lg bg-black/80">
            <button
              onClick={() => {
                void fetch(
                  "https://curatedai-backend.epiccodewizard2.repl.co/api/delete",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      id,
                      userId: auth.userId!,
                    }),
                  }
                ).then(() => {
                  router.back();
                });
              }}
              className="mt-2 flex cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-red-400/50 p-1 px-3 text-lg text-[#f2f2f2]"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: `<svg xmlns="http://www.w3.org/2000/svg" width="18" fill="#f2f2f2" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`,
                }}
              />
              Delete
            </button>
          </div>
        </main>
      )}
    </Layout>
  );
};

export default Bookmark;
