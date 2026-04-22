import { Link } from 'react-router-dom';
import { Book as BookIcon } from 'lucide-react';

export interface Book {
  id: number;
  title: string;
  author: string;
  image: string | null;
  condition: string;
  exchange_type: string;
  is_available: boolean;
  owner_username?: string; // We might need to add this to the backend serializer later, or fetch it
}

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <Link to={`/books/${book.id}`} className="group block">
      <div className="book-card-tilt bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm h-full flex flex-col relative">
        {/* Availability Badge */}
        {!book.is_available && (
          <div className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md font-medium z-10 opacity-90">
            Unavailable
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-medium z-10 opacity-90 capitalize shadow-sm">
          {book.exchange_type}
        </div>

        {/* Image Container */}
        <div className="aspect-[2/3] w-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
          {book.image ? (
            <img 
              src={book.image} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <BookIcon size={48} strokeWidth={1} />
              <span className="text-xs uppercase tracking-wider">No Cover</span>
            </div>
          )}
          
          {/* Subtle spine shadow to make it look like a book */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent z-10"></div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 mb-2 line-clamp-1">{book.author}</p>
          
          <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 capitalize bg-slate-100 px-2 py-1 rounded">
              {book.condition.replace('_', ' ')}
            </span>
            {book.owner_username && (
              <span className="text-xs text-slate-400 truncate max-w-[100px]">
                by {book.owner_username}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

