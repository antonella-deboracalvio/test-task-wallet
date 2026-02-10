export default function App() {
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

      
          <button className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black mb-4">
            + New Task
          </button>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
          <p className="text-slate-500">
          lista task, form e filtri.
          </p>
        </div>

      </main>
    </div>
  );
}

