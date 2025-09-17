// src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const styles = {
    Connected: "bg-green-900 text-green-200",
    Warning: "bg-yellow-900 text-yellow-200",
    Disconnected: "bg-red-900 text-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
