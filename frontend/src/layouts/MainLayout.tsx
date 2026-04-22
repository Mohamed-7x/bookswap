import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toaster } from 'react-hot-toast';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ecfdf5',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#fff1f2',
          },
        },
      }} />
    </div>
  );
};
