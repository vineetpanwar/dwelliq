"use client";

import { useEffect, useState } from "react";

interface Props {
  end: number;
  trigger: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, trigger, prefix = "", suffix = "", className = "" }: Props) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let cur = 0;
    const tick = () => {
      cur += Math.max(1, Math.ceil((end - cur) / 12));
      if (cur >= end) { setN(end); return; }
      setN(cur); setTimeout(tick, 24);
    };
    setTimeout(tick, 150);
  }, [trigger, end]);
  return <span className={className}>{prefix}{n.toLocaleString()}{suffix}</span>;
}
