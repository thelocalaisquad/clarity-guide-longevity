import { useState } from "react";
import { MessageCircle, Calendar } from "lucide-react";
import ExpertDialog from "@/components/layout/ExpertDialog";

const EditionContactCta = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="editorial-wide my-16">
        <div className="border border-border rounded-sm p-8 md:p-12 text-center space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Have More Questions?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Get clear, practical guidance from our longevity technology experts — whether you're building a home setup or a commercial facility.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 border border-border rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-foreground hover:bg-accent transition-colors"
            >
              <MessageCircle size={18} />
              Chat With Our AI Advisor
            </button>

            <a
              href="https://api.leadconnectorhq.com/widget/bookings/longevity-calendar-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-background hover:bg-foreground/90 transition-colors"
            >
              <Calendar size={18} />
              Schedule a Strategy Call
            </a>
          </div>
        </div>
      </div>

      <ExpertDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default EditionContactCta;
