"use client";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const FilterCheckbox = ({ label, checked, onChange }: FilterCheckboxProps) => {
  return (
    <label
      className={`group flex w-full items-start gap-2 cursor-pointer select-none transition-colors ${
        checked
          ? "font-medium text-slate-900"
          : "font-normal text-slate-600 hover:text-slate-900"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded border border-slate-300 bg-white checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      />

      <span
        title={label}
        className="min-w-0 flex-1 text-[14px] leading-5 tracking-normal line-clamp-2"
      >
        {label}
      </span>
    </label>
  );
};

export default FilterCheckbox;
