export function BackgroundShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0">
        {/* Top left geometric pattern */}
        <div className="absolute top-0 left-0 w-96 h-96 opacity-40">
          <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-br from-blue-200/60 to-blue-300/40 rounded-3xl rotate-12 blur-sm" />
          <div className="absolute top-32 left-32 w-24 h-24 bg-gradient-to-br from-indigo-200/50 to-purple-200/30 rounded-2xl -rotate-12 blur-sm" />
        </div>
        
        {/* Top right pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-30">
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-bl from-cyan-200/40 to-blue-200/30 rounded-full blur-xl" />
          <div className="absolute top-40 right-40 w-20 h-20 bg-gradient-to-bl from-blue-300/50 to-indigo-300/30 rounded-full blur-lg" />
        </div>
        
        {/* Bottom left pattern */}
        <div className="absolute bottom-0 left-0 w-72 h-72 opacity-25">
          <div className="absolute bottom-16 left-16 w-36 h-36 bg-gradient-to-tr from-indigo-200/40 to-blue-200/30 rounded-2xl rotate-45 blur-lg" />
        </div>
        
        {/* Bottom right pattern */}
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
          <div className="absolute bottom-12 right-12 w-28 h-28 bg-gradient-to-tl from-purple-200/40 to-blue-200/30 rounded-3xl -rotate-12 blur-lg" />
        </div>
        
        {/* Subtle connecting lines */}
        <div className="absolute top-1/3 left-1/4 w-px h-32 bg-gradient-to-b from-blue-200/30 to-transparent" />
        <div className="absolute top-2/3 right-1/3 w-24 h-px bg-gradient-to-r from-blue-200/30 to-transparent" />
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20" />
    </div>
  );
}