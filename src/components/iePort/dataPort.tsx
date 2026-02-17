type DataPortProps = {
  buildExportPayload: () => unknown;
  onImportPayload: (payload: unknown) => void;
  disabled?: boolean;
};

function downloadJson(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export default function DataPort({
  buildExportPayload,
  onImportPayload,
  disabled,
}: DataPortProps) {
  return (
    <div className="mt-4 mb-4 flex flex-wrap gap-2">
      <button
        className="btn-base text-sm px-3 py-2 rounded-lg border hover:bg-slate-50 disabled:opacity-50"
        disabled={disabled}
        onClick={() => {
          const payload = buildExportPayload();
          const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
          downloadJson(`gnous-backup-${ts}.json`, payload);
        }}
      >
        Export JSON
      </button>

      <label
        className={` btn-base text-sm px-3 py-2 rounded-lg border hover:bg-slate-50 cursor-pointer ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        Import JSON
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const text = await file.text();
              const payload = JSON.parse(text);
              onImportPayload(payload);
            } catch {
              onImportPayload({ __error: "INVALID_JSON" });
            } finally {
              e.currentTarget.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}
