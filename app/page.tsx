"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";

type FilterType = "all" | "have" | "want";

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

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/posts" : `/api/posts?type=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleToggleClaim(id: string) {
    await fetch(`/api/posts/${id}`, { method: "PATCH" });
    fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  const user = session?.user as any;
  const userHasPost = !!user && posts.some((p) => p.authorId === user.id);

  // Always compute from full posts list regardless of filter
  const allPosts = posts;
  const passesAvailable = allPosts.filter((p) => p.type === "have" && !p.claimed).length;
  const passesWanted = allPosts.filter((p) => p.type === "want" && !p.claimed).length;

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Have a Pass", value: "have" },
    { label: "Want a Pass", value: "want" },
  ];

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            YC Startup School India
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            April 18th · Pass your seat to someone who deserves it
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{passesAvailable}</p>
              <p className="text-xs text-green-600 mt-0.5">
                {passesAvailable === 1 ? "Pass available" : "Passes available"}
              </p>
            </div>
            <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-700">{passesWanted}</p>
              <p className="text-xs text-orange-600 mt-0.5">
                {passesWanted === 1 ? "Person looking" : "People looking"}
              </p>
            </div>
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto flex-shrink min-w-0">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {session ? (
            userHasPost ? (
              <span className="text-xs text-gray-400">1 post per user</span>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="bg-yc text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
              >
                + Post
              </button>
            )
          ) : (
            <button
              onClick={() => signIn("twitter")}
              className="text-sm text-yc font-medium hover:underline"
            >
              Sign in to post
            </button>
          )}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">Be the first to post</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onToggleClaim={handleToggleClaim}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={fetchPosts}
        />
      )}
    </>
  );
}
