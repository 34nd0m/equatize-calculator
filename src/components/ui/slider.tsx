
import * as React from "react";
type Props = { id?: string; value: number[]; min?: number; max?: number; step?: number; onValueChange: (vals:number[])=>void };
export function Slider({ id, value, min=0, max=1, step=0.01, onValueChange }: Props) {
  return (
    <input id={id} type="range" min={min} max={max} step={step} value={value[0]} onChange={(e)=>onValueChange([parseFloat(e.target.value)])}
      className="w-full accent-[#5f58ff]" />
  );
}
