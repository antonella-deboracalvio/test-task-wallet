type Option = {
  label: string;
  value: string;
};


type SelectConfig = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

type FilterBarProps = {
  selects: SelectConfig[];
  search: string;
  onSearch: (value: string) => void;
};

export default function FilterBar({ selects, search, onSearch }: FilterBarProps) {
  return (
    <div className="flex gap-3 mb-4">
      {/* select input */}
      {selects.map((s, idx: number) => (
        <select
          key={idx}
          className="list-base border rounded-lg px-3 py-2 text-sm"
          value={s.selected}
          onChange={(e) => s.onSelect(e.target.value)}
        >

          {s.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {/* search input */}
      <input
        type="text"
        placeholder="Cerca..."
        className="list-base border rounded-lg px-3 py-2 text-sm flex-1"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
