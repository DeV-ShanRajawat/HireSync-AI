
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  User2,
  LogOut,
  LayoutDashboard,
  Briefcase
} from 'lucide-react';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    setIsLoggedIn(Boolean(token));

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setUser(null);

    navigate('/auth');
  };

  const isCompany = user?.type === 'Company';

  return (
    <nav className="flex w-full flex-col gap-5 bg-[#111111] px-5 pb-5 pt-6 text-white sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 md:pb-4 lg:px-16">
      <Link to="/" className="flex w-fit items-center gap-2 text-base font-semibold tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#315cff] text-xs font-bold">H</span>
        HireSync AI
      </Link>

      <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-white/55 sm:gap-x-6">
        <li>
          <Link to="/" className="flex items-center gap-1.5 transition hover:text-white">
            <HomeIcon className="h-3.5 w-3.5" />
            Home
          </Link>
        </li>

        {isLoggedIn ? (
          <>
            {isCompany ? (
              <li>
                <Link to="/dashboard" className="flex items-center gap-1.5 transition hover:text-white">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/jobs" className="flex items-center gap-1.5 transition hover:text-white">
                  <Briefcase className="h-3.5 w-3.5" />
                  Jobs
                </Link>
              </li>
            )}

            <li>
              <Link to="/profile" className="flex items-center gap-1.5 transition hover:text-white">
                <User2 className="h-3.5 w-3.5" />
                Profile
              </Link>
            </li>

            <li>
              <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 transition hover:text-white">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/jobs" className="flex items-center gap-1.5 transition hover:text-white">
                <Briefcase className="h-3.5 w-3.5" />
                Jobs
              </Link>
            </li>

            <li>
              <Link to="/auth" className="rounded-lg bg-[#315cff] px-4 py-2 text-white transition hover:bg-[#4c70ff]">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
