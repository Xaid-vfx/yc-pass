"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

interface Post {
  _id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  type: "want" | "have";
  body: string;
  claimed: boolean;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onToggleClaim: (id: string) => void;
  onDelete: (id: string) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PostCard({ post, onToggleClaim, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isOwner = user?.id === post.authorId;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 transition-opacity ${
        post.claimed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {post.authorImage ? (
            <Image
              src={post.authorImage}
              alt={post.authorName}
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                {post.authorName}
              </span>
              <a
                href={`https://twitter.com/${post.authorUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-sm hover:underline"
              >
                @{post.authorUsername}
              </a>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-gray-400 text-xs">{timeAgo(post.createdAt)}</span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  post.type === "have"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {post.type === "have" ? "Have a Pass" : "Want a Pass"}
              </span>
              {post.claimed && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {post.type === "have" ? "Claimed" : "Sorted"}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isOwner && !post.claimed && (
          <a
            href={`https://twitter.com/${post.authorUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 text-sm bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Message
          </a>
        )}
      </div>

      <p className="mt-3 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
        {post.body}
      </p>

      {isOwner && (
        <div className="mt-3 flex items-center gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onToggleClaim(post._id)}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            {post.claimed
              ? "Mark as available"
              : post.type === "have"
              ? "Mark as claimed"
              : "Mark as sorted"}
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
