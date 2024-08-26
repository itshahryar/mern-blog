import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-md ${mobileMenuOpen ? 'dark:bg-gray-800' : ''}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo and Navigation */}
          <div className='flex items-center'>
            <Link
              to='/'
              className={`flex items-center flex-shrink-0 ${
                mobileMenuOpen ? 'text-lg' : 'text-lg'
              } font-bold text-gray-900 dark:text-white`}
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg'>
                Sahand's
              </span>{' '}
              Blog
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className='hidden md:flex md:items-center md:space-x-8'>
            <NavLink to='/' label='Home' />
            <NavLink to='/about' label='About' />
            <NavLink to='/projects' label='Projects' />
          </nav>

          {/* Search Bar */}
          <div className='flex-1 flex items-center justify-center px-2 sm:mx-6 lg:mx-8'>
            <div className='w-full max-w-xs md:max-w-lg'>
              <form onSubmit={handleSearchSubmit}>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <AiOutlineSearch className='h-5 w-5 text-gray-500' />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            {/* Theme Toggle (hidden on mobile) */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className='hidden md:block p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none'
            >
              {theme === 'light' ? (
                <FaSun className='h-6 w-6' />
              ) : (
                <FaMoon className='h-6 w-6' />
              )}
            </button>

            {/* User Dropdown */}
            {currentUser ? (
              <div className='relative'>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className='flex items-center max-w-xs rounded-full focus:outline-none'
                >
                  <img
                    className='h-8 w-8 rounded-full'
                    src={currentUser.profilePicture || '/default-avatar.png'}
                    alt='User avatar'
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu'
                  >
                    <span className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
                      @{currentUser.username}
                    </span>
                    <span className='block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 truncate'>
                      {currentUser.email}
                    </span>
                    <Link
                      to='/dashboard?tab=profile'
                      className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      role='menuitem'
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignout}
                      className='w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      role='menuitem'
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/sign-in'
                className='px-2 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className='-mr-2 flex md:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none'
              >
                <span className='sr-only'>Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg
                    className='block h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                ) : (
                  <svg
                    className='block h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden'>
          <nav className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <NavLink to='/' label='Home' mobile />
            <NavLink to='/about' label='About' mobile />
            <NavLink to='/projects' label='Projects' mobile />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, mobile }) {
  const baseClasses =
    'block px-3 py-2 rounded-md text-base font-medium';
  const defaultClasses =
    'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800';
  const activeClasses = 'bg-gray-100 dark:bg-gray-700';
  const location = useLocation();

  return (
    <Link
      to={to}
      className={`${baseClasses} ${
        location.pathname === to ? activeClasses : defaultClasses
      } ${mobile ? 'text-lg' : 'text-sm'}`}
    >
      {label}
    </Link>
  );
}
