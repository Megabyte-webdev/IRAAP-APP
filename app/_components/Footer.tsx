export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">IRAP</h2>
          <p className="text-gray-400 text-sm">
            Institutional Research Archive Platform © 2026
          </p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">
            About
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
