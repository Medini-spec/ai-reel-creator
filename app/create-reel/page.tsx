"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateReelPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState("5");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a Reel title.");
      return;
    }

    if (!prompt.trim()) {
      alert("Please describe what you want in the Reel.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          prompt,
          style,
          duration: Number(duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create Reel"
        );
      }

      // Redirect to the project page
      router.push(`/projects/${data.project.id}`);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Reel Creator
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Create an AI Reel
          </h1>

          <p className="mt-3 text-gray-600">
            Turn your idea into an Instagram-ready video.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >

          {/* Title */}
          <div>
            <label className="block font-semibold text-gray-900">
              Reel Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Luxury Coffee Shop"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Prompt */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-900">
              What should the video show?
            </label>

            <textarea
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              placeholder="Show beautiful coffee preparation, a barista making espresso, happy customers and a premium coffee shop atmosphere..."
              rows={6}
              className="mt-2 w-full rounded-lg border border-gray-300 p-4 outline-none focus:border-black"
            />
          </div>

          {/* Style */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-900">
              Video Style
            </label>

            <select
              value={style}
              onChange={(event) =>
                setStyle(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="Cinematic">
                Cinematic
              </option>

              <option value="Realistic">
                Realistic
              </option>

              <option value="Luxury">
                Luxury
              </option>

              <option value="Animation">
                Animation
              </option>

              <option value="Product Advertisement">
                Product Advertisement
              </option>

              <option value="Social Media">
                Social Media
              </option>
            </select>
          </div>

          {/* Duration */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-900">
              Duration
            </label>

            <select
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            >
              <option value="5">
                5 seconds
              </option>

              <option value="10">
                10 seconds
              </option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Reel..."
              : "Create Reel"}
          </button>

        </form>
      </div>
    </main>
  );
}