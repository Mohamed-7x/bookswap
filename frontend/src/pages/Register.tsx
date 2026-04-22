import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/register/', formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const errors = (error as AxiosError<Record<string, string | string[]>>).response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          const val = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
          toast.error(`${key}: ${val}`);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-sm transition-colors";

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-emerald-600" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700">First Name</label>
              <input id="first_name" name="first_name" type="text" className={inputClass} value={formData.first_name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700">Last Name</label>
              <input id="last_name" name="last_name" type="text" className={inputClass} value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username *</label>
            <input id="username" name="username" type="text" required className={inputClass} value={formData.username} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email *</label>
            <input id="email" name="email" type="email" required className={inputClass} value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password *</label>
            <input id="password" name="password" type="password" required className={inputClass} value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-slate-700">Confirm Password *</label>
            <input id="password2" name="password2" type="password" required className={inputClass} value={formData.password2} onChange={handleChange} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};
