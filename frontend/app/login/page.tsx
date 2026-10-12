import { SignIn } from "@clerk/nextjs";
import AuthLayout, { clerkAppearance } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout subtitle="Welcome back! Sign in to access your personal finance dashboard and real-time transaction reports.">
      <SignIn
        routing="hash"
        signUpUrl="/sign-up"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}
