import { BadgeCheck, ShieldUser, Cpu } from "lucide-react";

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-8 border-y border-gray-200 grid grid-cols-1 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-gray-200 text-center">
      {/* Feature 1 */}
      <div className="group flex flex-col items-center space-y-4 px-4 py-6 md:py-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-md shadow-gray-100/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:scale-105">
          <ShieldUser
            size={20}
            className="text-primary transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-primary">
          Exclusive to OOU CPE
        </h3>

        <p className="max-w-80 text-sm leading-relaxed text-gray-400">
          A dedicated environment for computer engineering faculty and students.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="group flex flex-col items-center space-y-4 px-4 py-6 md:py-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-md shadow-gray-100/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-100 group-hover:scale-105">
          <Cpu
            size={20}
            className="text-amber-500 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-amber-500">
          Hardware & Software Archives
        </h3>

        <p className="max-w-80 text-sm leading-relaxed text-gray-400">
          Comprehensive indexing of both practical hardware implementations and
          software systems.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="group flex flex-col items-center space-y-4 px-4 py-6 md:py-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-md shadow-gray-100/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-100 group-hover:scale-105">
          <BadgeCheck
            size={20}
            className="text-emerald-500 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-emerald-500">
          Streamlined Supervisor Grading
        </h3>

        <p className="max-w-80 text-sm leading-relaxed text-gray-400">
          Integrated feedback loops and progress tracking for final year
          projects.
        </p>
      </div>
    </section>
  );
};

export default Features;
