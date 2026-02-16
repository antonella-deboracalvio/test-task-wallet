import type { Status } from "../types/task";

/** prtare un task in done premia +2 crediti , da non done a done */
export function getDoneRewardDelta(prevStatus: Status, nextStatus: Status): number {
  if (prevStatus !== "DONE" && nextStatus === "DONE") return 2;
  return 0;
}
