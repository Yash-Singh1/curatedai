import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="my-auto flex items-center justify-center min-h-screen">
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </div>
);
export default SignUpPage;
