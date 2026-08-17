"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Project = {
  id: string;
  title: string;
  prompt: string;
  style: string;
  duration: number;
  status: string;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectPage() {
  const params = useParams();

  const id = params.id as string;

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadProject() {
    try {
      const response = await fetch(
        `/api/projects/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Project not found"
        );
      }

      setProject(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load project"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-5xl">🎬</div>

          <h1 className="mt-4 text-2xl font-bold">
            Loading your Reel...
          </h1>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold">
            Project not found
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-4xl font-bold">
          {project.title}
        </h1>

        <p className="mt-3 text-gray-600">
          {project.prompt}
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Style
              </p>

              <p className="font-semibold">
                {project.style}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="font-semibold">
                {project.duration}s
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="font-semibold">
                {project.status}
              </p>
            </div>
          </div>

          {project.status === "PENDING" && (
            <div className="mt-8 rounded-xl border p-8 text-center">
              <div className="text-5xl">
                🎬
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                Ready to generate
              </h2>

              <p className="mt-2 text-gray-600">
                Your Reel project is ready for the free
                local video generator.
              </p>
            </div>
          )}

          {project.status === "PROCESSING" && (
            <div className="mt-8 rounded-xl border p-8 text-center">
              <div className="text-5xl">
                ⏳
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                Creating your Reel...
              </h2>
            </div>
          )}

          {project.status === "COMPLETED" &&
            project.videoUrl && (
              <div className="mt-8">

                <h2 className="text-2xl font-bold">
                  Your Reel is Ready 🎉
                </h2>

                <video
                  controls
                  playsInline
                  className="mt-5 w-full rounded-xl bg-black"
                  src={project.videoUrl}
                />

                <a
                  href={project.videoUrl}
                  download
                  className="mt-5 block rounded-lg bg-black py-3 text-center font-semibold text-white"
                >
                  Download Reel
                </a>

              </div>
            )}

          {project.status === "FAILED" && (
            <div className="mt-8 rounded-xl bg-red-50 p-6 text-center text-red-700">
              Video generation failed.
            </div>
          )}

        </div>
      </div>
    </main>
  );
}