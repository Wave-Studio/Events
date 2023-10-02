import { useState } from "preact/hooks";

export function TestIsland() {
	const [count, setCount] = useState<string>("");

	return <>
		<p>Count: {count}</p>
		<input type="text" value={count} onInput={(e) => setCount(e.currentTarget.value)}/>
	</>
}