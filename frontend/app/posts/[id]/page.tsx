import { Suspense } from "react";
import PostContent from "./PostContent";

export default function PostPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading post...</p>}>
      <PostContent />
    </Suspense>
  );
}