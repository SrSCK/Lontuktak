import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // For now, just navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="mb-8 sm:mb-12 flex justify-center">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/430506859f2f6a6278acba170eb6abafb6d9ae81?width=1098"
          alt="LongTukTak Logo"
          className="w-64 h-auto sm:w-80 md:w-96 lg:w-[549px] max-w-full"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-black font-['Georama'] text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-[0.48px] mb-3">
          Welcome!
        </h1>
        <p className="text-black/80 font-['Georama'] text-lg sm:text-xl lg:text-2xl font-normal tracking-[0.36px]">
          Make your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md lg:max-w-[373px] space-y-4 mb-8">
        {/* Email Input */}
        <div className="relative">
          <div className="bg-[#EFECE3] rounded-sm flex items-center h-16 lg:h-[65px] px-4">
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.6668 28V25.3333C26.6668 23.9188 26.1049 22.5623 25.1047 21.5621C24.1045 20.5619 22.748 20 21.3335 20H10.6668C9.25234 20 7.89579 20.5619 6.89559 21.5621C5.8954 22.5623 5.3335 23.9188 5.3335 25.3333V28M21.3335 9.33333C21.3335 12.2789 18.9457 14.6667 16.0002 14.6667C13.0546 14.6667 10.6668 12.2789 10.6668 9.33333C10.6668 6.38781 13.0546 4 16.0002 4C18.9457 4 21.3335 6.38781 21.3335 9.33333Z"
                  stroke="#000200"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-transparent border-none shadow-none text-black/50 font-['Georama'] text-lg lg:text-xl font-normal tracking-[1px] placeholder:text-black/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="bg-[#EFECE3] rounded-sm flex items-center h-16 lg:h-[65px] px-4">
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3312_1756)">
                  <path
                    d="M26.2535 18.6666C26.5216 17.8028 26.6609 16.9043 26.6668 15.9999V6.66659L16.0002 2.66659L11.7868 4.23992M6.30683 6.30659L5.3335 6.66659V15.9999C5.3335 23.9999 16.0002 29.3333 16.0002 29.3333C18.8229 27.8438 21.3598 25.8667 23.4935 23.4933M1.3335 1.33325L30.6668 30.6666"
                    stroke="#1E1E1E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3312_1756">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent border-none shadow-none text-black/50 font-['Georama'] text-lg lg:text-xl font-normal tracking-[1px] placeholder:text-black/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
              required
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="bg-[#EFECE3] rounded-sm flex items-center h-16 lg:h-[65px] px-4">
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3312_1759)">
                  <path
                    d="M26.2535 18.6666C26.5216 17.8028 26.6609 16.9043 26.6668 15.9999V6.66659L16.0002 2.66659L11.7868 4.23992M6.30683 6.30659L5.3335 6.66659V15.9999C5.3335 23.9999 16.0002 29.3333 16.0002 29.3333C18.8229 27.8438 21.3598 25.8667 23.4935 23.4933M1.3335 1.33325L30.6668 30.6666"
                    stroke="#1E1E1E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3312_1759">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="bg-transparent border-none shadow-none text-black/50 font-['Georama'] text-lg lg:text-xl font-normal tracking-[1px] placeholder:text-black/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
              required
            />
          </div>
        </div>

        {/* Submit Button - Hidden, form submits on Enter */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      {/* Bottom Link */}
      <div className="text-center">
        <button
          onClick={() => navigate("/login")}
          className="text-[#938D7A] font-['Georama'] text-sm lg:text-base font-normal tracking-[0.24px] hover:text-[#7A7460] transition-colors duration-200"
        >
          Go to sign in
        </button>
      </div>
    </div>
  );
}
