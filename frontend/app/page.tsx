"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type {
  PaginatedResponse,
  PaginationMeta,
  PostListItem,
} from "@/app/types/post";

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    apiFetch<PaginatedResponse<PostListItem>>(`/posts?page=${page}`)
      .then((res) => {
        setPosts(res.data);
        setMeta(res.meta);
        setError(null);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Something went wrong")
      )
      .finally(() => setLoading(false));
  }, [page]);

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Latest News
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Shorboshesh khobor, ek jaygay.
        </p>
      </div>

      {loading && posts.length === 0 ? (
        <ul className="space-y-4">
          {[1, 2, 3].map((n) => (
            <li key={n} className="h-28 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </ul>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Kono news nai.
        </div>
      ) : (
        <ul
          className={`space-y-4 transition-opacity ${
            loading ? "opacity-50" : ""
          }`}
        >
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium text-slate-700">
                    {post.author.name}
                  </span>
                  <span>·</span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.last_page > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            &larr; Previous
          </button>

          <span className="text-sm text-slate-500">
            Page {meta.current_page} of {meta.last_page}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= meta.last_page || loading}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </main>
  );
}