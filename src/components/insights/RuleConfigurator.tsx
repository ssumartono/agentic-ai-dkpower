"use client";

import { useState, useTransition } from "react";
import { toggleRule } from "@/app/actions/rules";

export function RuleConfigurator({ rule }: { rule: { id: string, isActive: boolean } }) {
  const [isActive, setIsActive] = useState(rule.isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleRule(rule.id, isActive);
      if (res.success) {
        setIsActive(!isActive);
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`text-xs font-semibold ${isActive ? 'text-blue-600 hover:text-blue-800' : 'text-slate-400 hover:text-slate-600'} transition-colors disabled:opacity-50`}
    >
      {isPending ? "Saving..." : isActive ? "Active - Disable \u2192" : "Inactive - Enable \u2192"}
    </button>
  );
}
