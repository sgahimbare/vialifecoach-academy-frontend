type TabsProps = {
  active: string;
  setActive: (tab: string) => void;
};

export default function Tabs({ active, setActive }: TabsProps) {
  const tabs = ["In Progress", "Completed"];

  return (
    <div className="flex gap-6 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`pb-2 font-medium ${
            active === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
