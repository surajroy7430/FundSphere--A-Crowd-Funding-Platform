import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { RiLockPasswordFill } from "@remixicon/react";
import axios from "axios";

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, "Password must be atleast 6 characters long"),
    confirmPassword: z.string().trim().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords not matched",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [successOpen, setSuccessOpen] = useState(false);

  const token = searchParams.get("t");

  const form = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    form.reset();
  }, []);

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password?t=${token}`,
        {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }
      );

      if (res.status === 200) {
        setSuccessOpen(true);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors);
        toast.error(errors.join(", "));
      } else {
        toast.error(
          error.response?.data?.msg || "Something went wrong. Please try again."
        );
      }
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
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-600">
                Reset Your Password
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Enter your new password below and confirm to continue.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-5"
              >
                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <RiLockPasswordFill
                            size={18}
                            className="text-zinc-400"
                          />
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="off"
                            placeholder="New Password"
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <RiLockPasswordFill
                            size={18}
                            className="text-zinc-400"
                          />
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="off"
                            placeholder="Confirm Password"
                            className="bg-white/80 pl-10 transition-all duration-200
                              border border-zinc-400/40 placeholder:text-zinc-400"
                            {...field}
                            onPaste={(e) => e.preventDefault()}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="cursor-pointer uppercase w-full p-6 tracking-[2px] 
                  bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 
                    shadow-md hover:shadow-lg hover:scale-[1.01]"
                >
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[300px] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-green-600 text-center text-xl md:text-2xl font-bold">
              Password Updated 🎉
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center space-y-2 mt-2 mb-4">
            <p className="text-[15px] text-zinc-600">
              Your password has been updated successfully.
            </p>
            <p className="text-sm text-zinc-500">
              For your security, please use your new password the next time you
              log in.
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full bg-green-500 hover:bg-green-600 cursor-pointer uppercase p-5 tracking-[2px]"
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
