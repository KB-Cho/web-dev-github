import type { PolicySection } from "@/lib/mockData";

type DocumentSectionProps = {
  section: PolicySection;
};

export function DocumentSection({ section }: DocumentSectionProps) {
  return (
    <section className="border-b border-slate-200 px-8 py-7 last:border-b-0">
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{section.title}</h2>
      <p className="mt-4 leading-8 text-slate-700">{section.body}</p>
      <ul className="mt-5 space-y-3">
        {section.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-6 text-slate-600">
            <span className="mt-2 h-2 w-2 rounded-full bg-teal-500" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
