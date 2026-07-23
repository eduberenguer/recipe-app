type FilterByNameProps = {
  filter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
};

export default function FilterByName({
  filter,
  onFilterChange,
  className,
}: FilterByNameProps) {
  return (
    <form className="flex flex-row">
      <input
        type="text"
        className={className}
        placeholder="Search by name"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </form>
  );
}
