import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/lib/models/Post";

// Simple in-memory rate limiter — good enough for this scale
const rateLimitMap = new Map<string, number>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(userId);
  if (last && now - last < 30_000) return true; // 30 second cooldown
  rateLimitMap.set(userId, now);
  return false;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const filter: any = {};
  if (type === "want" || type === "have") filter.type = type;

  const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;

  if (isRateLimited(user.id)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const { type, body } = await req.json();

  if (!["want", "have"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!body || body.trim().length === 0 || body.length > 500) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await connectDB();

  const existing = await Post.findOne({ authorId: user.id });
  if (existing) {
    return NextResponse.json(
      { error: "You already have a post. Delete it first to post again." },
      { status: 409 }
    );
  }

  const post = await Post.create({
    authorId: user.id,
    authorName: user.name,
    authorUsername: user.username,
    authorImage: user.image ?? "",
    type,
    body: body.trim(),
  });

  return NextResponse.json(post, { status: 201 });
}
