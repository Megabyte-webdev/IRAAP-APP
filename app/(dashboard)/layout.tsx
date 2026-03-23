import { RouteProtector } from "../_hocs/RouteProtector";
import DashboardLayout from "./_components/DashboardLayout";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <RouteProtector>
      <DashboardLayout children={children} />{" "}
    </RouteProtector>
  );
}
