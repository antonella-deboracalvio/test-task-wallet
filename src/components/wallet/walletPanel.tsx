
export default function WalletPanel({ credits }: { credits: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Wallet</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Crediti accumulati
      </p>

      <div className="text-3xl font-bold">
        {credits} credits
      </div>
    </div>
  );
}