import { Suspense } from "react";
import LoginPage from "./LoginClient";
import Loading from "@/app/(dashboard)/loading";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  );
};

export default page;
