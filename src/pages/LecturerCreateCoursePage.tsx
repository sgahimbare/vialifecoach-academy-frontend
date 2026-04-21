import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { courseService } from "@/services/courseService";

export default function LecturerCreateCoursePage() {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await courseService.createCourse({ title, description }, accessToken);
      setMessage("Course created successfully.");
      setTitle("");
      setDescription("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Create New Course</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Course Title</span>
          <input
            className="mt-1 w-full rounded border p-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Course Description</span>
          <textarea
            className="mt-1 w-full rounded border p-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded bg-black px-4 py-2 text-white" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </main>
  );
}
