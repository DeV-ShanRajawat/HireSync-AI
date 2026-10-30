
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500';

export default function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Candidate applications state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  // Fetch jobs applied for by the candidate
  const fetchApplications = async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    setAppsLoading(true);

    try {
      const res = await axios.get(`${BaseUrl}/application/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.applications) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to fetch candidate applications:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  // Load user data when the component mounts
  useEffect(() => {
    const rawUser = localStorage.getItem('user');

    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        setUserData(parsed);

        if (parsed.type !== 'Company') {
          fetchApplications();
        }
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }

    setLoading(false);
  }, []);

  // Format application date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Display application status
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">Selected</span>;

      case 'Rejected':
        return <span className="inline-flex rounded-full bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300">Rejected</span>;

      case 'Applied':
      default:
        return <span className="inline-flex rounded-full bg-[#6382ff]/10 px-3 py-1 text-xs font-medium text-[#9cafFF]">Applied</span>;
    }
  };

  // Loading state
  if (loading) {
    return <div className="w-full px-6 py-16 text-center text-sm text-white/55">Loading profile...</div>;
  }

  // User is not logged in or user data is missing
  if (!userData) {
    return (
      <div className="w-full px-6 py-16 text-center text-white sm:px-10">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#315cff]/15 text-[#8298ff]">?</span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">No Profile Found</h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/50">
          You must be logged in to view your profile and manage your account.
        </p>

        <Link to="/auth" className="mt-6 inline-flex rounded-xl bg-[#315cff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4c70ff]">Go to Login</Link>
      </div>
    );
  }

  const isCompany = userData.type === 'Company';

  const userInitial = userData.name
    ? userData.name.charAt(0).toUpperCase()
    : 'U';

  return (
    <main className="w-full space-y-7 px-5 py-7 text-white sm:px-8 md:px-12 md:py-10 lg:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <Link to="/" className="text-sm font-medium text-white/55 transition hover:text-white">← Back to Home</Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Active Session
        </span>
      </div>

      {/* Profile information */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#181818]">
        <div className="flex flex-col gap-5 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:p-7">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#315cff] text-3xl font-semibold text-white">{userInitial}</div>
          )}

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">Your account</p>
            <h1 className="truncate text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{userData.name}</h1>

            <p className="mt-1 text-sm text-white/50">
              {isCompany ? 'Hiring Organization' : 'Job Seeker'}
            </p>
          </div>

          <div className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">
            {userData.type || 'Candidate'}
          </div>
        </div>

        {/* User details */}
        <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
          <div className="bg-[#181818] p-5 sm:p-6">
            <h3 className="text-xs font-medium text-white/40">Email Address</h3>
            <p className="mt-2 break-all text-sm font-medium text-white/85">{userData.email}</p>
          </div>

          <div className="bg-[#181818] p-5 sm:p-6">
            <h3 className="text-xs font-medium text-white/40">Account Role</h3>
            <p className="mt-2 text-sm font-medium text-white/85">
              {userData.type === 'Company'
                ? 'Employer / Company'
                : 'Individual Candidate'}
            </p>
          </div>

          <div className="bg-[#181818] p-5 sm:p-6">
            <h3 className="text-xs font-medium text-white/40">Account Status</h3>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Verified &amp; Active</p>
          </div>

          <div className="bg-[#181818] p-5 sm:p-6">
            <h3 className="text-xs font-medium text-white/40">Platform Access</h3>
            <p className="mt-2 text-sm font-medium text-white/85">Full Access</p>
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-white/45">Manage your JobNest preferences and session</p>

          <button type="button" onClick={handleLogout} className="w-fit rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10">
            Sign Out
          </button>
        </div>
      </section>

      {/* Show applications only for candidates */}
      {!isCompany && (
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#181818]">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">Your activity</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">Applied Jobs</h2>

              <p className="mt-2 text-sm text-white/45">
              Status of your submitted applications and interview results
              </p>
            </div>

            <span className="w-fit rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/65">
              {applications.length} Applications
            </span>
          </div>

          {appsLoading ? (
            <div className="px-5 py-12 text-center text-sm text-white/50">Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div className="px-5 py-12 text-center sm:px-8">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#315cff]/15 text-[#8298ff]">↗</span>
              <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
                You haven't applied to any roles yet. Browse open jobs and
                submit your profile.
              </p>

              <Link to="/jobs" className="mt-5 inline-flex rounded-xl bg-[#315cff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4c70ff]">Explore Open Jobs</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-medium text-white/40 sm:px-6">Job Title &amp; Company</th>
                    <th className="px-5 py-4 text-xs font-medium text-white/40">Location &amp; Mode</th>
                    <th className="px-5 py-4 text-xs font-medium text-white/40">Applied Date</th>
                    <th className="px-5 py-4 text-xs font-medium text-white/40">Resume</th>
                    <th className="px-5 py-4 text-xs font-medium text-white/40">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {applications.map((app) => (
                    <tr key={app._id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4 sm:px-6">
                        <p className="text-sm font-medium text-white/85">
                          {app.jobId?.title || 'Job Position'}
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                          {app.jobId?.company?.name || 'Company'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-white/75">
                          {app.jobId?.location || 'Remote'}
                        </p>

                        <span className="mt-1 inline-block text-xs text-white/40">
                          {app.jobId?.type || 'Full Time'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-white/60">{formatDate(app.createdAt)}</td>

                      <td className="px-5 py-4">
                        {app.resume ? (
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-[#9cafFF] transition hover:text-white"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-sm text-white/35">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">{renderStatusBadge(app.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
