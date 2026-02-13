type Option = {
  label: string;
  value: string;
};

type FilterBarProps = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  search: string;
  onSearch: (value: string) => void;
};

export default function FilterBar({
  options,
  selected,
  onSelect,
  search,
  onSearch,
}: FilterBarProps) {
  return (
    <div className="flex gap-3 mb-4">
      {/* select input */}
      <select
        className="border rounded-lg px-3 py-2 text-sm"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* search input */}
      <input
        type="text"
        placeholder="Cerca..."
        className="border rounded-lg px-3 py-2 text-sm flex-1"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
