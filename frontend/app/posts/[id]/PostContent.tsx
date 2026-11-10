"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  status: number;
  status_label: "draft" | "published";
  author: { id: number; name: string };
  created_at: string;
  updated_at: string;
};

export default function PostContent() {
  const { id } = useParams<{ id: string }>();
  const { token, loading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    apiFetch<{ data: Post }>(`/posts/${id}`, { token })
      .then((res) => setPost(res.data))
      .catch((err: ApiError) =>
        setError(err.status === 404 ? "Post paowa jayni." : err.message)
      )
      .finally(() => setLoading(false));
  }, [id, token, authLoading]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (error || !post) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-red-500 mb-4">{error ?? "Post paowa jayni."}</p>
        <Link href="/" className="underline">
          &larr; Back to news
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm underline">
        &larr; Back to news
      </Link>

      <article className="mt-4">
        {post.status_label === "draft" && (
          <span className="text-xs border rounded px-2 py-0.5 text-yellow-500 border-yellow-500">
            Draft
          </span>
        )}

        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>

        <p className="text-sm text-gray-400 mt-2">
          by {post.author.name} ·{" "}
          {new Date(post.created_at).toLocaleDateString("en-GB")}
        </p>

        {post.excerpt && (
          <p className="text-gray-500 italic mt-4">{post.excerpt}</p>
        )}

        <div className="mt-6 whitespace-pre-line leading-7">{post.body}</div>
      </article>
    </main>
  );
}