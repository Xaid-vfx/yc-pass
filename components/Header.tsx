"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yc font-bold text-xl">YC Pass</span>
          <span className="text-gray-400 text-sm hidden sm:block">
            · Startup School India
          </span>
        </div>

        {session?.user ? (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-600 hidden sm:block">
              @{(session.user as any).username}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("twitter")}
            className="flex items-center gap-2 bg-black text-white text-sm px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Sign in with X
          </button>
        )}
      </div>
    </header>
  );
}
