import { useEffect, useState } from "react";
import AuditPanel from "./components/audit/auditPanel";
import FilterBar from "./components/filter/filterBar";
import DataPort from "./components/iePort/dataPort";
import WalletPanel from "./components/wallet/walletPanel";
import { useAudit } from "./hooks/useAudit";
import type { PriorityFilter, StatusFilter } from "./hooks/useTaskFilter";
import { useTaskFilters } from "./hooks/useTaskFilter";
import type { Priority, Status, Task } from "./types/task";
import { loadCredits, loadTasks, loadWelcomeSeen, saveCredits, saveTasks, saveWelcomeSeen } from "./utils/storage";
import { addTask, deleteTask, updateTask } from "./utils/taskCrud";
import { isExportPayloadV1 } from "./utils/validators";
import { getDoneRewardDelta } from "./utils/walletRules";




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


  
const { auditEvents, setAuditEvents, pushAudit, clearAudit } = useAudit();


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


  const {
  taskStatusFilter,
  setTaskStatusFilter,
  taskPriorityFilter,
  setTaskPriorityFilter,
  taskSearch,
  setTaskSearch,
  filteredTasks,
  resetFilters
} = useTaskFilters(tasks);




  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // credits
  useEffect(() => {
    saveCredits(credits);
  }, [credits]);


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

                setTasks((prev) => addTask(prev, newTask));
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


            {/* import/export */}

            <DataPort
              buildExportPayload={() => ({
                version: 1,
                exportedAt: Date.now(),
                tasks,
                credits,
                auditEvents,


                welcomeSeen: !showWelcomeCredits,
              })}
              onImportPayload={(payload: unknown) => {
                // errore JSON non valido
                if (typeof payload === "object" && payload !== null && "__error" in payload) {
                  setUiError("Import fallito: JSON non valido.");
                  return;
                }

                // validazione struttura
                if (!isExportPayloadV1(payload)) {
                  setUiError("Import fallito: formato file non valido.");
                  return;
                }

                // applica import
                setTasks(payload.tasks);
                setCredits(payload.credits);
                setAuditEvents(payload.auditEvents ?? []);

                // reset
                setEditTaskId(null);
                setDrafts({});
                setFieldErrors({});
                setUiError(null);
              }}

            />




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
                onClick={resetFilters}
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

                                const delta = getDoneRewardDelta(prevTask.status, nextTask.status);

                                if (prevTask.status !== "DONE" && nextTask.status === "DONE") {
                                  addCredits(delta);
                                  pushAudit("WALLET_CREDIT", {
                                    delta,
                                    reason: "TASK_DONE_REWARD",
                                    taskId: nextTask.id,
                                    title: nextTask.title,
                                    description: nextTask.description,
                                  });
                                }
                              }

                              setTasks((prev) => updateTask(prev, nextTask));

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
                            setTasks(deleteTask(tasks, task.id));
                            pushAudit("TASK_DELETED", { taskId: task.id });

                            if (task.status !== "DONE") {
                              addCredits(1);
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

             <button
          className="text-sm px-3 py-2 rounded-lg border"
           onClick={clearAudit}
        >
          Clear audit
        </button>

            {activeTab === "audit" && <AuditPanel events={auditEvents} />}
          </div>
        )}
      </main>

    </div >
  );
}

