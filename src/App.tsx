import { useEffect, useState } from "react";
import AuditPanel from "./components/audit/auditPanel";
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

  // error credit
  const [walletError, setWalletError] = useState<string | null>(null);


  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => loadAudit());





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
                  setWalletError("Crediti insufficienti: creare un task costa 1 credito.");
                  return;
                }

                const newTask: Task = {
                  id: crypto.randomUUID(),
                  title: "",
                  description: "",
                  status: "TODO",
                  priority: "LOW",
                };

                pushAudit("TASK_CREATED", {
                  taskId: newTask.id,
                });
                
                setTasks((prev) => getAddTask(prev, newTask));
                setEditTaskId(newTask.id);
              }}

            >

              + New Task
            </button>

            {walletError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {walletError}
              </div>


            )}



            {/* list task */}
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

                      {editTaskId === task.id ? (
                        <>
                          <input
                            className="border p-1 rounded w-full"
                            value={task.title}
                            onChange={(e) =>
                              setTasks(getUpdateTask(tasks, { ...task, title: e.target.value }))
                            }
                            placeholder="Inserisci un titolo..."
                          />

                          <textarea
                            className="border p-1 rounded w-full mt-1"
                            value={task.description}
                            onChange={(e) =>
                              setTasks(getUpdateTask(tasks, { ...task, description: e.target.value }))
                            }
                            placeholder="Inserisci una descrizione..."
                          />

                          {/* credit a Done */}
                          <div className="mt-2 flex gap-2">
                            <select className="text-xs px-2 py-1 rounded-full bg-slate-100"
                              value={task.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as Status;

                                // passaggio a DONE
                                if (task.status !== "DONE" && nextStatus === "DONE") {
                                  addCredits(2);
                                }

                                setTasks(getUpdateTask(tasks, { ...task, status: nextStatus }));
                              }}

                            >

                              <option value="TODO">TODO</option>
                              <option value="DOING"
                              >DOING</option>
                              <option value="DONE" >
                                DONE
                              </option>

                            </select>

                            <select className="text-xs px-2 py-1 rounded-full bg-slate-100"
                              value={task.priority}
                              onChange={(e) =>
                                setTasks(getUpdateTask(tasks, { ...task, priority: e.target.value as Priority }))
                              }
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
                          onClick={() => setEditTaskId(null)}>
                          Save
                        </button>
                      ) : (

                        <button className="text-sm px-3 py-2 rounded-lg border hover:bg-white"
                          onClick={() => setEditTaskId(task.id)}>
                          Edit
                        </button>
                      )}
                      <button className="text-sm px-3 py-2 rounded-lg border hover:bg-white"
                        onClick={() => {
                          setTasks(getDeleteTask(tasks, task.id));
                          if (task.status !== "DONE") {
                            addCredits(1);
                          }

                        }}>
                        Delete
                      </button>
                    </div>
                  </div>

                </li>
              ))}

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

