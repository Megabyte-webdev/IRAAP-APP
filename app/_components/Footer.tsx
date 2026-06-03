import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-semibold">Institutional Research Archive</h3>

            <p className="mt-3 text-sm text-muted-foreground">
              A modern repository for scholarly research and academic
              publications.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Explore</h4>

            <div className="space-y-2">
              <Link href="/repository">Repository</Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Resources</h4>

            <div className="space-y-2">
              <Link href="/archive">Archive</Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Company</h4>

            <div className="space-y-2">
              <Link href="/about">About</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground">
          © 2026 Institutional Research Archive.
        </div>
      </div>
    </footer>
  );
}
