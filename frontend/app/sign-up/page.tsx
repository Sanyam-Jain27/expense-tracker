import { SignUp } from "@clerk/nextjs";
import AuthLayout, { clerkAppearance } from "@/components/auth/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout subtitle="Create your free account today and start tracking your expenses, cashflow, and savings in minutes.">
      <SignUp
        routing="hash"
        signInUrl="/login"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}
