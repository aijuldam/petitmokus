import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { Language, dictionary } from "../lib/i18n";
import { TabIntro } from "./TabIntro";
import {
  bedtimeStoriesApi,
  type BedtimeStory,
  type BedtimeStorySummary,
} from "../lib/studio-api";

interface TabStoriesProps {
  language: Language;
}

export function TabStories({ language }: TabStoriesProps) {
  const ui = dictionary.ui;
  const [books, setBooks] = useState<BedtimeStorySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    bedtimeStoriesApi
      .list()
      .then((r) => setBooks(r.books))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (openSlug) {
    return <Reader slug={openSlug} onClose={() => setOpenSlug(null)} />;
  }

  return (
    <>
      <div className="px-6 pt-6 max-w-md mx-auto">
        <TabIntro
          emoji="📖"
          title={ui.storiesIntroTitle[language]}
          body={ui.storiesIntroBody[language]}
        />
      </div>

      <div className="px-6 pb-32 max-w-md mx-auto">
        {books === null && !error && (
          <p className="text-center text-muted-foreground py-12">Loading stories…</p>
        )}
        {error && (
          <p className="text-center text-rose-600 py-12 text-sm">
            Couldn't load stories. {error}
          </p>
        )}
        {books && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              No bedtime stories published yet.
            </p>
          </div>
        )}
        <ul className="space-y-4 mt-4">
          {books?.map((b) => (
            <li
              key={b.id}
              onClick={() => setOpenSlug(b.slug)}
              className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden cursor-pointer hover:shadow-md transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="w-20 h-20 rounded-xl bg-primary/10 overflow-hidden flex-shrink-0">
                  {b.cover_image_url ? (
                    <img
                      src={b.cover_image_url}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-foreground truncate">{b.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Tap to read
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ============================================================
// Reader — page-by-page board book viewer
// ============================================================
function Reader({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [book, setBook] = useState<BedtimeStory | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bedtimeStoriesApi
      .get(slug)
      .then((r) => setBook(r.book))
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  if (error)
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
        <p className="text-rose-600 mb-4">{error}</p>
        <button
          onClick={onClose}
          className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    );

  if (!book)
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <p className="text-muted-foreground">Opening book…</p>
      </div>
    );

  const totalPages = book.pages.length;
  const current = book.pages[page]!;
  const isFirst = page === 0;
  const isLast = page === totalPages - 1;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/50">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/60"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="font-extrabold text-amber-900 truncate px-3">{book.title}</h2>
        <span className="text-xs text-slate-500 font-bold">
          {page + 1} / {totalPages}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg bg-white mb-6">
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={current.text}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <BookOpen className="w-16 h-16 text-primary/40" />
            </div>
          )}
        </div>
        <p className="text-2xl md:text-3xl font-extrabold text-center text-amber-900 leading-snug min-h-[3rem]">
          {current.text}
        </p>
      </div>

      <div className="flex items-center justify-between px-6 pb-8 pt-2">
        <button
          disabled={isFirst}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="p-3 rounded-full bg-white shadow-sm disabled:opacity-30"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-amber-800" />
        </button>
        <div className="flex gap-1">
          {book.pages.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition ${
                i === page ? "bg-amber-700 w-4" : "bg-amber-300"
              }`}
            />
          ))}
        </div>
        <button
          disabled={isLast}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          className="p-3 rounded-full bg-white shadow-sm disabled:opacity-30"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-amber-800" />
        </button>
      </div>
    </div>
  );
}
