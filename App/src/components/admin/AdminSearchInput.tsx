import Image from "next/image";

type AdminSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearchInput({
  value,
  onChange,
  placeholder = "Buscar por nombre o marca...",
}: AdminSearchInputProps) {
  return (
    <div className="relative w-full">
      <Image
        src="/icons/icon-search-admin.svg"
        alt=""
        width={13}
        height={13}
        className="absolute left-3 top-1/2 size-[13px] -translate-y-1/2"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[41px] w-full border border-ink/10 bg-transparent pl-9 pr-4 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
      />
    </div>
  );
}
