import type { Task } from "../types/task";

export function addTask(tasks: Task[], task: Task): Task[] {
  return [...tasks, task];
}

export function updateTask(tasks: Task[], task: Task): Task[] {
  return tasks.map((t) => (t.id === task.id ? task : t));
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id);
}
