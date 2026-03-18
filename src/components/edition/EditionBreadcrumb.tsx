import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface EditionBreadcrumbProps {
  editionNumber: string;
  title: string;
}

const EditionBreadcrumb = ({ editionNumber, title }: EditionBreadcrumbProps) => (
  <nav aria-label="Breadcrumb" className="editorial-narrow pt-6 pb-2">
    <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <li>
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
      </li>
      <li aria-hidden="true"><ChevronRight size={12} /></li>
      <li>
        <span className="hover:text-foreground transition-colors">Editions</span>
      </li>
      <li aria-hidden="true"><ChevronRight size={12} /></li>
      <li aria-current="page" className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
        #{editionNumber}
      </li>
    </ol>
  </nav>
);

export default EditionBreadcrumb;
