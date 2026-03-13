interface Props {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function FAB({ label, onClick, icon }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-4 rounded-full shadow-lg shadow-cyan-500/40 font-semibold flex items-center gap-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-cyan-500/50 active:scale-95 z-40 w-11/12 max-w-sm justify-center text-lg"
    >
      {icon}
      {label}
    </button>
  );
}
