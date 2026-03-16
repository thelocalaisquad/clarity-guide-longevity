interface EditionVideoProps {
  embedUrl: string;
  caption?: string;
}

const EditionVideo = ({ embedUrl, caption }: EditionVideoProps) => (
  <div className="editorial-container py-8">
    <div className="relative w-full overflow-hidden rounded-sm" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embedUrl}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    {caption && (
      <p className="mt-3 text-sm text-muted-foreground text-center italic">{caption}</p>
    )}
  </div>
);

export default EditionVideo;
