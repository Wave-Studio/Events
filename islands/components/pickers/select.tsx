// using the built in html one is temp

export default function Select({
  options,
  updateOption,
  className,
  selectClassName
}: {
  options: string[];
  updateOption?: (option: number) => void;
  className?: string;
  selectClassName?: string
}) {
  return (
    <div class={`pl-1.5 pr-1 rounded-md border flex ${className}`}>
      <select
        class={`pr-1 focus:outline-none grow cursor-pointer bg-white font-medium ${selectClassName}`}
        onInput={(e) => updateOption && updateOption(e.currentTarget.selectedIndex)}
      >
        {options.map((option) => (
          <option class="cursor-pointer">{option}</option>
        ))}
      </select>
    </div>
  );
}
