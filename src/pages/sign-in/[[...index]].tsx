import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="my-auto flex items-center justify-center min-h-screen">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);
export default SignInPage;
