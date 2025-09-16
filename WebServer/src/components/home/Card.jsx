function Card({ title, icon, children, onClick }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 flex flex-col items-center text-zinc-100 shadow-lg shadow-black/30 cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-zinc-800/40 hover:shadow-cyan-500/10"
      onClick={onClick}
    >
      {/* subtle glass highlight */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/[0.02] to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="text-4xl mb-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.15)]">
          {icon}
        </div>
        <h2 className="text-lg font-semibold mb-2 text-zinc-50">{title}</h2>
        <div className="text-sm text-zinc-300">{children}</div>
      </div>
    </div>
  );
}

export default Card;