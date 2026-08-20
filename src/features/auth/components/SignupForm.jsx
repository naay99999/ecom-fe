import { Link } from "react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({ className, error, isPending, onSubmit, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
                <Input id="signup-name" name="name" type="text" placeholder="John Doe" required disabled={isPending} />
              </Field>
              <Field>
                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required disabled={isPending} />
              </Field>
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <Input id="signup-password" name="password" type="password" required disabled={isPending} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="signup-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="signup-confirm-password" name="confirmPassword" type="password" required disabled={isPending} />
                  </Field>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                {error ? <FieldDescription className="text-destructive">{error}</FieldDescription> : null}
                <Button type="submit" disabled={isPending}>{isPending ? "Creating account…" : "Create Account"}</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
