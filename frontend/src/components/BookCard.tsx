import { Link } from 'react-router-dom';

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

export const BookCard = ({ book }: { book: Book }) => {
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
        <div className={`absolute top-3 left-3 ${typeColors[book.exchange_type] || 'bg-indigo-600'} text-white text-[10px] px-2.5 py-1 rounded-full font-bold z-10 uppercase tracking-wider shadow-sm`}>
          {book.exchange_type}
        </div>

        {/* Image Container */}
        <div className="aspect-[3/4] w-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="text-slate-300 flex flex-col items-center gap-3 p-4">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">No Cover</span>
            </div>
          )}

          {/* Spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/15 to-transparent z-10 pointer-events-none"></div>
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
