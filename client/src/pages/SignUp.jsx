import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen  flex items-center justify-center'>
      <div className='p-6 w-full max-w-3xl mx-auto flex flex-col md:flex-row md:items-center gap-5 bg-white rounded-lg shadow-lg'>
        {/* Left section */}
        <div className='flex-1'>
          <Link to='/' className='font-bold text-4xl text-gray-900'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Mind's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5 text-gray-600'>
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* Right section */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='username' className='block mb-1 text-sm font-medium text-gray-700'>
                Your username
              </label>
              <input
                type='text'
                id='username'
                placeholder='Username'
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>
                Your email
              </label>
              <input
                type='email'
                id='email'
                placeholder='name@company.com'
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-1 text-sm font-medium text-gray-700'>
                Your password
              </label>
              <input
                type='password'
                id='password'
                placeholder='Password'
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600'
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='animate-spin h-5 w-5 mr-3 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 20a8 8 0 01-8-8H0c0 6.627 5.373 12 12 12v-4z'
                    ></path>
                  </svg>
                  <span>Loading...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5 text-gray-600'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500 hover:underline'>
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <div className='mt-5 p-4 text-sm text-red-700 bg-red-100 rounded-lg' role='alert'>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}