import { useState } from "react";

type Status = "TODO" | "DOING" | "DONE";
type Priority = "LOW" | "MED" | "HIGH";

type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: number;
};

const getAddTask = (tasks: Task[], task: Task) => {
  return [...tasks, task];
};

const getUpdateTask = (tasks: Task[], task: Task) => {
  return tasks.map((t) => {
    if (t.id === task.id) {
      return task;
    }
    return t;
  });
};

const getDeleteTask = (tasks: Task[], id: string) => {
  return tasks.filter((t) => t.id !== id);
};



export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
      <div className="flex flex-col min-h-screen">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Task
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
            Tasks
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50">
            Wallet
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-slate-50">
            Audit Log
          </button>
        </div>

      
          <button className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black mb-4"
          onClick={getAddTask (tasks, { id: crypto.randomUUID(), title: "", description: "", status: "TODO", priority: "LOW", createdAt: Date.now() })}>
            + New Task

          </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        <span className="text-sm text-slate-500">
              {tasks.length} task
            </span>
        </div>

          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border rounded-xl p-4 hover:bg-slate-50 transition"
              >

                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {task.description}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                        {task.status}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm px-3 py-2 rounded-lg border hover:bg-white"
                    onClick={getUpdateTask (tasks, task)}>
                      Edit
                    </button>
                    <button className="text-sm px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                    onClick={getDeleteTask(tasks, task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

      </main>
    </div>
  );
}

