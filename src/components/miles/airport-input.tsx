'use client';

import { useId, useState } from 'react';

import { Input } from '@/components/ui/input';
import { suggestCities } from '@/lib/miles/radar';
import { cn } from '@/lib/utils';

interface AirportInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Chamado quando a pessoa escolhe uma opção da lista. */
  onPick?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Campo de cidade ou aeroporto com lista de sugestões (o campo nativo falha em alguns celulares). */
export const AirportInput = ({
  id,
  value,
  onChange,
  onPick,
  placeholder,
  className,
}: AirportInputProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const options = open && !/\([A-Z]{3}\)$/.test(value) ? suggestCities(value) : [];

  const pick = (city: string) => {
    onChange(city);
    setOpen(false);
    setActive(-1);
    onPick?.(city);
  };

  return (
    <div className={cn('relative', className)}>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={options.length > 0}
        aria-controls={listId}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
          }, 150);
        }}
        onKeyDown={(event) => {
          if (options.length === 0) {
            return;
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            setActive((current) => (current + step + options.length) % options.length);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            pick(options[active >= 0 ? active : 0]);
          } else if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {open && value.trim() !== '' && !/\([A-Z]{3}\)$/.test(value) && (
        <ul
          id={listId}
          role="listbox"
          className="surface bg-popover absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-lg border p-1 shadow-lg"
        >
          {options.length === 0 ? (
            <li className="text-muted-foreground px-3 py-2 text-sm">
              Nenhum aeroporto encontrado. Digite a cidade ou o código, como POA.
            </li>
          ) : (
            options.map((city, index) => (
              <li
                key={city}
                role="option"
                aria-selected={index === active}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-2 text-sm',
                  index === active && 'bg-accent',
                )}
                onPointerDown={(event) => {
                  event.preventDefault();
                  pick(city);
                }}
              >
                {city}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
