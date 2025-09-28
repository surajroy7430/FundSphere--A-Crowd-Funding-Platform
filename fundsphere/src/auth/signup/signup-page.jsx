import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SignupForm from "./signup-form";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden 
      before:content-[''] before:absolute before:w-[1500px] before:h-[1500px] lg:before:h-[2000px] 
      lg:before:w-[2000px] lg:before:top-[-10%] lg:before:right-[48%] max-lg:before:left-[30%] 
      max-md:before:left-1/2 before:z-[6] before:rounded-[50%] max-md:p-6 lg:before:-translate-y-1/2 
      max-lg:before:-translate-x-1/2 before:transition-all before:duration-[2s] 
      lg:before:duration-[1.8s] before:top-[initial] before:right-[initial] max-sm:bottom-[72%]
      max-lg:before:bottom-[75%] lg:before:translate-x-full before:-translate-x-1/2 before:translate-y-full 
      sm:max-lg:before:bottom-[22%] max-sm:before:bottom-[20%]
      before:bg-gradient-to-bl before:from-emerald-700 before:to-emerald-300"
    >
      {/* Signup Form */}
      <div className="absolute w-full h-full top-[20%] lg:top-0 left-0">
        <div
          className="absolute top-[95%] lg:top-1/2 left-1/2 grid grid-cols-1 z-[5] 
            -translate-x-1/2 -translate-y-full lg:-translate-y-1/2 lg:w-1/2 w-full
            transition-[1s] duration-[0.8s] ease-[ease-in-out] lg:duration-[0.7s] lg:left-1/4 
            max-lg:top-[-10%] max-lg:-translate-x-2/4 max-lg:translate-y-0"
        >
          <div className="flex items-center justify-center flex-col px-20 max-md:px-6">
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-1 max-lg:grid-rows-[1fr_2fr_1fr] lg:grid-cols-2">
        {/* Right Panel */}
        <div
          className="flex flex-row max-lg:row-start-3 max-lg:row-end-4 lg:flex-col items-center lg:items-end 
            justify-around text-center z-[6] max-lg:col-start-1 max-lg:col-end-2 lg:col-start-2 lg:col-end-3  
            max-lg:px-[8%] max-lg:py-10 pl-[17%] pr-[12%] pt-12 pb-8"
        >
          <div className="text-emerald-900 max-md:px-4 max-md:py-2">
            <Button
              variant="outline"
              className="rounded-full border-none shadow-lg px-10 py-5 bg-emerald-800/40 hover:bg-emerald-900/40 hover:text-emerald-950"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <p className="py-2 text-sm lg:text-base px-0 lg:py-[0.7rem]">
              Sign in to continue where you left off
            </p>
          </div>
          <img
            src="https://i.ibb.co/Vc1dSYf3/register-img.webp"
            alt="register"
            loading="eager"
            className="max-md:hidden w-[200px] lg:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
