import { GraduationCap } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfaf7] px-4 text-[#12211c]">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#0f7a5a]/20" />
        <span className="relative flex size-12 items-center justify-center rounded-full bg-[#0f7a5a] text-white shadow-md">
          <GraduationCap className="size-6" strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-4 text-[13px] font-medium tracking-tight text-[#5b6b64]">
        Loading MentorLagbe...
      </p>
    </div>
  );
}