import { useState } from "react";
import type { Priority, Status, Task } from "../types/task";

export type StatusFilter = Status | "ALL";
export type PriorityFilter = Priority | "ALL";

export function useTaskFilters(tasks: Task[]) {
  const [taskStatusFilter, setTaskStatusFilter] = useState<StatusFilter>("ALL");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<PriorityFilter>("ALL");
  const [taskSearch, setTaskSearch] = useState("");

  const q = taskSearch.trim().toLowerCase();

  const filteredTasks = tasks.filter((t) => {
    const matchStatus = taskStatusFilter === "ALL" ? true : t.status === taskStatusFilter;
    const matchPriority = taskPriorityFilter === "ALL" ? true : t.priority === taskPriorityFilter;

    const haystack = `${t.title} ${t.description}`.toLowerCase();
    const matchText = q === "" ? true : haystack.includes(q);

    return matchStatus && matchPriority && matchText;
  });

  const resetFilters = () => {
    setTaskSearch("");
    setTaskStatusFilter("ALL");
    setTaskPriorityFilter("ALL");
  };

  return {
    taskStatusFilter,
    setTaskStatusFilter,
    taskPriorityFilter,
    setTaskPriorityFilter,
    taskSearch,
    setTaskSearch,
    filteredTasks,
    resetFilters,
  };
}
