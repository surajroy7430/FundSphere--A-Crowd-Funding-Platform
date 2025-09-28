export const StatsCard = ({ title, icon, value, helperText }) => {
  return (
    <div
      className="group relative p-4 lg:p-5 before:absolute before:inset-y-8 
        before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 
        before:via-input before:to-input/30 last:before:hidden"
    >
      <div className="flex items-center gap-4">
        <div
          className="max-[480px]:hidden size-10 shrink-0 rounded-full 
          bg-emerald-600/25 border border-emerald-600/50 flex items-center 
          justify-center text-emerald-500"
        >
          {icon}
        </div>
        {/* Content */}
        <div>
          <p className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0">
            {title}
          </p>
          <h2 className="text-2xl font-semibold mb-2">{value}</h2>
          <p className="text-xs text-muted-foreground/60">
            <span className="font-medium">{helperText}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default QuickStats;
