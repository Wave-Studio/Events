import { StateUpdater } from "preact/hooks";

// basic switch if we ever need to use it
export const Switch = ({
  setEnabled,
}: {
  setEnabled: StateUpdater<boolean>;
}) => {
  return (
    <div>
      <div></div>
    </div>
  );
};


// drop in component version of switch
export const Toggle = ({
  setEnabled,
  name,
  description,
}: {
  setEnabled: StateUpdater<boolean>;
  name: string;
  description?: string;
}) => {
  return (
    <div class="flex">
      <div>
        <h3>{name}</h3>
        {description}
      </div>
      <Switch setEnabled={setEnabled} />
    </div>
  );
};
