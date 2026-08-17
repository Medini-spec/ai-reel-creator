import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      prompt,
      style,
      duration,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    /*
     * Temporary development user.
     * We will replace this with real authentication later.
     */
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: "demo@example.com",
          name: "Demo User",
        },
      });
    }

const project = await prisma.project.create({
  data: {
    id: crypto.randomUUID(),
    userId: user.id,
    title: title.trim(),
    prompt: prompt.trim(),
    style: style || "Cinematic",
    duration: Number(duration) || 5,
    status: "PENDING",
    updatedAt: new Date(),
  },
});
    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}