import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  highlight?: boolean;
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  highlight = false,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border py-0 shadow-xs transition-all",
        highlight
          ? "border-[#0f7a5a]/30 bg-[#eef7f2]/60"
          : "border-[#e4ece7] bg-white"
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-[13px] font-medium text-[#64748b]">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-[#12211c]">
            {value}
          </p>
          {subtitle ? (
            <p className="text-[12px] text-[#7b8b84]">{subtitle}</p>
          ) : null}
        </div>

        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            highlight
              ? "bg-[#0f7a5a] text-white"
              : "bg-[#e8f3ee] text-[#0f7a5a]"
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}