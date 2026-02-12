
export default function WalletPanel({ credits }: { credits: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Wallet</h2>
      <p className="text-slate-500 mb-4">
        Crediti accumulati
      </p>

      <div className="text-3xl font-bold">
        {credits} credits
      </div>
    </div>
  );
}