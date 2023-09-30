import { StateUpdater } from "preact/hooks";

// basic switch if we ever need to use it
export const Switch = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: StateUpdater<boolean>;
}) => {
  return (
    <div
      class="rounded-full w-12 min-w-[3rem] border border-gray-300 flex items-center cursor-pointer"
      onClick={() => setEnabled((e) => !e)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key == "Enter") setEnabled((e) => !e);
      }}
    >
      <div
        class={`h-5 w-5 m-0.5 ${
          enabled ? "bg-theme-normal translate-x-[1.425rem]" : "bg-gray-200"
        } transition duration-200 rounded-full`}
      />
    </div>
  );
};

// drop in component version of switch
export const Toggle = ({
  enabled,
  setEnabled,
  name,
  description,
}: {
  enabled: boolean;
  setEnabled: StateUpdater<boolean>;
  name: string;
  description?: string;
}) => {
  return (
    <div class="flex items-center justify-between grow w-full">
      <div class="mr-4">
        <h3 class="text-sm font-medium mb-0.5">{name}</h3>
        <p class="text-xs text-gray-500 max-w-sm">{description}</p>
      </div>
      <Switch setEnabled={setEnabled} enabled={enabled} />
    </div>
  );
};
