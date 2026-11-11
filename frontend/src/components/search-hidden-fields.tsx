export function SearchHiddenFields({
  params,
  omit,
}: {
  params: URLSearchParams;
  omit: string[];
}) {
  const excluded = new Set(["page", ...omit]);
  return Array.from(params.entries())
    .filter(([name]) => !excluded.has(name))
    .map(([name, value], index) => (
      <input key={`${name}-${index}`} name={name} type="hidden" value={value} />
    ));
}
