import { Twitter, Linkedin, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EditionBylineProps {
  author: string;
  date: string;
  dateIso?: string;
  readTime: string;
}

const EditionByline = ({ author, date, dateIso, readTime }: EditionBylineProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard" });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="editorial-narrow flex flex-wrap items-center justify-between gap-4 py-5 border-y border-border">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{author}</span>
        <span className="text-border">|</span>
        <time>{date}</time>
        <span className="text-border">|</span>
        <span>{readTime} read</span>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on X"
        >
          <Twitter size={16} />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={16} />
        </a>
        <button
          onClick={handleCopyLink}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy link"
        >
          <Link2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default EditionByline;
