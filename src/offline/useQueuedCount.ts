import { useEffect, useState } from "react";
import { onQueueChange, queuedCount } from "./queue";

export function useQueuedCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    queuedCount().then(setCount);
    return onQueueChange(setCount);
  }, []);

  return count;
}
