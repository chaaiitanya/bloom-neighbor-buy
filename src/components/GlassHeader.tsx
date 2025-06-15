
import clsx from "clsx";

export default function GlassHeader({ visible }: { visible: boolean }) {
  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-30 transition-all duration-300 flex items-center justify-center backdrop-blur-xl bg-black/40 shadow-lg",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-8"
      )}
      style={{ height: "4.5rem" }}
    >
      <h1 className="text-2xl font-extrabold text-green-100 tracking-wide drop-shadow">
        Sproutsly
      </h1>
    </header>
  );
}
