export type Status = "TODO" | "DOING" | "DONE";
export type Priority = "LOW" | "MED" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
};