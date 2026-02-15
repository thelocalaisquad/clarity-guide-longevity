import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircle, Calendar } from "lucide-react";

interface ExpertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpertDialog = ({ open, onOpenChange }: ExpertDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg p-8">
      <DialogHeader>
        <DialogTitle className="font-serif text-2xl font-semibold text-foreground">
          Speak to a Longevity Technology Expert
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-muted-foreground pt-1">
          Not sure which technology is right for your home or business? Get
          clear, practical guidance — without the guesswork.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">Whether you're:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Building a longevity-focused home</li>
          <li>Adding recovery or biohacking tech to your gym or clinic</li>
          <li>Exploring a new wellness business model</li>
          <li>Comparing high-ticket hardware investments</li>
        </ul>

        <p className="font-semibold text-foreground pt-2">
          Our team can help you understand:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>What actually works</li>
          <li>What fits your goals and space</li>
          <li>What delivers measurable outcomes</li>
          <li>What makes commercial sense</li>
        </ul>

        <p className="pt-2">
          You can start instantly with our AI advisor or book a call with a
          specialist.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* AI Advisor */}
        <div className="flex flex-col items-center text-center rounded-sm border border-border p-5 hover:bg-accent transition-colors cursor-pointer">
          <MessageCircle size={24} className="text-foreground mb-3" />
          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground">
            Chat With Our AI Advisor
          </span>
          <span className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Get instant answers, product guidance, and recommendations.
          </span>
        </div>

        {/* Strategy Call */}
        <a
          href="https://api.leadconnectorhq.com/widget/bookings/longevity-calendar-1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-center rounded-sm bg-foreground p-5 hover:bg-foreground/90 transition-colors"
        >
          <Calendar size={24} className="text-background mb-3" />
          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-background">
            Schedule a Strategy Call
          </span>
          <span className="mt-2 text-xs text-background/70 leading-relaxed">
            Speak directly with a longevity technology specialist.
          </span>
        </a>
      </div>
    </DialogContent>
  </Dialog>
);

export default ExpertDialog;
