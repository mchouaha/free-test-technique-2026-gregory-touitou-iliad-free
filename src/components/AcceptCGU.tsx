type AcceptCGUProps = {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export default function AcceptCGU({ label, checked = false, onCheckedChange }: AcceptCGUProps) {
  return (
    <label className="cgu-label">
      <input className="cgu-checkbox" type="checkbox" checked={checked} onChange={e => onCheckedChange?.(e.target.checked)} />
      {label}
    </label>
  );
}
