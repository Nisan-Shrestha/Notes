import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(alphanumericRegex, "Username must be alphanumeric"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

function SignUp() {
  const { signup, checkUsername } = useAuth();
  const [usernameStatus, setUsernameStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: "",
  });

  const [usernameDebounceTimer, setUsernameDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {},
  });

  const username = form.watch("username");

  useEffect(() => {
    if (username && username.length >= 3 && alphanumericRegex.test(username)) {
      setUsernameStatus({
        isChecking: true,
        isAvailable: null,
        message: "Checking username availability...",
      });

      if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer);

      const timer = setTimeout(async () => {
        const isAvailable = await checkUsername(username);

        setUsernameStatus({
          isChecking: false,
          isAvailable,
          message: isAvailable
            ? "✓ Username is available"
            : "✗ Username is already taken",
        });

        if (!isAvailable) {
          form.setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
        } else {
          form.clearErrors("username");
        }
      }, 500);

      setUsernameDebounceTimer(timer);
    } else {
      setUsernameStatus({
        isChecking: false,
        isAvailable: null,
        message: "",
      });
    }

    return () => {
      if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  function onSubmit(values: z.infer<typeof signupSchema>) {
    if (usernameStatus.isAvailable === false) {
      toast.error("Username is already taken");
      return;
    }
    if (usernameStatus.isChecking) {
      return;
    }
    signup(values.email, values.password, values.name, values.username);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Notes.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Create an account.</h1>
                  <div className="text-muted-foreground text-sm text-balance max-w-md">
                    <p>
                      “Writing is an act of discovering what you think and what
                      you believe”
                    </p>
                    <p className="font-bold">— Danial H. Pink</p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Email or Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Retype Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Button type="submit">Submit</Button>
                  <span className="text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/banner.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default SignUp;
