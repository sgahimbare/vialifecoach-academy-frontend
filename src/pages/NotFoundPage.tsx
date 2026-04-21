import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2">Page not found.</p>
      <Link className="mt-4 inline-block underline" to="/courses">
        Go to courses
      </Link>
    </main>
  );
}
