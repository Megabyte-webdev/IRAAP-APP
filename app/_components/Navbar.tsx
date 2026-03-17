import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">IRAP</div>

        <div className="space-x-6 hidden md:flex">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/repository" className="hover:text-blue-600 transition">
            Repository
          </Link>
          <Link href="/login" className="hover:text-blue-600 transition">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Project
          </Link>
        </div>
      </div>
    </nav>
  );
}
