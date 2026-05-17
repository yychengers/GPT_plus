import { NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/blog-store";
import { postInputSchema } from "@/lib/validation";

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = postInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const post = await createPost(result.data);
  return NextResponse.json({ post }, { status: 201 });
}
