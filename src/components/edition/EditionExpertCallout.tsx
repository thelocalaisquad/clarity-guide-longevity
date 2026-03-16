interface EditionExpertCalloutProps {
  name: string;
  title: string;
  credential: string;
  photoUrl?: string;
  photoAlt?: string;
}

const EditionExpertCallout = ({ name, title, credential, photoUrl, photoAlt }: EditionExpertCalloutProps) => (
  <aside className="editorial-narrow my-10">
    <div className="border-l-2 border-foreground bg-secondary/50 p-6 md:p-8 flex items-start gap-5">
      {photoUrl && (
        <img
          src={photoUrl}
          alt={photoAlt || `Photo of ${name}`}
          className="w-16 h-16 rounded-full object-cover shrink-0"
        />
      )}
      <div>
        <p className="font-serif text-lg font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-sm italic text-foreground/70">"{credential}"</p>
      </div>
    </div>
  </aside>
);

export default EditionExpertCallout;
