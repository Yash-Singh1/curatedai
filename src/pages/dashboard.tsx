"use client";

import { useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "~/components/Layout";

const headers = new Headers();
headers.append("Content-Type", "application/json");

export interface Bookmark {
  title: string;
  url?: string;
  text: string;
  id: string;
}

const Dashboard: NextPage = () => {
  const auth = useAuth();
  const [shown, setShown] = useState(false);
  const [url, setURL] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("url")) {
      setURL(query.get("url") as string);
    }
    if (query.get("title")) {
      setTitle(query.get("title") as string);
    }
    if (query.get("url") || query.get("title")) {
      setShown(true);
    }
  }, []);

  async function refetch() {
    const res = await fetch(
      `https://curatedai-backend.epiccodewizard2.repl.co/api/bookmarks?userId=${auth.userId!}`,
      {
        headers,
        method: "GET",
      }
    );
    const data = (await res.json()) as Bookmark[];
    setLoading(false);
    setBookmarks(data);
  }

  useEffect(() => {
    if (auth.isSignedIn) {
      void refetch();
    }
  }, [auth.isSignedIn]);

  return (
    <Layout>
      {auth.isSignedIn === undefined || loading ? (
        <main className="flex flex-grow items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-red-500 motion-safe:animate-[spin_0.5s_linear_infinite]"></div>
        </main>
      ) : (
        <main className="flex-grow bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 sm:p-6 md:p-12 lg:p-20">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl font-bold text-white">Bookmarks</h1>
            <div
              onClick={() => setShown(true)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[hsl(220,100%,70%)] p-1"
              dangerouslySetInnerHTML={{
                __html: `<svg xmlns="http://www.w3.org/2000/svg" fill="white" width="30" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>`,
              }}
            />
          </div>
          {bookmarks.length ? (
            <div className="flex flex-wrap gap-8">
              {bookmarks.map((bookmark) => {
                return (
                  <div
                    key={bookmark.id}
                    onClick={() => void router.push(`/bookmark/${bookmark.id}`)}
                    className="mt-8 flex w-40 cursor-pointer flex-col justify-center gap-y-2 rounded-md border border-transparent bg-black p-4 transition-all hover:border-white hover:transition-none"
                  >
                    <p className="text-xl font-semibold text-white">
                      {bookmark.title}
                    </p>
                    <p className="text-sm font-medium text-white">
                      {bookmark.text.length > 20
                        ? `${bookmark.text
                            .replaceAll("\n", " ")
                            .slice(0, 17)}...`
                        : bookmark.text}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center gap-y-2 p-4">
              <p className="text-6xl">🔖</p>
              <p className="text-xl font-semibold text-white">
                No bookmarks found
              </p>
              <p className="text-lg font-semibold text-white">
                Try creating one...
              </p>
            </div>
          )}
        </main>
      )}
      <div
        className={`absolute left-0 top-0 z-10 flex min-h-screen w-screen items-center justify-center bg-black/10 ${
          shown ? "" : "hidden"
        }`}
      >
        <div className="h-1/2 w-1/2 rounded-md bg-white p-2">
          <div className="flex justify-end">
            <div
              onClick={() => setShown(false)}
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
              dangerouslySetInnerHTML={{
                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`,
              }}
            />
          </div>
          <div className="mt-2 flex flex-col gap-y-2">
            <div>
              <div className="flex gap-x-[1px] text-sm tracking-wide">
                <p className="text-gray-400/80">URL</p>
                <p className="text-red-400">*</p>
              </div>
              <input
                className="w-full rounded-md border border-transparent bg-slate-400/20 px-2 py-1 text-black hover:border-slate-400/80"
                placeholder="URL"
                value={url}
                onChange={(event) => setURL(event.target.value)}
              />
            </div>
            <div>
              <div className="flex gap-x-[1px] text-sm tracking-wide">
                <p className="text-gray-400/80">Title</p>
                <p className="text-red-400">*</p>
              </div>
              <input
                className="w-full rounded-md border border-transparent bg-slate-400/20 px-2 py-1 text-black hover:border-slate-400/80"
                placeholder="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <button
              onClick={() => {
                console.log(auth.userId);
                void fetch(
                  `https://curatedai-backend.epiccodewizard2.repl.co/api/create`,
                  {
                    method: "POST",
                    body: JSON.stringify({ userId: auth.userId, url, title }),
                    headers,
                  }
                )
                  .then((res) => res.json())
                  .then(() => {
                    setShown(false);
                    void refetch();
                  });
              }}
              className="mt-4 flex h-8 items-center justify-center rounded-lg bg-slate-800/80 p-2 text-slate-200 transition-all hover:bg-slate-700/80 hover:transition-all active:bg-slate-700/80"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
