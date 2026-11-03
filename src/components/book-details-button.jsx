import Link from "next/link";

export default function BookDetailsButton({ bookId, className = "", children = "View details" }) {
  return (
    <Link
      href={`/all-books/${encodeURIComponent(bookId)}`}
      className={className}
    >
      {children}
    </Link>
  );
}
