interface SectionHeaderProps {
  title: string;
  right?: React.ReactNode;
}

const SectionHeader = ({ title, right }: SectionHeaderProps) => (
  <div className="flex items-center justify-between pb-2 border-b border-border mb-0">
    <h2 className="section-title">{title}</h2>
    {right && <div className="flex items-center gap-3">{right}</div>}
  </div>
);

export default SectionHeader;
