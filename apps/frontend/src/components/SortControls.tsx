'use client';

import { Select } from '@chakra-ui/react';

const petSortOptions = ['asc', 'desc'] as const;

export type PetSortOption = (typeof petSortOptions)[number];

interface SortOption {
  label: string;
  value: PetSortOption;
}

interface Props {
  options: SortOption[];
  sortBy: PetSortOption;
  onChange: (nextSortBy: PetSortOption) => void;
  selected?: boolean;
}

export default function SortControls({
  onChange,
  options,
  sortBy,
  selected = false,
}: Props) {
  return (
    <Select
      placeholder="Sort order"
      value={sortBy}
      name="sortBy"
      aria-label="sort by"
      onChange={e => onChange(e.target.value as PetSortOption)}
    >
      {options.map((option, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <option value={option.value} key={idx} selected={selected}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
