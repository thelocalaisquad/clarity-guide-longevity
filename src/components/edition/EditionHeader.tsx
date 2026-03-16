interface EditionHeaderProps {
  editionNumber: string;
  date: string;
  category: string;
}

const EditionHeader = ({ editionNumber, date, category }: EditionHeaderProps) => (
  <div className="editorial-narrow pt-10 pb-2">
    <p className="editorial-label text-center">
      Edition #{editionNumber} · {date} · {category}
    </p>
  </div>
);

export default EditionHeader;
