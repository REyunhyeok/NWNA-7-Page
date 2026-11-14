const map: Record<string, { label: string; color: string }> = {
  pdf: { label: "PDF", color: "bg-red-100 text-red-700" },
  doc: { label: "DOC", color: "bg-blue-100 text-blue-700" },
  docx: { label: "DOC", color: "bg-blue-100 text-blue-700" },
  hwp: { label: "HWP", color: "bg-sky-100 text-sky-700" },
  ppt: { label: "PPT", color: "bg-orange-100 text-orange-700" },
  pptx: { label: "PPT", color: "bg-orange-100 text-orange-700" },
  xls: { label: "XLS", color: "bg-green-100 text-green-700" },
  xlsx: { label: "XLS", color: "bg-green-100 text-green-700" },
  csv: { label: "CSV", color: "bg-green-100 text-green-700" },
  png: { label: "IMG", color: "bg-purple-100 text-purple-700" },
  jpg: { label: "IMG", color: "bg-purple-100 text-purple-700" },
  jpeg: { label: "IMG", color: "bg-purple-100 text-purple-700" },
  zip: { label: "ZIP", color: "bg-amber-100 text-amber-700" },
  md: { label: "MD", color: "bg-zinc-200 text-zinc-700" },
};

export default function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const m = map[ext] ?? { label: ext.slice(0, 3).toUpperCase() || "FILE", color: "bg-zinc-100 text-zinc-600" };
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md font-mono text-[10px] font-semibold ${m.color}`}>
      {m.label}
    </span>
  );
}
