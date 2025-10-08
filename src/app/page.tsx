"use client";

import React, { useMemo, useState } from "react";

import { Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import "@fontsource/outfit";

function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border rounded-xl bg-white ${className}`} {...props} />;
}
function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...props} />;
}
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#5f58ff] ${className}`} {...props} />
  )
);
Input.displayName = "Input";
function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}
function Button({ className = "", variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) {
  return <button className={`inline-flex items-center gap-2 rounded-md px-3 py-2 border hover:bg-gray-50 ${className}`} {...props} />;
}
function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean)=>void }) {
  return (
    <label style={{display:'inline-flex',alignItems:'center',cursor:'pointer'}}>
      <input type="checkbox" checked={checked} onChange={(e)=>onCheckedChange(e.target.checked)} style={{display:'none'}}/>
      <span style={{width:40,height:22,borderRadius:999,background:checked?'#5f58ff':'#ddd',position:'relative',transition:'all .2s'}}>
        <span style={{position:'absolute',top:3,left:checked?22:3,width:16,height:16,borderRadius:999,background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,.2)',transition:'all .2s'}} />
      </span>
    </label>
  );
}
function Slider({ id, value, min=0, max=1, step=0.01, onValueChange }: { id?: string; value: number[]; min?: number; max?: number; step?: number; onValueChange: (vals:number[])=>void }) {
  return (
    <input id={id} type="range" min={min} max={max} step={step} value={value[0]} onChange={(e)=>onValueChange([parseFloat(e.target.value)])}
      className="w-full accent-[#5f58ff]" />
  );
}
const PopCtx = React.createContext<{open:boolean,setOpen:(b:boolean)=>void}|null>(null);
function Popover({ children }: { children: React.ReactNode }) {
  const [open,setOpen] = useState(false);
  return <PopCtx.Provider value={{open,setOpen}}><div className="relative inline-block">{children}</div></PopCtx.Provider>;
}
function PopoverTrigger({ asChild = false, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(PopCtx)!;
  const onClick = () => ctx.setOpen(!ctx.open);
  return React.cloneElement(children, { onClick });
}
function PopoverContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(PopCtx)!;
  if (!ctx.open) return null;
  return (
    <div className={`absolute z-50 mt-2 w-64 rounded-md border bg-white p-3 shadow ${className}`}>
      {children}
    </div>
  );
}

const currency = (n: number, ccy = "$") =>
  ccy + new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

function shortCurrency(n: number, ccy = "$") {
  const abs = Math.abs(n);
  if (abs >= 1e9) return ccy + (n / 1e9).toFixed(1) + "b";
  if (abs >= 1e6) return ccy + (n / 1e6).toFixed(1) + "m";
  if (abs >= 1e3) return ccy + (n / 1e3).toFixed(0) + "k";
  return ccy + Math.round(n).toString();
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  help,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  help?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {help && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label={`Info: ${label}`} className="inline-flex">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-xs">
              {help}
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="grid grid-cols-6 gap-3 items-center">
        <div className="col-span-3">
          <Input
            id={id}
            type="number"
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="col-span-3 text-sm text-muted-foreground">
          {prefix}
          {prefix ? " " : ""}
          {min !== undefined && max !== undefined && (
            <>
              Range: {min} – {max}
            </>
          )}
          {suffix && (
            <>
              {min !== undefined && max !== undefined ? " • " : ""}
              {suffix}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PctSlider({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  help,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} <span className="text-muted-foreground">{pct(value)}</span>
        </Label>
        {help && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label={`Info: ${label}`} className="inline-flex">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-xs">
              {help}
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
      />
    </div>
  );
}

function computeUnlock(
  auv: number,
  ebitdaMargin: number,
  royalty: number,
  includeRoyalty: boolean,
  multiple: number,
  unlockPct: number,
  discountPct: number
) {
  const effectiveMargin = includeRoyalty ? Math.max(0, ebitdaMargin - royalty) : ebitdaMargin;
  const ebitda = auv * effectiveMargin;
  const enterpriseValue = ebitda * multiple;
  const grossUnlock = enterpriseValue * unlockPct;
  const netUnlock = grossUnlock * (1 - discountPct);
  return { effectiveMargin, ebitda, enterpriseValue, grossUnlock, netUnlock };
}

function computeTraditionalNet(enterpriseValue: number, parts: number[]) {
  const total = parts.reduce((a, b) => a + b, 0);
  const pct = Math.max(0, Math.min(0.9, total));
  return enterpriseValue * (1 - pct);
}

(function runTests() {
  const a = computeUnlock(1_000_000, 0.2, 0.05, true, 4, 0.25, 0.1);
  console.assert(Math.abs(a.effectiveMargin - 0.15) < 1e-9);
  console.assert(Math.abs(a.ebitda - 150000) < 1e-6);
  console.assert(Math.abs(a.enterpriseValue - 600000) < 1e-6);
  console.assert(Math.abs(a.netUnlock - 135000) < 1e-6);
  const b = computeUnlock(1_000_000, 0.2, 0.05, false, 4, 0.5, 0);
  console.assert(Math.abs(b.effectiveMargin - 0.2) < 1e-9);
  console.assert(Math.abs(b.netUnlock - 400000) < 1e-6);
  const c = computeUnlock(1_000_000, 0.04, 0.06, true, 5, 0.3, 0.2);
  console.assert(Math.abs(c.effectiveMargin - 0) < 1e-9);
  console.assert(Math.abs(c.netUnlock - 0) < 1e-9);
  const trad = computeTraditionalNet(500000, [0.1, 0.05]);
  console.assert(Math.abs(trad - 425000) < 1e-6);
  console.assert(shortCurrency(1_200_000, "$") === "$1.2m");
  const tradClamp = computeTraditionalNet(100000, [0.6, 0.3, 0.3]);
  console.assert(Math.abs(tradClamp - 100000 * (1 - 0.9)) < 1e-6);
})();

export default function Calculator() {
  const sectorPresets: Record<string, {
    label: string;
    auv: number;
    royalty: number;
    ebitdaMargin: number;
    multiple: number;
    sectorCompMultiple: number;
    comps: { source: string; earningsMultipleRange: string; notes?: string }[];
  }> = {
    qsr: {
      label: "Food & Beverage - QSR",
      auv: 1300000,
      royalty: 0.06,
      ebitdaMargin: 0.2,
      multiple: 4.5,
      sectorCompMultiple: 3.0,
      comps: [
        { source: "BizBuySell (Restaurants)", earningsMultipleRange: "~2.0x-3.5x" },
        { source: "Raincatcher (Franchisee)", earningsMultipleRange: "2.5x-3.5x" },
      ],
    },
    coffee: {
      label: "Food & Beverage - Coffee/Cafe",
      auv: 900000,
      royalty: 0.065,
      ebitdaMargin: 0.18,
      multiple: 4.2,
      sectorCompMultiple: 2.2,
      comps: [
        { source: "BizBuySell (Coffee Shops)", earningsMultipleRange: "~2.0x-2.4x" },
        { source: "Raincatcher (Franchisee)", earningsMultipleRange: "2.5x-3.5x (general)" },
      ],
    },
    fitness: {
      label: "Health & Fitness - Gyms/Studios",
      auv: 750000,
      royalty: 0.07,
      ebitdaMargin: 0.22,
      multiple: 4.0,
      sectorCompMultiple: 2.45,
      comps: [
        { source: "BizBuySell (Gyms)", earningsMultipleRange: "~2.3x-2.6x" },
        { source: "Equidam (Health/Fitness)", earningsMultipleRange: "~5x+ for larger" },
      ],
    },
    auto: {
      label: "Automotive Services",
      auv: 1100000,
      royalty: 0.06,
      ebitdaMargin: 0.19,
      multiple: 4.0,
      sectorCompMultiple: 2.75,
      comps: [
        { source: "BizBuySell (Service/Repair)", earningsMultipleRange: "~2.4x-3.1x" },
      ],
    },
    education: {
      label: "Education & Children",
      auv: 650000,
      royalty: 0.06,
      ebitdaMargin: 0.23,
      multiple: 4.2,
      sectorCompMultiple: 3.2,
      comps: [
        { source: "BizBuySell (Daycare/Preschools)", earningsMultipleRange: "~3.1x-3.3x" },
      ],
    },
    beauty: {
      label: "Beauty & Personal Care",
      auv: 520000,
      royalty: 0.065,
      ebitdaMargin: 0.24,
      multiple: 3.8,
      sectorCompMultiple: 2.05,
      comps: [
        { source: "BizBuySell (Salons/Spas)", earningsMultipleRange: "~1.8x-2.3x" },
      ],
    },
    homesvc: {
      label: "Home & Property Services",
      auv: 1000000,
      royalty: 0.06,
      ebitdaMargin: 0.21,
      multiple: 4.2,
      sectorCompMultiple: 2.6,
      comps: [
        { source: "BizBuySell (HVAC/Plumbing/Landscaping)", earningsMultipleRange: "~2.4x-2.8x" },
      ],
    },
  };

  const [sectorKey, setSectorKey] = useState<keyof typeof sectorPresets>("qsr");
  const [auq, setAuq] = useState(1200000);
  const [royalty, setRoyalty] = useState(0.06);
  const [ebitdaMargin, setEbitdaMargin] = useState(0.18);
  const [multiple, setMultiple] = useState(4.5);
  const [unlockPct, setUnlockPct] = useState(0.6);
  const [discountPct, setDiscountPct] = useState(0.15);
  const [brokerCommissionPct, setBrokerCommissionPct] = useState(0.15);
  const [legalProfessionalPct, setLegalProfessionalPct] = useState(0.02);
  const [accountingTaxPct, setAccountingTaxPct] = useState(0.01);
  const [dueDiligencePct, setDueDiligencePct] = useState(0.01);
  const [frictionPremiumPct, setFrictionPremiumPct] = useState(0.05);
  const [unitsMulti, setUnitsMulti] = useState(5);
  const [unitsNetwork, setUnitsNetwork] = useState(150);
  const [ccy, setCcy] = useState("$");
  const [includeRoyaltyInMargin, setIncludeRoyaltyInMargin] = useState(true);

  function applySectorPreset(key: keyof typeof sectorPresets) {
    const p = sectorPresets[key];
    setSectorKey(key);
    setAuq(p.auv);
    setRoyalty(p.royalty);
    setEbitdaMargin(p.ebitdaMargin);
    setMultiple(p.multiple);
  }

  const perUnit = useMemo(() => {
    const effectiveMargin = includeRoyaltyInMargin ? Math.max(0, ebitdaMargin - royalty) : ebitdaMargin;
    const ebitda = auq * effectiveMargin;
    const enterpriseValue = ebitda * multiple;
    const grossUnlock = enterpriseValue * unlockPct;
    const netUnlock = grossUnlock * (1 - discountPct);
    const sectorMultiple = sectorPresets[sectorKey].sectorCompMultiple;
    const brokerSaleValue = ebitda * sectorMultiple;
    const traditionalNet = computeTraditionalNet(brokerSaleValue, [
      brokerCommissionPct,
      legalProfessionalPct,
      accountingTaxPct,
      dueDiligencePct,
      frictionPremiumPct,
    ]);
    const diffEquatizeVsTraditional = netUnlock - traditionalNet;
    return {
      effectiveMargin,
      ebitda,
      enterpriseValue,
      grossUnlock,
      netUnlock,
      traditionalNet,
      diffEquatizeVsTraditional,
      sectorMultiple,
      brokerSaleValue,
    };
  }, [
    auq,
    ebitdaMargin,
    royalty,
    includeRoyaltyInMargin,
    multiple,
    unlockPct,
    discountPct,
    brokerCommissionPct,
    legalProfessionalPct,
    accountingTaxPct,
    dueDiligencePct,
    frictionPremiumPct,
    sectorKey,
  ]);

  const single = useMemo(
    () => ({ units: 1, totalEV: perUnit.enterpriseValue, unlockNow: perUnit.netUnlock }),
    [perUnit]
  );
  const multi = useMemo(
    () => ({ units: unitsMulti, totalEV: perUnit.enterpriseValue * unitsMulti, unlockNow: perUnit.netUnlock * unitsMulti }),
    [perUnit, unitsMulti]
  );
  const network = useMemo(
    () => ({ units: unitsNetwork, totalEV: perUnit.enterpriseValue * unitsNetwork, unlockNow: perUnit.netUnlock * unitsNetwork }),
    [perUnit, unitsNetwork]
  );

  const chartData = [
    { name: "Single-unit", Unlock: Math.max(0, single.unlockNow) },
    { name: `${unitsMulti}-unit`, Unlock: Math.max(0, multi.unlockNow) },
    { name: `${unitsNetwork} network`, Unlock: Math.max(0, network.unlockNow) },
  ];

  function resetDefaults() {
    applySectorPreset("qsr");
    setUnlockPct(0.7);
    setDiscountPct(0.15);
    setUnitsMulti(5);
    setUnitsNetwork(150);
    setCcy("$");
    setIncludeRoyaltyInMargin(true);
    setBrokerCommissionPct(0.08);
    setLegalProfessionalPct(0.02);
    setAccountingTaxPct(0.01);
    setDueDiligencePct(0.01);
    setFrictionPremiumPct(0.03);
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-8 font-[Outfit]">
      <div className="flex flex-col items-center space-y-3">
        <img src="/equatize-logo-dark.png" alt="Equatize Logo" width={180} height={40} />
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-center text-[#5f58ff]"
        >
          Franchise Capital Value Calculator
        </motion.h1>
      </div>
      <p className="text-center text-muted-foreground max-w-3xl mx-auto">
        Estimate how much capital value can be unlocked today while retaining control and ongoing income rights. 
        <br />
        <br />
        Adjust the inputs to reflect your brand’s economics.
      </p>

      <div className="space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold text-[#5f58ff] tracking-tight">Unit Economics</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Business sector</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" aria-label="Info: Business sector" className="inline-flex">
                        <Info className="w-4 h-4 text-muted-foreground ml-1" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs">
                      Choose a sector to auto-fill typical AUV, royalty %, pre-royalty EBITDA margin, and a midpoint EV / EBITDA multiple. These are illustrative presets; edit to match your brand.
                    </PopoverContent>
                  </Popover>
                </div>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={sectorKey}
                  onChange={(e) => applySectorPreset(e.target.value as keyof typeof sectorPresets)}
                >
                  {Object.entries(sectorPresets).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              <NumberField id="auq" label="Average Unit Revenue (AUV)" value={auq} onChange={setAuq} step={1000} prefix="Typical range: $600k – $2.5m" help="Trailing-12-month gross revenue per location. Use system AUV or adjust for the specific cohort/brand." />
              <PctSlider id="royalty" label="Royalty & brand fees" value={royalty} onChange={setRoyalty} help="Combined ongoing fees as a % of gross revenue (e.g., royalty + national marketing fund)." />
              <PctSlider id="margin" label="EBITDA margin (pre-royalty)" value={ebitdaMargin} onChange={setEbitdaMargin} help="Store-level EBITDA margin before royalties/brand fees. If you toggle subtraction on, we'll deduct royalties from this to get an effective margin." />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Subtract royalties from margin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" aria-label="Info: Subtract royalties" className="inline-flex">
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs">
                      When on, effective EBITDA margin = pre-royalty margin - royalty %. When off, royalty is ignored in the margin calc.
                    </PopoverContent>
                  </Popover>
                </div>
                <Switch checked={includeRoyaltyInMargin} onCheckedChange={setIncludeRoyaltyInMargin} />
              </div>
              <NumberField id="multiple" label="EV / EBITDA multiple (Equatize)" value={multiple} onChange={setMultiple} step={0.1} suffix="Edit to your latest comps" help="Illustrative multiple reflecting a standardized, lower-risk instrument versus small-business resales." />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold text-[#5f58ff]">Capital Value Parameters</h2>
            <div className="grid gap-4">
              <PctSlider id="unlockPct" label="Accessible capital value" value={unlockPct} onChange={setUnlockPct} help="Portion of accessible capital value today while retaining ongoing income rights. Accessible capital value is capped at 70%." />
              <PctSlider id="discountPct" label="Participation discount" value={discountPct} onChange={setDiscountPct} help="Conservative haircut for friction and risk. Net unlock = gross unlock × (1 - discount)." />
              <div className="grid grid-cols-2 gap-4">
                <NumberField id="unitsMulti" label="Multi-unit operator: units" value={unitsMulti} onChange={setUnitsMulti} step={1} help="How many locations a given operator owns. Used to scale per-unit values." />
                <NumberField id="unitsNetwork" label="Brand network: units" value={unitsNetwork} onChange={setUnitsNetwork} step={1} help="Total active locations in the brand. Used to estimate network-level unlock." />
              </div>
              <div className="flex items-center gap-3">
                <Label>Currency symbol</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" aria-label="Info: Currency symbol" className="inline-flex">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 text-xs">
                    Display only; no FX conversion is performed. For multi-currency analysis, run separate scenarios.
                  </PopoverContent>
                </Popover>
                <Input className="w-24" value={ccy} maxLength={3} onChange={(e) => setCcy(e.target.value || "$")} />
                <Button variant="ghost" size="sm" onClick={resetDefaults}>Reset</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold text-[#5f58ff]">Traditional Exit Fees</h2>
            <div className="grid gap-4">
              <PctSlider id="brokerCommissionPct" label="Broker commission" value={brokerCommissionPct} onChange={setBrokerCommissionPct} help="Typical percentage paid to a business broker on sale proceeds." />
              <PctSlider id="legalProfessionalPct" label="Legal & professional fees" value={legalProfessionalPct} onChange={setLegalProfessionalPct} help="External counsel and other professional costs tied to the sale." />
              <PctSlider id="accountingTaxPct" label="Accounting & tax advisory" value={accountingTaxPct} onChange={setAccountingTaxPct} help="Preparation, quality-of-earnings, and tax structuring support." />
              <PctSlider id="dueDiligencePct" label="Due diligence costs" value={dueDiligencePct} onChange={setDueDiligencePct} help="Third-party reports, inspections, and other diligence items." />
              <PctSlider id="frictionPremiumPct" label="Deal friction premium" value={frictionPremiumPct} onChange={setFrictionPremiumPct} help="Slippage from negotiation, holdbacks, escrows, and execution risk." />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#5f58ff] tracking-tight">Per-Unit Snapshot</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
            {/* Conventional Sale */}
            <div className="rounded-xl border p-4 space-y-3 bg-white">
              <div className="font-semibold text-gray-800">Conventional sale (via Broker)</div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sector resale multiple</span>
                <span className="font-medium">{perUnit.sectorMultiple.toFixed(2)}×</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sale price (before costs)</span>
                <span className="font-medium">{currency(perUnit.brokerSaleValue, ccy)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total costs</span>
                <span className="font-medium">
                  {pct(
                    brokerCommissionPct +
                    legalProfessionalPct +
                    accountingTaxPct +
                    dueDiligencePct +
                    frictionPremiumPct
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net value to owner</span>
                <span className="font-semibold">{currency(perUnit.traditionalNet, ccy)}</span>
              </div>
            
              {/* Sector comps now integrated */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-semibold mb-2 text-[#5f58ff]">Sector comps</h4>
                <div className="text-xs grid gap-1">
                  {sectorPresets[sectorKey].comps.map((c, i) => (
                    <div key={i} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{c.source}</span>
                      <span className="font-medium">{c.earningsMultipleRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          
            {/* Equatize Capital Value Release */}
            <div className="rounded-xl border-2 border-[#5f58ff]/40 bg-[#5f58ff]/5 p-4 space-y-2 shadow-sm">
              <div className="font-semibold text-[#5f58ff]">Capital value unlocked (via Equatize)</div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">EV / unit</span>
                <span className="font-medium">{currency(perUnit.enterpriseValue, ccy)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accessible capital value</span>
                <span className="font-medium">{pct(unlockPct)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross unlock</span>
                <span className="font-medium">{currency(perUnit.grossUnlock, ccy)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Participation discount</span>
                <span className="font-medium">{pct(discountPct)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net value to owner</span>
                <span className="font-semibold text-[#5f58ff]">
                  {currency(perUnit.netUnlock, ccy)}
                </span>
              </div>
            </div>
          </div>
              <div className="rounded-xl border-2 border-[#5f58ff]/40 bg-[#5f58ff]/10 p-3 mt-4 flex items-center justify-between shadow-sm">
                <div className="text-sm font-medium text-[#5f58ff]">
                  Conventional vs Equatize Margin (per unit)
                </div>
                <div
                  className={`text-base font-semibold ${
                    perUnit.diffEquatizeVsTraditional >= 0 ? "text-[#5f58ff]" : "text-red-500"
                  }`}
                >
                  {currency(perUnit.diffEquatizeVsTraditional, ccy)}
                </div>
              </div>
            <p className="text-xs text-muted-foreground mt-2">*Illustrative only. Multiples vary by size, growth, unit stability, and region.</p>
            <p className="text-xs text-muted-foreground mt-2">Traditional resale multiples reflect small private business transactions - illiquid, heavily owner-dependent, and subject to buyer risk premiums.
            By contrast, the Equatize framework models standardized, data-driven assets with improved transparency, diversification, and potential liquidity. That generally supports a higher valuation multiple - closer to how portfolios or financial products trade, not mom-and-pop resales.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#5f58ff]">Unlock comparison</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ left: 24, right: 12, top: 8, bottom: 8 }}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => shortCurrency(v, ccy)} width={60} />
                <Tooltip formatter={(v: number) => currency(v as number, ccy)} />
                <Legend />
                <Bar
                  dataKey="Unlock"
                  fill="#5f58ff"
                  stroke="#433fff"
                  strokeWidth={1}
                  radius={[6, 6, 0, 0]} // adds rounded top corners
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
        <span className="font-semibold text-[#5f58ff]">Important Notice:</span> The Franchise Capital Value Calculator is a conceptual illustration designed to help franchisors and franchisees explore liquidity options through Equatize’s capital access framework. It is not an investment solicitation, financial promotion, or offer to sell any securities. Calculations are for informational and comparative purposes only and are based on user-provided inputs; they do not constitute financial, tax, or legal advice. Actual valuations and outcomes may differ. Equatize Inc. does not provide earnings guarantees, investment returns, or financial projections. Users should consult independent professional advisors before making investment or financing decisions.
        <br />
        <br />
        <span className="font-semibold text-[#5f58ff]">© {new Date().getFullYear()} Equatize Inc. All rights reserved.</span>
      </div>
    </div>
  );
}
