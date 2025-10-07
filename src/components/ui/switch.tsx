import * as React from "react";
export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} style={{ display: "none" }} />
      <span style={{ width: 40, height: 22, borderRadius: 999, background: checked ? "#5f58ff" : "#ddd", position: "relative", transition: "all .2s" }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 22 : 3, width: 16, height: 16, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "all .2s" }} />
      </span>
    </label>
  );
}
