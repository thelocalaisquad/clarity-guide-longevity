interface EditionStructuredSectionsProps {
  whatIsIt?: string | null;
  howItWorks?: string | null;
  whyDifferent?: string | null;
  whoIsItFor?: string | null;
}

const sections = [
  { key: "whatIsIt" as const, title: "What Is It?" },
  { key: "howItWorks" as const, title: "How It Works" },
  { key: "whyDifferent" as const, title: "Why Is It Different?" },
  { key: "whoIsItFor" as const, title: "Who Is It For?" },
] as const;

const EditionStructuredSections = ({
  whatIsIt,
  howItWorks,
  whyDifferent,
  whoIsItFor,
}: EditionStructuredSectionsProps) => {
  const values = { whatIsIt, howItWorks, whyDifferent, whoIsItFor };
  const hasAny = sections.some((s) => values[s.key]);

  if (!hasAny) return null;

  return (
    <div className="editorial-narrow space-y-12 py-8">
      {sections.map(({ key, title }) => {
        const html = values[key];
        if (!html) return null;
        return (
          <section key={key}>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
              {title}
            </h2>
            <div
              className="editorial-prose prose prose-headings:font-serif prose-headings:text-foreground max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>
        );
      })}
    </div>
  );
};

export default EditionStructuredSections;
