"use client";

export function SearchSortSelect({ value }: { value: string }) {
  return (
    <select
      aria-label="Sort properties"
      defaultValue={value}
      name="sort"
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      <option value="newest">Newest first</option>
      <option value="price_asc">Price: low to high</option>
      <option value="price_desc">Price: high to low</option>
      <option value="relevance">Relevance</option>
    </select>
  );
}
