import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const project =
      await prisma.project.findUnique({
        where: {
          id,
        },
      });

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load project",
      },
      {
        status: 500,
      }
    );
  }
}