import { useEffect, useState } from "react";
import AuditPanel from "./components/audit/auditPanel";
import FilterBar from "./components/filter/filterBar";
import WalletPanel from "./components/wallet/walletPanel";
import type { AuditEvent, AuditEventType } from "./types/audit";
import type { Priority, Status, Task } from "./types/task";
import { loadAudit, loadCredits, loadTasks, loadWelcomeSeen, saveAudit, saveCredits, saveTasks, saveWelcomeSeen } from "./utils/storage";






// crud
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


// ui
type Tab = "tasks" | "wallet" | "audit";



export default function App() {
  // task
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = loadTasks();
    if (saved.length > 0) return saved;
    return [];
  });



  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  // wallet
  const [activeTab, setActiveTab] = useState<Tab>("tasks");


  const INITIAL_CREDITS = 100;
  const [credits, setCredits] = useState<number>(() => loadCredits(INITIAL_CREDITS));
  const [showWelcomeCredits, setShowWelcomeCredits] = useState<boolean>(() => !loadWelcomeSeen());


  // wallet credit
  const addCredits = (delta: number) => {
    setCredits((prev) => Math.max(0, prev + delta));
  };

  const trySpend = (cost: number) => {
    if (credits - cost < 0) return false;
    addCredits(-cost);
    return true;
  };

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => loadAudit());


  // error generico
  const [uiError, setUiError] = useState<string | null>(null);
  // errore input
  const [fieldErrors, setFieldErrors] = useState<Record<string, { title?: string }>>({});

  // draft
  type TaskDraft = {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
  };

  const [drafts, setDrafts] = useState<Record<string, TaskDraft>>({});


type StatusFilter = Status | "ALL";
type PriorityFilter = Priority | "ALL";

const [taskStatusFilter, setTaskStatusFilter] = useState<StatusFilter>("ALL");
const [taskPriorityFilter, setTaskPriorityFilter] = useState<PriorityFilter>("ALL");
const [taskSearch, setTaskSearch] = useState("");






  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // credits
  useEffect(() => {
    saveCredits(credits);
  }, [credits]);


  useEffect(() => {
    saveAudit(auditEvents);
  }, [auditEvents]);

  const pushAudit = (
    type: AuditEventType,
    payload: Record<string, unknown>
  ) => {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      payload,
    };

    setAuditEvents((prev) => [event, ...prev]);
  };



  const q = taskSearch.trim().toLowerCase();

