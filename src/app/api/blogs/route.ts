import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // 🚀 No need to pass slug manually; schema will generate one
    const blog = new Blog({
      ...data,
      slug: data.slug || undefined, // If frontend provides slug, use it; else schema hook runs
    });

    await blog.save();
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);

    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { error: "Slug already exists. Try a different title." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
