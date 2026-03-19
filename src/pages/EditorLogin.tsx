import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Mail } from "lucide-react";

const ALLOWED_DOMAIN = "longevitychannel1.com";

type Mode = "login" | "signup" | "forgot" | "check-email";

const EditorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const isDomainValid = (email: string) => {
    const parts = email.split("@");
    return parts.length === 2 && parts[1].toLowerCase() === ALLOWED_DOMAIN;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDomainValid(email)) {
      toast({ title: "Access denied", description: `Only @${ALLOWED_DOMAIN} emails are allowed.`, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDomainValid(email)) {
      toast({ title: "Access denied", description: `Only @${ALLOWED_DOMAIN} email addresses can sign up.`, variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setMode("check-email");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Password reset link sent." });
    }
    setLoading(false);
  };

  // Email confirmation screen
  if (mode === "check-email") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-serif text-2xl font-semibold text-foreground">Check Your Email</h1>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to <strong className="text-foreground">{email}</strong>.
            Click the link in the email to activate your account, then come back here to log in.
          </p>
          <Button variant="outline" onClick={() => setMode("login")} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Editor Login"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? `Only @${ALLOWED_DOMAIN} emails`
              : mode === "forgot"
              ? "We'll send a reset link"
              : "Internal editorial access"}
          </p>
        </div>

        <form
          onSubmit={mode === "signup" ? handleSignup : mode === "forgot" ? handleForgotPassword : handleLogin}
          className="space-y-4"
        >
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={`you@${ALLOWED_DOMAIN}`}
            />
            {email && !isDomainValid(email) && email.includes("@") && (
              <p className="text-xs text-destructive">Only @{ALLOWED_DOMAIN} addresses allowed</p>
            )}
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Please wait…"
            ) : mode === "signup" ? (
              <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>
            ) : mode === "forgot" ? (
              "Send Reset Link"
            ) : (
              <><LogIn className="mr-2 h-4 w-4" /> Login</>
            )}
          </Button>
        </form>

        <div className="space-y-2">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("signup")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Need an account? Sign up
              </button>
              <button onClick={() => setMode("forgot")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </button>
            </>
          )}
          {mode !== "login" && (
            <button onClick={() => setMode("login")} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorLogin;
