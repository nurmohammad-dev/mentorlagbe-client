"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import TuitionCard, { TuitionItem } from "@/components/shared/TuitionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "IELTS",
  "ICT",
  "Programming",
  "Accounting",
  "General Science",
];

const CLASS_LEVELS = [
  "Class 6–8",
  "Class 8",
  "SSC",
  "HSC",
  "O-Level",
  "A-Level",
  "University",
  "All Levels",
];

function BrowseTuitionsContent() {
  const searchParams = useSearchParams();
  const initialQuery =
    searchParams.get("q") || searchParams.get("search") || "";

  const [tuitions, setTuitions] = useState<TuitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [mode, setMode] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const limit = 9;

  // Sync URL search query without triggering cascading useEffect renders
  const paramQ = searchParams.get("q") || searchParams.get("search") || "";
  const [prevParamQ, setPrevParamQ] = useState(paramQ);

  if (paramQ !== prevParamQ) {
    setPrevParamQ(paramQ);
    setSearchInput(paramQ);
    setSearchQuery(paramQ);
    setPage(1);
  }

  useEffect(() => {
    let ignore = false;

    const loadTuitions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (subject) params.set("subject", subject);
        if (classLevel) params.set("classLevel", classLevel);
        if (mode) params.set("mode", mode);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", String(limit));

        const res = await fetch(
          `${API_BASE_URL}/api/tuitions?${params.toString()}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (!ignore) {
          if (res.ok) {
            setTuitions(Array.isArray(data.tuitions) ? data.tuitions : []);
            setTotalPages(Number(data.totalPages) || 1);
            setTotalItems(Number(data.total) || 0);
          } else {
            setTuitions([]);
          }
        }
      } catch {
        if (!ignore) {
          setTuitions([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTuitions();

    return () => {
      ignore = true;
    };
  }, [searchQuery, subject, classLevel, mode, sort, page]);

  const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSubject("");
    setClassLevel("");
    setMode("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery || subject || classLevel || mode || sort !== "newest"
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#e4ece7] pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f513f]">
            <SlidersHorizontal className="size-3.5" />
            Verified Tuition Directory
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#12211c] sm:text-4xl">
            Browse Approved Tuitions
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-[#5b6b64]">
            Search by subject, title, or area and filter by class level or
            online/offline mode to find your ideal mentor.
          </p>
        </div>

        <div className="text-[13px] font-medium text-[#5b6b64]">
          Showing{" "}
          <span className="font-semibold text-[#12211c]">
            {tuitions.length}
          </span>{" "}
          of <span className="font-semibold text-[#12211c]">{totalItems}</span>{" "}
          listings
        </div>
      </div>

      {/* Server-Side Search & Filter Controls */}
      <div className="mt-8 rounded-2xl border border-[#e3eae5] bg-white p-4 shadow-xs sm:p-5">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a9a93]" />
            <Input
              type="search"
              placeholder="Search by title, subject, tutor, or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 rounded-xl border-[#dce5df] bg-[#fbfaf7] pl-10 text-[13px] focus-visible:border-[#0f7a5a] focus-visible:bg-white"
            />
          </div>
          <Button
            type="submit"
            className="h-11 rounded-xl bg-[#0f7a5a] px-6 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
          >
            Search
          </Button>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subject Filter */}
          <div>
            <label
              htmlFor="filter-subject"
              className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]"
            >
              <Filter className="size-3" />
              Subject
            </label>
            <select
              id="filter-subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Class Level Filter */}
          <div>
            <label
              htmlFor="filter-class"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#64748b]"
            >
              Class Level
            </label>
            <select
              id="filter-class"
              value={classLevel}
              onChange={(e) => {
                setClassLevel(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              <option value="">All Class Levels</option>
              {CLASS_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label
              htmlFor="filter-mode"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#64748b]"
            >
              Learning Mode
            </label>
            <select
              id="filter-mode"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              <option value="">All Modes (Online & Offline)</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="filter-sort"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#64748b]"
            >
              Sort By
            </label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#dce5df] bg-[#fbfaf7] px-3 text-[13px] text-[#12211c] outline-none focus:border-[#0f7a5a] focus:bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="fee-asc">Monthly Fee: Low to High</option>
              <option value="fee-desc">Monthly Fee: High to Low</option>
            </select>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 flex justify-end border-t border-[#eef2ef] pt-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0f7a5a] hover:text-[#0c654b]"
            >
              <RotateCcw className="size-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[370px] animate-pulse rounded-2xl border border-[#e3eae5] bg-white p-5"
            >
              <div className="aspect-[16/10] w-full rounded-xl bg-gray-100" />
              <div className="mt-4 h-4 w-24 rounded bg-gray-100" />
              <div className="mt-3 h-5 w-3/4 rounded bg-gray-100" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
              <div className="mt-8 h-9 w-full rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      ) : tuitions.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#cfe0d7] bg-white p-14 text-center">
          <h3 className="text-[17px] font-semibold text-[#12211c]">
            No matching tuitions found
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-[13px] text-[#64748b]">
            Try clearing your search keyword or adjusting the subject, class
            level, and mode filters.
          </p>
          {hasActiveFilters ? (
            <Button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 h-10 rounded-xl bg-[#0f7a5a] px-5 text-[13px] font-semibold text-white hover:bg-[#0c654b]"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 ? (
            <nav
              aria-label="Pagination"
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#dce5df] bg-white px-3.5 text-[13px] font-medium text-[#12211c] transition-colors hover:bg-[#eef7f2] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl text-[13px] font-semibold transition-colors",
                      page === pageNum
                        ? "bg-[#0f7a5a] text-white"
                        : "border border-[#dce5df] bg-white text-[#475569] hover:bg-[#eef7f2]"
                    )}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#dce5df] bg-white px-3.5 text-[13px] font-medium text-[#12211c] transition-colors hover:bg-[#eef7f2] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function BrowseTuitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-[14px] text-[#5b6b64]">
          Loading tuition listings...
        </div>
      }
    >
      <BrowseTuitionsContent />
    </Suspense>
  );
}