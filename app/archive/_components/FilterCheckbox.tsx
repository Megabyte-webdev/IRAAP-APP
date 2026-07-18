"use client";

interface FilterCheckboxProps {
  label: string | number;
  checked: boolean;
  onChange: () => void;
}

const FilterCheckbox = ({ label, checked, onChange }: FilterCheckboxProps) => {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none text-sm transition-colors ${
        checked ? "font-medium text-black" : "font-normal text-slate-500"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded-sm border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
      />

      {label}
    </label>
  );
};

export default FilterCheckbox;
