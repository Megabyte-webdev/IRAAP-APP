export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Professional Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-950 uppercase tracking-wider">
            OOU | Repository
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <a href="/projects" className="hover:text-blue-900">
              Archives
            </a>
            <a
              href="/login"
              className="bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-blue-800"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* High-Authority Hero Section */}
      <header className="bg-slate-950 text-white py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-4">
            Institutional Research Archive
          </h2>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Securing Excellence in
            <br /> Engineering Research
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            The official digital repository for final year project submissions,
            facilitating seamless collaboration between students and supervisors
            at the Department of Computer Engineering.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200">
              View Archive
            </button>
            <button className="bg-blue-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-800">
              Submit Project
            </button>
          </div>
        </div>
      </header>

      {/* Information Statistics Bar */}
      <section className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">1,200+</div>
            <div className="text-blue-200 mt-2">Projects Archived</div>
          </div>
          <div>
            <div className="text-4xl font-bold">450+</div>
            <div className="text-blue-200 mt-2">Registered Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold">99.9%</div>
            <div className="text-blue-200 mt-2">Uptime Guaranteed</div>
          </div>
        </div>
      </section>
    </div>
  );
}
