import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { RiMailFill, RiLockPasswordFill } from "@remixicon/react";

const signinSchema = z.object({
  email: z.email("Enter a valid email").trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be atleast 6 characters long"),
  remember: z.literal(true),
});

const SigninForm = () => {
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    form.reset();
  }, []);

  const onSubmit = async (values) => {
    const res = await login(values.email, values.password);

    if (!res.success) {
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
          Sign in
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
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

            <div className="flex items-center justify-between">
              {/* Remember me Checkbox */}
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <label
                        htmlFor="remember"
                        className="text-zinc-500 text-sm leading-none"
                      >
                        Remember me
                      </label>
                    </div>
                  </FormItem>
                )}
              />

              <Link
                to="/forgot-password"
                className="text-sm font-medium hover:underline hover:underline-offset-2 text-emerald-600/70"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="cursor-pointer uppercase w-full p-6 tracking-[3px] bg-emerald-500 hover:bg-emerald-600
                transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01]"
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
