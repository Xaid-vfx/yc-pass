"use client";

import { useState } from "react";

interface CreatePostModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePostModal({ onClose, onCreated }: CreatePostModalProps) {
  const [type, setType] = useState<"want" | "have">("want");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = 500 - body.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, body }),
    });

    if (res.ok) {
      onCreated();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Create post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("want")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                type === "want"
                  ? "bg-orange-50 border-orange-300 text-orange-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              I want a pass
            </button>
            <button
              type="button"
              onClick={() => setType("have")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                type === "have"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              I have a pass
            </button>
          </div>

          <div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                type === "want"
                  ? "Why do you want to attend YC Startup School India?"
                  : "Share details about your pass and why you can't make it."
              }
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              rows={5}
              maxLength={500}
              required
            />
            <p className={`text-xs text-right mt-1 ${remaining < 50 ? "text-red-400" : "text-gray-400"}`}>
              {remaining} remaining
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="w-full bg-yc text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