const filteredTasks = tasks.filter((t) => {
  const matchStatus = taskStatusFilter === "ALL" ? true : t.status === taskStatusFilter;
  const matchPriority = taskPriorityFilter === "ALL" ? true : t.priority === taskPriorityFilter;

  const haystack = `${t.title} ${t.description}`.toLowerCase();
  const matchText = q === "" ? true : haystack.includes(q);

  return matchStatus && matchPriority && matchText;
});



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

        {/* popup */}
        {showWelcomeCredits && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <h3 className="text-lg font-semibold">Benvenut*!</h3>
              <p className="mt-2 text-slate-600">
                Hai ricevuto <span className="font-semibold">{INITIAL_CREDITS}</span> crediti gratuiti per iniziare.
              </p>

              <div className="mt-5 flex justify-center">

                <div className="mt-6 space-y-3 text-sm">

                  <div className="flex justify-between items-center rounded-lg bg-slate-50 px-3 py-2">
                    <span>Completi un task (DONE)</span>
                    <span className="font-semibold text-green-600">+2 crediti</span>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-slate-50 px-3 py-2">
                    <span>Crei un nuovo task</span>
                    <span className="font-semibold text-red-600">-1 credito</span>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-slate-50 px-3 py-2">
                    <span>Elimini un task non completato</span>
                    <span className="font-semibold text-green-600">+1 credito</span>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-slate-600">
                    Il saldo non può andare sotto <span className="font-semibold">0</span>
                  </div>

                  <button
                    className="mt-8 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black transition"
                    onClick={() => {
                      setShowWelcomeCredits(false);
                      saveWelcomeSeen();
                    }}
                  >
                    Ok, iniziamo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className="text-sm px-3 py-2 rounded-lg border"
          onClick={() => setAuditEvents([])}
        >
          Clear audit
        </button>

        {/* task */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg border ${activeTab === "tasks"
              ? "bg-blue-600 text-white shadow border-blue-600"
              : "bg-white hover:bg-slate-50"
              }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>


          {/* wallet */}
          <button
            className={`px-4 py-2 rounded-lg border ${activeTab === "wallet"
              ? "bg-blue-600 text-white shadow border-blue-600"
              : "bg-white hover:bg-slate-50"
              }`}
            onClick={() => setActiveTab("wallet")}
          >
            Wallet
          </button>


          {/* audit */}
          <button
            className={`px-4 py-2 rounded-lg border ${activeTab === "audit"
              ? "bg-blue-600 text-white shadow border-blue-600"
              : "bg-white hover:bg-slate-50"
              }`}
            onClick={() => setActiveTab("audit")}
          >
            Audit log
          </button>
        </div>

        {/* new task */}

        {activeTab === "tasks" && (
          <>
            <button
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black mb-4"
              onClick={() => {
                // 1 credito creazione o blocco
                const ok = trySpend(1);
                if (!ok) {
                  setUiError("Crediti insufficienti: creare un task costa 1 credito.");
                  return;
                }

                pushAudit("WALLET_DEBIT", {
                  delta: -1,
                  reason: "TASK_CREATE_COST",
                });


                const newTask: Task = {
                  id: crypto.randomUUID(),
                  title: "",
                  description: "",
                  status: "TODO",
                  priority: "LOW",
                };

                pushAudit("TASK_CREATED", {
                  taskId: newTask.id,
                  title: newTask.title,
                  description: newTask.description,
                  status: newTask.status
                });

                setTasks((prev) => getAddTask(prev, newTask));
                setEditTaskId(newTask.id);

                // set draft
                setDrafts((prev) => ({
                  ...prev,
                  [newTask.id]: {
                    title: "",
                    description: "",
                    status: "TODO",
                    priority: "LOW",
                  },
                }));
                setFieldErrors((prev) => ({ ...prev, [newTask.id]: {} }));

              }}

            >

              + New Task
            </button>

            {uiError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {uiError}
              </div>
            )}


            <FilterBar
  selects={[
    {
      options: [
        { label: "Tutti gli stati", value: "ALL" },
        { label: "TODO", value: "TODO" },
        { label: "DOING", value: "DOING" },
        { label: "DONE", value: "DONE" },
      ],
      selected: taskStatusFilter,
      onSelect: (v) => setTaskStatusFilter(v as StatusFilter),
    },
    {
      options: [
        { label: "Tutte le priorità", value: "ALL" },
        { label: "LOW", value: "LOW" },
        { label: "MED", value: "MED" },
        { label: "HIGH", value: "HIGH" },
      ],
      selected: taskPriorityFilter,
      onSelect: (v) => setTaskPriorityFilter(v as PriorityFilter),
    },
  ]}
  search={taskSearch}
  onSearch={setTaskSearch}
/>

<div className="mb-3 flex items-center justify-between">
  <span className="text-sm text-slate-500">
    Mostrati {filteredTasks.length} / {tasks.length}
  </span>

  <button
    className="text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
    onClick={() => {
      setTaskSearch("");
      setTaskStatusFilter("ALL");
      setTaskPriorityFilter("ALL");
    }}
  >
    Reset filtri
  </button>
</div>







            {/* list task */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Tasks</h2>
              <span className="text-sm text-slate-500">
                {tasks.length} task
              </span>
            </div>


            <ul className="space-y-3">
              {filteredTasks.map((task) => {
                const isEditing = editTaskId === task.id;
                const draft = drafts[task.id];
                const view = isEditing && draft ? draft : task;

                return (
                  <li
                    key={task.id}
                    className="border rounded-xl p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>

                        {editTaskId === task.id ? (
                          <>
                            <input
                              className="border p-1 rounded w-full"
                              value={view.title}
                              onChange={(e) => {
                                const v = e.target.value;

                                setDrafts((prev) => ({
                                  ...prev,
                                  [task.id]: { ...prev[task.id], title: v },
                                }));

                                // pulizia errore se scrivi qualcosa
                                if (v.trim()) {
                                  setFieldErrors((prev) => ({
                                    ...prev,
                                    [task.id]: { ...prev[task.id], title: undefined },
                                  }));
                                }
                              }}
                              placeholder="Inserisci un titolo..."
                            />

                            {/* errore campo */}
                            {fieldErrors[task.id]?.title && (
                              <p className="mt-1 text-sm text-red-600">{fieldErrors[task.id]!.title}</p>
                            )}

                            <textarea
                              className="border p-1 rounded w-full mt-1"
                              value={view.description}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDrafts((prev) => ({
                                  ...prev,
                                  [task.id]: { ...prev[task.id], description: v },
                                }));
                              }}
                              placeholder="Inserisci una descrizione..."
                            />

                            {/* credit a Done */}
                            <div className="mt-2 flex gap-2">
                              <select className="text-xs px-2 py-1 rounded-full bg-slate-100"
                                value={view.status}
                                onChange={(e) => {
                                  const nextStatus = e.target.value as Status;

                                  const title = (drafts[task.id]?.title ?? "").trim();
                                  if (title === "" && nextStatus !== "TODO") {
                                    setFieldErrors((prev) => ({
                                      ...prev,
                                      [task.id]: { ...prev[task.id], title: "Il titolo è obbligatorio" },
                                    }));
                                    return; // blocco doing e done se titolo vuoto
                                  }

                                  setDrafts((prev) => ({
                                    ...prev,
                                    [task.id]: { ...prev[task.id], status: nextStatus },
                                  }));
                                }}
                              >

                                <option value="TODO">TODO</option>
                                <option value="DOING">DOING</option>
                                <option value="DONE"> DONE</option>

                              </select>

                              <select className="text-xs px-2 py-1 rounded-full bg-slate-100"
                                value={view.priority}
                                onChange={(e) => {
                                  const nextPriority = e.target.value as Priority;
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [task.id]: { ...prev[task.id], priority: nextPriority },
                                  }));
                                }}
                              >
                                <option value="LOW">LOW</option>
                                <option value="MED">MED</option>
                                <option value="HIGH">HIGH</option>
                              </select>
                            </div>
                          </>

                        ) : (

                          <>


                            <h2 className="text-lg font-semibold">{task.title}</h2>
                            <p className="text-sm text-slate-500">{task.description}</p>
                            <div className="mt-2 flex gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                                {task.status}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                                {task.priority}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {editTaskId === task.id ? (
                          <button className="text-sm px-3 py-2 rounded-lg border hover:bg-white"

                            onClick={() => {
                              const d = drafts[task.id];
                              if (!d) return;

                              if (!d.title.trim()) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  [task.id]: { ...prev[task.id], title: "Il titolo è obbligatorio" },
                                }));
                                return;
                              }

                              const prevTask = task;
                              const nextTask: Task = {
                                ...prevTask,
                                title: d.title,
                                description: d.description,
                                status: d.status,
                                priority: d.priority,
                              };

                              pushAudit("TASK_UPDATED", {
                                taskId: nextTask.id,
                                title: nextTask.title,
                                description: nextTask.description,
                                status: nextTask.status,
                                priority: nextTask.priority,
                              });

                              if (prevTask.status !== nextTask.status) {
                                pushAudit("TASK_STATUS_CHANGED", {
                                  taskId: nextTask.id,
                                  from: prevTask.status,
                                  to: nextTask.status,
                                  title: nextTask.title,
                                  description: nextTask.description,
                                });

                                if (prevTask.status !== "DONE" && nextTask.status === "DONE") {
                                  addCredits(2);
                                  pushAudit("WALLET_CREDIT", {
                                    delta: +2,
                                    reason: "TASK_DONE_REWARD",
                                    taskId: nextTask.id,
                                    title: nextTask.title,
                                    description: nextTask.description,
                                  });
                                }
                              }

                              setTasks((prev) => getUpdateTask(prev, nextTask));

                              setEditTaskId(null);
                              setDrafts((prev) => {
                                const copy = { ...prev };
                                delete copy[task.id];
                                return copy;
                              });
                              setFieldErrors((prev) => ({ ...prev, [task.id]: {} }));
                            }}

                          >
                            Save

                          </button>
                        ) : (

                          <button
                            className="text-sm px-3 py-2 rounded-lg border hover:bg-white"
                            onClick={() => {
                              // setUiError(null);
                              setEditTaskId(task.id);

                              setDrafts((prev) => ({
                                ...prev,
                                [task.id]: {
                                  title: task.title ?? "",
                                  description: task.description ?? "",
                                  status: task.status,
                                  priority: task.priority,
                                },
                              }));

                              setFieldErrors((prev) => ({ ...prev, [task.id]: {} }));
                            }}
                          >
                            Edit
                          </button>

                        )}



                        <button className="text-sm px-3 py-2 rounded-lg border hover:bg-white"
                          onClick={() => {
                            setTasks(getDeleteTask(tasks, task.id));
                            pushAudit("TASK_DELETED", { taskId: task.id });

                            if (task.status !== "DONE") {
                              // task: non DONE
                              pushAudit("WALLET_CREDIT", {
                                delta: +1,
                                reason: "TASK_DELETE_REFUND",
                                taskId: task.id,
                                title: task.title,
                                description: task.description
                              });
                            }

                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </li>
                );
              })}

            </ul>
          </>
        )}

        {/* WALLET TAB */}
        {activeTab === "wallet" && <WalletPanel credits={credits} />}

        {/* AUDIT TAB */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Audit</h2>
            {activeTab === "audit" && <AuditPanel events={auditEvents} />}
          </div>
        )}
      </main>

    </div >
  );
}

