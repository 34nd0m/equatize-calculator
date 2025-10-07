import * as React from "react";
const Ctx = React.createContext<{ open: boolean; setOpen: (b: boolean) => void } | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </Ctx.Provider>
  );
}

export function PopoverTrigger({ asChild = false, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(Ctx)!;
  const onClick = () => ctx.setOpen(!ctx.open);
  return React.cloneElement(children, { onClick });
}

export function PopoverContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(Ctx)!;
  if (!ctx.open) return null;
  return <div className={`absolute z-50 mt-2 w-64 rounded-md border bg-white p-3 shadow ${className}`}>{children}</div>;
}
