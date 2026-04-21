import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-2xl font-semibold">403</h1>
      <p className="mt-2">You do not have permission to access this page.</p>
      <Link className="mt-4 inline-block underline" to="/courses">
        Go to courses
      </Link>
    </main>
  );
}
