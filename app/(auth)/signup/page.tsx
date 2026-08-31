import { Suspense } from "react";
import Loading from "@/app/(dashboard)/loading";
import { generatePageMetadata } from "@/app/_lib/metadata";
import SignupPage from "./SignupPage";

export const metadata = generatePageMetadata({
  title: "Create an Account · IRAAP Repository",
  description: "Create a student account to submit and manage academic research projects in IRAAP.",
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupPage />
    </Suspense>
  );
}
