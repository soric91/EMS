// src/components/StatsCard.jsx
export default function StatsCard({ label, value, color }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 p-4 shadow-md">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
