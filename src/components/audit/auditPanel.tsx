import type { AuditEvent } from "../../types/audit";
import { AuditLabels } from "../../types/audit";

function formatTs(ts: number) {
    return new Intl.DateTimeFormat("it-IT", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(ts));
}

function getPayloadText(payload: Record<string, unknown>, key: string): string {
    const value = payload[key];
    return typeof value === "string" ? value : "";
}

export default function AuditPanel({ events }: { events: AuditEvent[] }) {
    return (
        
        <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500 mb-4">
                {events.length} eventi registrati
            </p>
            {events.length === 0 ? (
                <div className="text-sm text-slate-500">
                    Nessun evento ancora.
                </div>
            ) : (
                <ul className="space-y-3">
                    {events.map((event) => (
                        <li
                            key={event.id}
                            className="border rounded-xl p-4 hover:bg-slate-50 transition"
                        >

                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold">{AuditLabels[event.type]}</h2>

                                    <p className="text-sm font-medium">
                                        {getPayloadText(event.payload, "title")}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {getPayloadText(event.payload, "description")}
                                    </p>

                                    <p className="text-sm text-slate-500">{formatTs(event.timestamp)}</p>


                                </div>
                            </div>


                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    );
}
