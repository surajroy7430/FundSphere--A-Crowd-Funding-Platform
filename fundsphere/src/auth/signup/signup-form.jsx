import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RiUser3Fill, RiMailFill, RiLockPasswordFill } from "@remixicon/react";

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Name must be atleast 3 characters")
    .regex(/^[A-Za-z0-9 ]+$/, "No special character allowed in Username"),
  email: z.email("Enter a valid email").trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be atleast 6 characters long"),
  terms: z.literal(true),
});

const SignupForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: { username: "", email: "", password: "", terms: false },
  });

  useEffect(() => {
    form.reset();
  }, []);

  const onSubmit = async (values) => {
    const res = await register(values.username, values.email, values.password);

    if (res.success) {
      toast.success(res.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(res.message);
    }
  };

  const onError = (err) => {
    console.log("VALIDATION ERROR:", err);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardContent className="space-y-6 ">
        <h2 className="text-xl md:text-2xl font-bold leading-tight text-center text-emerald-600">
          Sign up
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4 md:space-y-5"
          >
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <RiUser3Fill size={18} className="text-zinc-400" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="bg-white/20 pl-10 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="Email address"
                        className="bg-white/20 pl-10 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <RiLockPasswordFill size={18} className="text-zinc-400" />
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="off"
                        placeholder="Password"
                        className="bg-white/20 pl-10 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <label
                      htmlFor="terms"
                      className="text-zinc-500 text-sm leading-none"
                    >
                      I agree to the{" "}
                      <span className="text-emerald-400/70 font-medium">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-emerald-400/70 font-medium">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="uppercase w-full p-6 tracking-[3px] bg-emerald-500 hover:bg-emerald-600
                transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
