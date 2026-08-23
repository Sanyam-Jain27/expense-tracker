import { SignUp } from "@clerk/nextjs";
const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <SignUp routing="hash" signInUrl="/login" />
    </div>
  );
};
export default SignUpPage;
