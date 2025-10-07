
import * as React from "react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#5f58ff] ${className}`} {...props} />
  )
);
Input.displayName = "Input";
