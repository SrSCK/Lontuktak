import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

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

      {/* Get Started Button */}
      <div className="mb-8 sm:mb-12">
        <button
          onClick={() => navigate("/signup")}
          className="bg-[#EFECE3] hover:bg-[#E5E1D7] transition-colors duration-200 rounded-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] px-8 py-6 sm:px-12 sm:py-7 w-80 sm:w-[337px] text-center"
        >
          <span className="text-black/80 font-['Georama'] text-xl sm:text-2xl lg:text-[32px] font-normal tracking-[1.6px]">
            Let's Get Started
          </span>
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <span className="text-[#938D7A] font-['Georama'] text-lg sm:text-xl font-normal tracking-[0.3px]">
          Already have an account?{" "}
        </span>
        <button
          onClick={() => navigate("/login")}
          className="text-[#938D7A] font-['Georama'] text-lg sm:text-xl font-normal tracking-[0.3px] hover:text-[#7A7460] transition-colors duration-200 underline decoration-transparent hover:decoration-current"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
