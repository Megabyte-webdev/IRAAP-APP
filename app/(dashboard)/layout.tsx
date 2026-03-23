import DashboardLayout from "./_components/DashboardLayout";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardLayout children={children} />
    </div>
  );
}
