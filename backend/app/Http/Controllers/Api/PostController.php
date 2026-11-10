<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    // Public: shudhu published post
    public function index(): AnonymousResourceCollection
    {
        $posts = Post::published()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
    }

    // Login kora user er nijer post (draft shoho)
    public function mine(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()
            ->posts()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
    }

    // Public: published hole shobai dekhbe, draft hole shudhu owner
    public function show(Request $request, Post $post): PostResource
    {
        if ($post->status !== Post::STATUS_PUBLISHED) {
            $user = $request->user('sanctum');
            abort_unless($user && $user->id === $post->user_id, 404);
        }

        return new PostResource($post->load('user:id,name'));
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $request->user()->posts()->create($request->validated());

        return (new PostResource($post->load('user:id,name')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        abort_unless($request->user()->id === $post->user_id, 403, 'This is not your Post.');

        $post->update($request->validated());

        return new PostResource($post->load('user:id,name'));
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        abort_unless($request->user()->id === $post->user_id, 403, 'This is not your Post.');

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}