import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-md text-center">
      <h1 className="text-xl font-semibold text-white">Room not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        The room you were looking for doesn&apos;t exist or never started up.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm text-accent-300 hover:text-accent-400"
      >
        ← back to all rooms
      </Link>
    </div>
  );
}
