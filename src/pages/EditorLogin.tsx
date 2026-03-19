import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogIn, UserPlus, KeyRound } from "lucide-react";

const ALLOWED_DOMAIN = "longevitychannel1.com";

type Mode = "login" | "signup" | "forgot" | "mfa-enroll" | "mfa-verify";

const EditorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [totpCode, setTotpCode] = useState("");
  const [qrUri, setQrUri] = useState("");
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const isDomainValid = (email: string) => {
    const parts = email.split("@");
    return parts.length === 2 && parts[1].toLowerCase() === ALLOWED_DOMAIN;
  };

  // Check if user already has a session and needs MFA verification
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal) {
          if (aal.currentLevel === "aal1" && aal.nextLevel === "aal2") {
            // Needs to complete MFA challenge
            await startMfaChallenge();
          } else if (aal?.currentLevel === "aal2") {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDomainValid(email)) {
      toast({ title: "Access denied", description: `Only @${ALLOWED_DOMAIN} emails are allowed.`, variant: "destructive" });
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check MFA status
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2") {
      await startMfaChallenge();
    } else {
      // No MFA enrolled — offer enrollment
      setMode("mfa-enroll");
    }
    setLoading(false);
  };

  const startMfaChallenge = async () => {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    if (!totp) {
      setMode("mfa-enroll");
      return;
    }
    setFactorId(totp.id);
    const { data: challenge, error } = await supabase.auth.mfa.challenge({ factorId: totp.id });
    if (error) {
      toast({ title: "MFA error", description: error.message, variant: "destructive" });
      return;
    }
    setChallengeId(challenge.id);
    setMode("mfa-verify");
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: totpCode,
    });
    if (error) {
      toast({ title: "Invalid code", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Authenticated" });
    navigate("/dashboard");
    setLoading(false);
  };

  const handleMfaEnroll = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator App" });
    if (error) {
      toast({ title: "MFA enrollment failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setQrUri(data.totp.uri);
    setFactorId(data.id);
    setMode("mfa-enroll");
    setLoading(false);
  };

  const handleMfaConfirmEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Challenge + verify to activate the factor
    const { data: challenge, error: chalErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chalErr) {
      toast({ title: "Error", description: chalErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const { error: verErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: totpCode,
    });
    if (verErr) {
      toast({ title: "Invalid code", description: verErr.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: "Two-factor enabled!", description: "Your account is now protected with 2FA." });
    navigate("/dashboard");
    setLoading(false);
  };

  const handleSkipMfa = () => {
    navigate("/dashboard");
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
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now log in." });
      setMode("login");
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

  // MFA enrollment screen
  if (mode === "mfa-enroll") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Shield className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="font-serif text-2xl font-semibold text-foreground">Set Up Two-Factor Auth</h1>
            <p className="text-sm text-muted-foreground mt-1">Scan the QR code with your authenticator app</p>
          </div>

          {!qrUri ? (
            <Button onClick={handleMfaEnroll} className="w-full" disabled={loading}>
              {loading ? "Setting up…" : "Enable 2FA"}
            </Button>
          ) : (
            <form onSubmit={handleMfaConfirmEnroll} className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUri)}`}
                  alt="MFA QR Code"
                  className="rounded-lg border"
                  width={200}
                  height={200}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center break-all">{qrUri}</p>
              <div className="space-y-2">
                <Label htmlFor="totp">Enter 6-digit code</Label>
                <Input
                  id="totp"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || totpCode.length !== 6}>
                {loading ? "Verifying…" : "Verify & Enable"}
              </Button>
            </form>
          )}

          <button onClick={handleSkipMfa} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // MFA verification screen
  if (mode === "mfa-verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <KeyRound className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="font-serif text-2xl font-semibold text-foreground">Two-Factor Verification</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the code from your authenticator app</p>
          </div>

          <form onSubmit={handleMfaVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-verify">6-digit code</Label>
              <Input
                id="totp-verify"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || totpCode.length !== 6}>
              {loading ? "Verifying…" : "Verify"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Login / Signup / Forgot password
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
