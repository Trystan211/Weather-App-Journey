"use client";

type SidebarProps = {
  icon: React.ReactNode;
  temperature: string;
  condition: string;
  date: string;
  location: string;
};

const Sidebar = ({
  icon,
  temperature,
  condition,
  date,
  location,
}: SidebarProps) => {
  const formattedCondition =
    condition.charAt(0).toUpperCase() + condition.slice(1);

  return (
    <aside className="flex h-full w-full max-w-[240px] flex-col items-center justify-between rounded-[28px] bg-gradient-to-b from-blue-100/80 to-white/90 p-6">
      <div className="mt-2 flex flex-col items-center space-y-2 text-center">
        {icon}
        <p className="text-3xl font-bold">{temperature}</p>
        <p className="text-xl font-semibold">{formattedCondition}</p>
        <p className="">{location}</p>
      </div>

      <div className="mb-2 text-center text-xl">
        <p className="font-medium">{date}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
