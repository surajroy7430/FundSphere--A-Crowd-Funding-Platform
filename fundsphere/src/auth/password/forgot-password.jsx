import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RiMailFill } from "@remixicon/react";
import axios from "axios";

const schema = z.object({
  email: z.email("Enter a valid email").trim(),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  useEffect(() => {
    form.reset();
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`,
        {
          email: values.email,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.msg || "Reset Link sent to your email.");
      }
    } catch (error) {
      toast.error(
        error.response.data.msg || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen grid place-items-center bg-gradient-to-br from-[#ecf3f1] via-[#dffae7] to-[#b8c9e3] overflow-hidden">
      {/* background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#c7eaf0] rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#10e8f0] rounded-full blur-3xl opacity-20 animate-ping"></div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/40 backdrop-blur-md p-0 mx-4 sm:mx-0">
          <CardContent className="p-8 space-y-6 rounded-xl">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-600">
                Forgot Password?
              </h2>
              <p className="text-sm text-zinc-500">
                Don't worry! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-5"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <RiMailFill size={18} className="text-zinc-400" />
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="bg-white/80 pl-10 transition-all duration-200
                              border border-zinc-400/40 placeholder:text-zinc-400"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer uppercase w-full p-6 tracking-[2px] 
                  bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 
                    shadow-md hover:shadow-lg hover:scale-[1.01]"
                >
                  {isLoading ? "Sending..." : "Send Link"}
                </Button>
              </form>
            </Form>

            <p className="text-center text-zinc-500 tracking-tighter">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-400/70 font-medium hover:underline hover:underline-offset-2"
              >
                Sign up now
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
