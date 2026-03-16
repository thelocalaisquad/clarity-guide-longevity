import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Send, Sparkles, Linkedin, Twitter, Facebook, Instagram, Video, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SocialPosts {
  linkedin: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  x_thread: string[];
  substack: string;
}

interface EditionSocialGeneratorProps {
  title: string;
  summary: string;
  category: string;
  expertName: string;
  expertCredential: string;
  productName: string;
  productDescription: string;
  canonicalUrl: string;
}

const platformConfig = [
  { key: "linkedin" as const, label: "LinkedIn", icon: Linkedin, color: "bg-[#0A66C2]" },
  { key: "facebook" as const, label: "Facebook", icon: Facebook, color: "bg-[#1877F2]" },
  { key: "instagram" as const, label: "Instagram", icon: Instagram, color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
  { key: "tiktok" as const, label: "TikTok", icon: Video, color: "bg-foreground" },
  { key: "x_thread" as const, label: "X (Twitter)", icon: Twitter, color: "bg-foreground" },
  { key: "substack" as const, label: "Substack", icon: Mail, color: "bg-[#FF6719]" },
] as const;

const EditionSocialGenerator = ({
  title,
  summary,
  category,
  expertName,
  expertCredential,
  productName,
  productDescription,
  canonicalUrl,
}: EditionSocialGeneratorProps) => {
  const [posts, setPosts] = useState<SocialPosts | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [activeTab, setActiveTab] = useState<string>("linkedin");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-social-content", {
        body: { title, summary, category, expertName, expertCredential, productName, productDescription, canonicalUrl },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPosts(data as SocialPosts);
      toast({ title: "Social posts generated!", description: "Review and edit before distributing." });
    } catch (e: any) {
      console.error("Generation error:", e);
      toast({ title: "Generation failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToN8n = async () => {
    if (!webhookUrl) {
      toast({ title: "Enter your n8n webhook URL", variant: "destructive" });
      return;
    }
    if (!posts) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-to-n8n", {
        body: { webhookUrl, editionTitle: title, socialPosts: posts },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Sent to n8n!", description: "Check your n8n workflow execution." });
    } catch (e: any) {
      console.error("Send error:", e);
      toast({ title: "Failed to send", description: e.message || "Check webhook URL.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${platform} content copied!` });
  };

  const getPostContent = (key: string): string => {
    if (!posts) return "";
    if (key === "x_thread") return posts.x_thread.join("\n\n");
    return posts[key as keyof Omit<SocialPosts, "x_thread">] || "";
  };

  return (
    <section className="editorial-narrow my-14">
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/50 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles size={18} /> Social Distribution
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-generated posts for every platform, ready to publish.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 h-10 px-6 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin h-3 w-3 border-2 border-background border-t-transparent rounded-full" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={12} />
                {posts ? "Regenerate" : "Generate Posts"}
              </>
            )}
          </button>
        </div>

        {/* Content */}
        {posts && (
          <div>
            {/* Platform tabs */}
            <div className="flex overflow-x-auto border-b border-border">
              {platformConfig.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActiveTab(p.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === p.key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <p.icon size={14} />
                  {p.label}
                </button>
              ))}
            </div>

            {/* Post preview */}
            <div className="p-5 md:p-6">
              {platformConfig.map((p) => {
                if (activeTab !== p.key) return null;
                const content = getPostContent(p.key);
                return (
                  <div key={p.key}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-semibold text-white ${p.color}`}>
                        <p.icon size={11} />
                        {p.label}
                      </div>
                      <button
                        onClick={() => copyToClipboard(content, p.label)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => {
                        if (!posts) return;
                        if (p.key === "x_thread") {
                          setPosts({ ...posts, x_thread: e.target.value.split("\n\n") });
                        } else {
                          setPosts({ ...posts, [p.key]: e.target.value });
                        }
                      }}
                      rows={8}
                      className="w-full bg-background border border-border rounded-sm p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                    <p className="mt-1 text-xs text-muted-foreground text-right">
                      {content.length} characters
                    </p>
                  </div>
                );
              })}
            </div>

            {/* n8n webhook */}
            <div className="border-t border-border p-5 md:p-6 bg-secondary/30">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Send size={14} /> Send to n8n for Auto-Publishing
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  placeholder="https://your-n8n.app/webhook/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 h-10 px-4 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <button
                  onClick={handleSendToN8n}
                  disabled={isSending || !webhookUrl}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {isSending ? (
                    <>
                      <span className="animate-spin h-3 w-3 border-2 border-background border-t-transparent rounded-full" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={12} /> Send to n8n
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Paste your n8n webhook URL. The workflow will receive all generated posts as a JSON payload.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EditionSocialGenerator;
