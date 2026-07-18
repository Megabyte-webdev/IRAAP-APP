import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white text-xs text-gray-500 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-8 mb-12">
        <div className="flex-1 space-y-3">
          <Link href="/" className="flex items-center w-max">
            {" "}
            <Image
              src="/irap-logo.png"
              alt="IRAAP"
              width={42}
              height={42}
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />{" "}
          </Link>
          <p className="max-w-xs text-gray-600 leading-relaxed">
            The Hub for your external archiving files. OOU Computer Engineering
            automated project submission and tracking tool.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider mb-3">
            Platform
          </h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Archive
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Get Started
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-gray-800 uppercase text-[10px] tracking-wider mb-3">
            Support
          </h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Platform Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition">
                Submit Legal Questions
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl text-center mx-auto pt-6 border-t border-gray-200 flex items-center justify-center text-gray-400">
        <p>© 2026 OOU Computer Engineering Dept. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
