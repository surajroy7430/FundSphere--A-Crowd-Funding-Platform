import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SigninForm from "./signin-form";

const SigninPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden
        before:content-[''] before:absolute before:w-[1500px] before:h-[1500px] lg:before:h-[2000px] 
        lg:before:w-[2000px] lg:before:top-[-10%] lg:before:right-[48%] max-lg:before:left-[30%] 
        max-md:before:left-1/2 before:z-[6] before:rounded-[50%] max-md:p-6 lg:before:-translate-y-1/2 
        max-lg:before:-translate-x-1/2 before:transition-all before:duration-[2s] lg:before:duration-[1.8s] 
        before:top-[initial] before:right-[initial] max-sm:bottom-[72%] max-lg:before:bottom-[75%]
        before:bg-gradient-to-br before:from-emerald-700 before:to-emerald-300"
    >
      {/* Signin Form */}
      <div className="absolute w-full h-full top-[-10%] lg:top-0 left-0">
        <div
          className="absolute top-[95%] lg:top-1/2 left-1/2 grid grid-cols-1 z-[5] 
          -translate-x-1/2 -translate-y-full lg:-translate-y-1/2 lg:w-1/2 w-full 
          transition-[1s] duration-[0.8s] ease-[ease-in-out] lg:left-3/4"
        >
          <div className="flex items-center justify-center flex-col px-20 max-md:px-6 max-md:py-0">
            <SigninForm />
          </div>
        </div>
      </div>

      {/* Left Panel */}
      <div className="absolute h-full w-full top-0 left-0 grid grid-cols-1 max-lg:grid-rows-[1fr_2fr_1fr] lg:grid-cols-2">
        <div
          className="flex flex-row justify-around lg:flex-col items-center max-lg:col-start-1 max-lg:col-end-2  
            max-lg:px-[8%] max-lg:py-10 lg:items-end  text-center z-[6] max-lg:row-start-1 max-lg:row-end-2    
            pl-[12%] pr-[17%] pt-12 pb-8"
        >
          <div className="text-emerald-900 max-md:px-4 max-md:py-2">
            <div className="py-2 text-sm lg:text-base px-0 lg:py-[0.7rem]">
              <p>Create an account and</p>
              <p className="font-medium">explore amazing features</p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-none shadow-lg px-10 py-5 bg-emerald-800/40 hover:bg-emerald-900/40 hover:text-emerald-950"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </div>
          <img
            src="https://i.ibb.co/nMy16wPM/login-img.webp"
            alt="login"
            loading="eager"
            className="max-md:hidden max-lg:translate-y-[-40px] w-[200px] lg:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
