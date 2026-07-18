import { Search, LayoutDashboard, Users, Video } from "lucide-react";

const Capabilities = () => {
  return (
    <section className="bg-[#F8F9FA] py-23.75 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mx-auto mb-16 space-y-2 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
            FEATURES
          </span>

          <h2 className="text-3xl font-bold text-black">
            Everything you need to complete your research efficiently.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Box 1 */}
          <div className="group flex min-h-60 flex-col items-center rounded-lg border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/40">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 shadow transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">
              <Search className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:rotate-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-black transition-colors group-hover:text-blue-600">
              Smart Archive Search
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              Find legacy references effortlessly. Query full repositories using
              highly targeted conceptual indexing criteria parsed strictly
              across OOU CEng research archives dating back multiple cycles.
            </p>
          </div>

          {/* Box 2 */}
          <div className="group flex min-h-60 flex-col items-center rounded-lg border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/40">
            <div className="mb-6 flex h-10 w-10 items-center justify-center shadow rounded-lg bg-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
              <LayoutDashboard className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover:rotate-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-black transition-colors group-hover:text-emerald-600">
              Student Workspace
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              Track phase timelines dynamically. Manage active milestones, keep
              safe backups of sequential code configurations, and file chapter
              artifacts neatly directly inside your workspace vault.
            </p>
          </div>

          {/* Box 3 */}
          <div className="group flex min-h-60 flex-col items-center rounded-lg border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100/40">
            <div className="mb-6 flex h-10 w-10 items-center justify-center shadow rounded-lg bg-amber-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-100">
              <Users className="h-5 w-5 text-amber-600 transition-transform duration-300 group-hover:rotate-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-black transition-colors group-hover:text-amber-600">
              Supervisor Collaboration
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              Eliminate coordination delays completely. Receive instantaneous
              context-specific review feedback, access revision directives, and
              acquire step approvals directly inside digital checkpoint notes.
            </p>
          </div>

          {/* Box 4 */}
          <div className="group flex min-h-60 flex-col items-center rounded-lg border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-100/40">
            <div className="mb-6 flex h-10 w-10 items-center justify-center shadow rounded-lg bg-red-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-100">
              <Video className="h-5 w-5 text-red-600 transition-transform duration-300 group-hover:rotate-6" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-black transition-colors group-hover:text-red-600">
              Video Consultations
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              Schedule and carry out dynamic progress presentations face-to-face
              via secure video pathways configured to enable remote interface
              assessment whenever localized syncs prove impractical.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
