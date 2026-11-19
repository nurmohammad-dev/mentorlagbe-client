import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Globe, MapPin, User } from "lucide-react";

export interface TuitionItem {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  daysPerWeek?: string;
  schedule?: string;
  monthlyFee: number;
  bannerImage?: string;
  image?: string;
  tutorName: string;
  tutorEmail?: string;
}

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80";

export default function TuitionCard({ tuition }: { tuition: TuitionItem }) {
  const rawBanner = tuition.bannerImage || tuition.image || "";
  const banner = rawBanner.startsWith("https://") ? rawBanner : FALLBACK_BANNER;
  const isOnline = tuition.mode?.toLowerCase() === "online";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3eae5] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#0f7a5a]/40 hover:shadow-[0_20px_40px_-28px_rgba(15,122,90,0.45)]">
      {/* Uniform Banner Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eef5f1]">
        <Image
          src={banner}
          alt={tuition.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#12211c]/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {isOnline ? (
            <Globe className="size-3 text-[#4ade80]" />
          ) : (
            <MapPin className="size-3 text-[#4ade80]" />
          )}
          <span>{isOnline ? "Online" : tuition.location || "Offline"}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="rounded-md bg-[#e8f3ee] px-2.5 py-1 font-semibold text-[#0f513f]">
            {tuition.subject}
          </span>
          <span className="font-medium text-[#64748b]">
            {tuition.classLevel}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[16px] font-semibold leading-snug text-[#12211c] group-hover:text-[#0f7a5a]">
          {tuition.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#64748b]">
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5 text-[#0f7a5a]" />
            {tuition.tutorName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-[#0f7a5a]" />
            {tuition.daysPerWeek || tuition.schedule || "3 days/week"}
          </span>
        </div>

        {/* Footer pinned to bottom for equal card height */}
        <div className="mt-auto flex items-center justify-between border-t border-[#eef2ef] pt-4">
          <div>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-[#8a9a93]">
              Monthly Fee
            </span>
            <span className="text-[17px] font-bold text-[#12211c]">
              ৳{Number(tuition.monthlyFee).toLocaleString()}
              <span className="text-[11px] font-normal text-[#64748b]">
                /mo
              </span>
            </span>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0f7a5a] px-3.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#0c654b]"
          >
            View Details
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}