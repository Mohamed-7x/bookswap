import { BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-400" />
            <span className="text-xl font-bold text-slate-100">BookSwap</span>
          </div>
          
          <p className="text-sm">
            &copy; {new Date().getFullYear()} BookSwap Platform. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

