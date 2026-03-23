import { Suspense } from "react";
import LoginPage from "./LoginClient";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
};

export default page;
