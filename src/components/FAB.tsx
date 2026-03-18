interface Props {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function FAB({ label, onClick, icon }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-28 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[22rem] -translate-x-1/2 items-center justify-center gap-2 rounded-[24px] border border-cyan-200/20 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-[0_16px_34px_rgba(14,165,233,0.38)] transition-all duration-300 ease-out active:scale-[0.98]"
    >
      {icon}
      {label}
    </button>
  );
}
