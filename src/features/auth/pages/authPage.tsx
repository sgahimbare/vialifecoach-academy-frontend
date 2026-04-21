
import { BrandingSide } from "../../../components/common/BrandingSide";
import { AuthForm } from "../components/AuthForm";

export function AuthPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding side */}
      <BrandingSide />
      
      {/* Right authentication side */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-8 lg:px-8">
        <div className="w-full max-w-md">
          <AuthForm/>
        </div>
      </div>
    </div>
  );
}