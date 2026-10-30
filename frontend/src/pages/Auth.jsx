
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Check, Sparkles } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();

  // Login or signup tab
  const [activeTab, setActiveTab] = useState('login');

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form data
  const [signUpData, setSignUpData] = useState({
    name: '',
    type: 'Candidate',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const [loading, setLoading] = useState(false);

  // Login handler
  async function handleLogin(e) {
    e.preventDefault();

    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        loginData
      );

      setMessage({
        type: 'success',
        text: 'Login successful!',
      });

      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
      }

      if (res.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(res.data.user)
        );
      }

      setTimeout(() => {
        if (res.data.user?.type === 'Company') {
          navigate('/dashboard');
        } else {
          navigate('/jobs');
        }
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';

      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  }

  // Signup handler
  async function handleSignUp(e) {
    e.preventDefault();

    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/auth/register',
        signUpData
      );

      setMessage({
        type: 'success',
        text: 'Account created! Please log in.',
      });

      setSignUpData({
        name: '',
        type: 'Candidate',
        email: '',
        password: '',
      });

      setTimeout(() => {
        setActiveTab('login');
        setMessage({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Registration failed. Please try again.';

      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-5 py-10 text-white sm:px-8 md:grid-cols-2 md:px-12 lg:gap-20 lg:px-16">
      <section className="hidden md:block">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium tracking-wide text-white/60">
          <Sparkles className="h-3.5 w-3.5 text-[#8298ff]" />
          YOUR NEXT CHAPTER STARTS HERE
        </div>
        <h1 className="mt-7 max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.065em] lg:text-6xl">
          Great careers begin with a <span className="text-[#6382ff]">better match.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/50">
          Find opportunities that fit your skills, or meet talented people ready to make an impact.
        </p>
        <div className="mt-9 space-y-4">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#315cff]/15 text-[#8298ff]"><Check className="h-3.5 w-3.5" /></span>
            AI-powered candidate assessments
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#315cff]/15 text-[#8298ff]"><Check className="h-3.5 w-3.5" /></span>
            Opportunities from growing companies
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#315cff]/15 text-[#8298ff]"><Check className="h-3.5 w-3.5" /></span>
            Clear updates at every step
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#181818] p-5 shadow-2xl shadow-black/20 sm:p-8">
        <div className="mb-7 flex items-center gap-3 md:hidden">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#315cff]/15 text-[#8298ff]"><BriefcaseBusiness className="h-5 w-5" /></span>
          <span className="text-sm font-semibold">HireSync AI</span>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">
          {activeTab === 'login' ? 'Welcome back' : 'Get started'}
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.05em]">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/45">
          {activeTab === 'login'
            ? 'Sign in to access your HireSync AI account'
            : 'Register today to explore job opportunities'}
        </p>

        <div className="mt-7 grid grid-cols-2 rounded-xl border border-white/[0.08] bg-[#111111] p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setMessage({ type: '', text: '' });
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'login' ? 'bg-[#252525] text-white shadow-sm' : 'text-white/45 hover:text-white'}`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setMessage({ type: '', text: '' });
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'signup' ? 'bg-[#252525] text-white shadow-sm' : 'text-white/45 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        {message.text && (
          <div className={`mt-5 rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200' : 'border-red-300/20 bg-red-300/[0.07] text-red-200'}`}>
            <p>{message.text}</p>
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </div>

            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#315cff] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4c70ff] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Account Type</label>
              <select
                value={signUpData.type}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6382ff]"
              >
                <option value="Candidate">Candidate (Job Seeker)</option>
                <option value="Company">Company (Employer)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter full name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-white/65">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </div>

            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#315cff] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4c70ff] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/45">
          {activeTab === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setMessage({ type: '', text: '' });
                }}
                className="font-semibold text-[#9cafFF] transition hover:text-white"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setMessage({ type: '', text: '' });
                }}
                className="font-semibold text-[#9cafFF] transition hover:text-white"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  );
}
