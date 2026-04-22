import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

export interface Book {
  id: number;
  title: string;
  author: string;
  image: string | null;
  condition: string;
  exchange_type: string;
  is_available: boolean;
  owner: string;
  genre: { id: number; name: string; slug: string } | null;
  description?: string;
  isbn?: string;
  created_at?: string;
}

const conditionColors: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-700',
  like_new: 'bg-teal-100 text-teal-700',
  good: 'bg-sky-100 text-sky-700',
  fair: 'bg-amber-100 text-amber-700',
  worn: 'bg-slate-200 text-slate-600',
};

const typeColors: Record<string, string> = {
  exchange: 'bg-indigo-600',
  donate: 'bg-emerald-600',
  both: 'bg-violet-600',
};

const coverThemes = [
  {
    cover: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    accent: 'bg-white/18',
    text: 'text-white',
    spine: 'from-slate-950/25 to-transparent',
  },
  {
    cover: 'from-emerald-500 via-teal-500 to-cyan-500',
    accent: 'bg-white/16',
    text: 'text-white',
    spine: 'from-emerald-950/25 to-transparent',
  },
  {
    cover: 'from-amber-400 via-orange-500 to-rose-500',
    accent: 'bg-white/16',
    text: 'text-white',
    spine: 'from-orange-950/25 to-transparent',
  },
  {
    cover: 'from-slate-700 via-slate-800 to-slate-950',
    accent: 'bg-white/10',
    text: 'text-white',
    spine: 'from-black/35 to-transparent',
  },
  {
    cover: 'from-sky-500 via-blue-500 to-indigo-600',
    accent: 'bg-white/16',
    text: 'text-white',
    spine: 'from-blue-950/25 to-transparent',
  },
  {
    cover: 'from-rose-400 via-pink-500 to-purple-600',
    accent: 'bg-white/16',
    text: 'text-white',
    spine: 'from-rose-950/25 to-transparent',
  },
];

const getTitleInitials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

const getThemeIndex = (title: string) =>
  Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0) % coverThemes.length;

export const BookCard = ({ book }: { book: Book }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackTheme = useMemo(() => coverThemes[getThemeIndex(book.title)], [book.title]);
  const titleInitials = useMemo(() => getTitleInitials(book.title), [book.title]);
  const showImage = Boolean(book.image) && !imageFailed;

  return (
    <Link to={`/books/${book.id}`} className="group block h-full">
      <div className="book-card-tilt bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl h-full flex flex-col relative transition-shadow duration-300">
        {/* Availability Badge */}
        {!book.is_available && (
          <div className="absolute inset-0 bg-slate-900/40 z-20 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-sm px-4 py-1.5 rounded-full font-semibold tracking-wide shadow-lg">
              Unavailable
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className={`absolute top-4 left-4 ${typeColors[book.exchange_type] || 'bg-indigo-600'}/90 text-white text-[10px] px-3 py-1 rounded-full font-bold z-30 uppercase tracking-wider shadow-md backdrop-blur-md border border-white/10`}>
          {book.exchange_type}
        </div>

        {/* Image Container */}
        <div className="aspect-[3/4] w-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
          {showImage ? (
            <img
              src={book.image ?? undefined}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${fallbackTheme.cover} ${fallbackTheme.text}`}>
              <div className="absolute inset-0 opacity-80">
                <div className={`absolute top-4 right-4 w-16 h-16 rounded-full blur-2xl ${fallbackTheme.accent}`}></div>
                <div className={`absolute bottom-8 left-4 w-24 h-24 rounded-full blur-3xl ${fallbackTheme.accent}`}></div>
                <div className="absolute inset-x-6 top-10 h-px bg-white/30"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75 mt-8">
                    BookSwap Edition
                  </span>
                  <div className="w-9 h-9 rounded-full border border-white/30 bg-white/20 flex items-center justify-center text-[13px] font-bold shadow-sm backdrop-blur-md">
                    {titleInitials}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-lg font-black leading-tight line-clamp-3 drop-shadow-sm">
                      {book.title}
                    </h4>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/75 line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-px flex-1 bg-white/30"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spine shadow */}
          <div className={`absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r ${showImage ? 'from-black/15 to-transparent' : fallbackTheme.spine} z-10 pointer-events-none`}></div>
          <div className="absolute inset-y-0 left-4 w-px bg-white/20 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow gap-1">
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[2.5rem]" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>

          <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full ${conditionColors[book.condition] || 'bg-slate-100 text-slate-600'}`}>
                {book.condition.replace('_', ' ')}
              </span>
              {book.genre && (
                <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                  {book.genre.name}
                </span>
              )}
            </div>
            {book.owner && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-indigo-600">{book.owner.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  {book.owner}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
