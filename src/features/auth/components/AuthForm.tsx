import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "../../../lib/validations/auth";
import { loginUser, signupUser } from "../services/authApi";
import { useAuth } from "@/context/AuthContext";
import { buildGoogleOAuthUrl } from "../utils/googleOAuth";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: "onChange",
  });

  const isSignupMode = !isLogin;

  const getError = (field: keyof LoginFormData | keyof SignupFormData) => {
    if (isSignupMode) {
      return (errors as FieldErrors<SignupFormData>)[field as keyof SignupFormData]?.message;
    } else {
      return (errors as FieldErrors<LoginFormData>)[field as keyof LoginFormData]?.message;
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const loginData = data as LoginFormData;
        const response = await loginUser(loginData.email, loginData.password);
        const accessToken = response?.accessToken ?? response?.token;
        if (!accessToken) {
          throw new Error("Login succeeded but no access token was returned.");
        }
        await login(accessToken);
      } else {
        const signupData = data as SignupFormData;
        const response = await signupUser(signupData.email, signupData.password, signupData.name);
        console.log(response);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-4">
      {/* Mobile branding header */}
      <div className="lg:hidden text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">D</span>
          </div>
          <h1 className="text-2xl text-gray-900">
            <span className="font-semibold">DicetheLifeCoach</span>
            <span className="font-normal text-gray-700 ml-1">Academy</span>
          </h1>
        </div>
        <p className="text-gray-600">Transform your life with expert coaching</p>
      </div>

      <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-8 bg-white">
          <div className="text-center">
            <CardTitle className="text-3xl mb-2 text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {isLogin
                ? "Sign in to access your learning dashboard"
                : "Start your journey with us today"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all duration-200 rounded-lg ${
                        getError('name') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      {...register("name" as never)}
                    />
                    {getError('name') && (
                      <p className="text-red-500 text-sm mt-1">{getError('name')}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all duration-200 rounded-lg ${
                      getError('email') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("email" as never)}
                  />
                  {getError('email') && (
                    <p className="text-red-500 text-sm mt-1">{getError('email')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all duration-200 rounded-lg ${
                      getError('password') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("password" as never)}
                  />
                  {getError('password') && (
                    <p className="text-red-500 text-sm mt-1">{getError('password')}</p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className={`h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all duration-200 rounded-lg ${
                        getError('confirmPassword') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                      {...register("confirmPassword" as never)}
                    />
                    {getError('confirmPassword') && (
                      <p className="text-red-500 text-sm mt-1">{getError('confirmPassword')}</p>
                    )}
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("rememberMe" as never)}
                      />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-lg mt-8 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">or</span>
              </div>
            </div>

            {/* GOOGLE BUTTON ONLY */}
            <div className="grid grid-cols-1 gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  try {
                    window.location.href = buildGoogleOAuthUrl();
                  } catch (error) {
                    console.error(error);
                    alert("Google login is not configured correctly. Please contact support.");
                  }
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
              >
                {isLogin ? "Sign up for free" : "Sign in instead"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
