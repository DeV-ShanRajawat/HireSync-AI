
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Jobs() {
  const navigate = useNavigate();

  // Job data states
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Resume modal states
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [resumeUrlInput, setResumeUrlInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  // AI interview states
  const [interviewRunning, setInterviewRunning] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [notification, setNotification] = useState(null);

  // Fetch jobs from backend
  const getAllJobs = async () => {
    setIsLoading(true);

    try {
      const params = {};

      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      if (selectedType) {
        params.type = selectedType;
      }

      if (selectedWorkMode) {
        params.workMode = selectedWorkMode;
      }

      if (selectedLocation.trim()) {
        params.location = selectedLocation.trim();
      }

      const res = await axios.get(`${BaseUrl}/job`, { params });

      if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
        setTotalCount(res.data.count ?? res.data.jobs.length);
      } else {
        setJobs([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [selectedType, selectedWorkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    getAllJobs();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedWorkMode('');
    setSelectedLocation('');
    getAllJobs();
  };

  // Start job application process
  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/auth');
      return;
    }

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    if (user?.type === 'Company') {
      alert('Companies cannot apply for jobs. Please log in with a Candidate account.');
      return;
    }

    const candidateResume = user?.resume || '';

    if (!candidateResume) {
      setSelectedJobForApply(job);
      setResumeUrlInput('');
      setApplyError('');
      setShowResumeModal(true);
    } else {
      executeApply(job._id, candidateResume);
    }
  };

  // Submit application to backend
  const executeApply = async (jobId, resume) => {
    setIsApplying(true);
    setApplyError('');

    const token = localStorage.getItem('token');

    try {
      const result = await axios.post(
        `${BaseUrl}/application`,
        { jobId, resume },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setShowResumeModal(false);

      if (result.data?.interviewSet) {
        let interviewPayload = result.data.interviewSet;

        if (typeof interviewPayload === 'string') {
          try {
            interviewPayload = JSON.parse(interviewPayload);
          } catch {
            // Keep the original string if parsing fails
          }
        }

        if (result.data?.application?._id) {
          setCurrentApplicationId(result.data.application._id);
        }

        setInterviewData(interviewPayload);
        setInterviewRunning(true);
        setAnswers({});
        setSubmittedAnswers(false);
      } else {
        setNotification('Application submitted successfully!');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to submit application. Please try again.';

      setApplyError(message);
      alert(message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (!resumeUrlInput.trim()) {
      setApplyError('Please enter a valid resume URL or portfolio link.');
      return;
    }

    if (selectedJobForApply) {
      executeApply(
        selectedJobForApply._id,
        resumeUrlInput.trim()
      );
    }
  };

  // Store an answer for a particular interview question
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Submit interview answers for AI evaluation
  const handleCompleteInterview = async () => {
    setIsEvaluating(true);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${BaseUrl}/application/feadback`,
        {
          applicationId: currentApplicationId,
          interviewQuestions:
            interviewData.questions || interviewData,
          userAnswered: answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const feedback =
        response.data?.feedback ||
        response.data?.answer ||
        response.data;

      setFeedbackData(feedback);
      setSubmittedAnswers(true);
    } catch (error) {
      console.error(error);
      alert('Failed to evaluate interview answers. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const closeInterview = () => {
    setInterviewRunning(false);
    setInterviewData(null);
    setCurrentApplicationId(null);
    setFeedbackData(null);
    setSubmittedAnswers(false);
    setAnswers({});
    setNotification(
      'Interview session completed and saved with your application!'
    );
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive';

    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}/yr`;
    }

    return salary;
  };

  // Format job posting date
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return 'Recently';

    const diff = Math.floor(
      (new Date() - date) / (1000 * 60 * 60 * 24)
    );

    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="w-full space-y-8 px-5 py-8 text-white sm:px-8 md:px-12 md:py-12 lg:px-16">
      <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">Find your next opportunity</p>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Explore Jobs</h1>
        </div>
        <p className="text-sm text-white/45">Discover roles that move your career forward.</p>
      </header>

      {notification && (
        <section className="flex items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200">
          <p>{notification}</p>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-200/10"
          >
            Dismiss
          </button>
        </section>
      )}

      {interviewRunning && interviewData ? (
        <section className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#181818] p-5 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">AI interview</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {interviewData.greetings || 'AI Candidate Interview'}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/50">
            {interviewData.interviewDesc ||
              'Complete the interview questions for this role.'}
          </p>

          {(interviewData.questions || interviewData).map?.(
            (question, index) => (
              <div key={index} className="mt-6 rounded-xl border border-white/[0.08] bg-[#202020] p-4">
                <p className="text-sm font-medium leading-6">
                  {typeof question === 'string'
                    ? question
                    : question.question || question.text}
                </p>

                <textarea
                  value={answers[index] || ''}
                  onChange={(e) =>
                    handleAnswerChange(index, e.target.value)
                  }
                  placeholder="Write your answer"
                  className="mt-4 min-h-32 w-full resize-y rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
                />
              </div>
            )
          )}

          {submittedAnswers ? (
            <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#202020] p-4">
              <h3 className="text-lg font-semibold">Interview Feedback</h3>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-white/70">
                {typeof feedbackData === 'string'
                  ? feedbackData
                  : JSON.stringify(feedbackData, null, 2)}
              </pre>
            </section>
          ) : (
            <button
              type="button"
              onClick={handleCompleteInterview}
              disabled={isEvaluating}
              className="mt-6 rounded-xl bg-[#315cff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4c70ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEvaluating ? 'Evaluating...' : 'Submit Answers'}
            </button>
          )}

          <button type="button" onClick={closeInterview} className="ml-3 mt-6 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06]">
            Close Interview
          </button>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-white/[0.08] bg-[#181818] p-5 sm:p-7">
            <h2 className="text-lg font-semibold tracking-tight">Search and Filter Jobs</h2>

            <form onSubmit={handleSearchSubmit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
              <label className="block text-xs font-medium text-white/55">
                Search by keyword
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title or keyword"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
                />
              </label>

              <label className="block text-xs font-medium text-white/55">
                Job type
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#6382ff]"
                >
                  <option value="">All types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-white/55">
                Work mode
                <select
                  value={selectedWorkMode}
                  onChange={(e) =>
                    setSelectedWorkMode(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#6382ff]"
                >
                  <option value="">All work modes</option>
                  <option value="Work From Home">Work From Home</option>
                  <option value="On Site">On Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-white/55">
                Location
                <input
                  value={selectedLocation}
                  onChange={(e) =>
                    setSelectedLocation(e.target.value)
                  }
                  placeholder="Enter location"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
                />
              </label>

              <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                <button type="submit" className="rounded-xl bg-[#315cff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4c70ff]">
                  Search
                </button>

                <button type="button" onClick={resetFilters} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06]">
                  Clear Filters
                </button>
              </div>
            </form>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Available Jobs <span className="text-white/40">({totalCount})</span></h2>
            </div>

            {isLoading ? (
              <p className="rounded-2xl border border-white/[0.08] bg-[#181818] px-5 py-10 text-center text-sm text-white/50">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="rounded-2xl border border-white/[0.08] bg-[#181818] px-5 py-10 text-center text-sm text-white/50">No jobs found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => {
                const isApplied = appliedJobIds.has(job._id);
                const companyName =
                  job.company?.name || 'Top Company';

                return (
                  <article key={job._id} className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#181818] p-5 transition hover:border-white/20 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight">{job.title}</h3>
                        <p className="mt-1 text-sm text-white/50">{companyName}</p>
                      </div>
                      {isApplied && <span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">Applied</span>}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/65">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1.5">{job.location}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1.5">{job.type}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1.5">{job.workMode || 'On Site'}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#9cafFF]">{formatSalary(job.salary)}</p>
                    <p className="mt-1 text-xs text-white/40">Posted {formatRelativeTime(job.createdAt)}</p>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/50">{job.description}</p>

                    {!isApplied && (
                      <button
                        type="button"
                        onClick={() => handleApplyClick(job)}
                        className="mt-6 w-fit rounded-xl bg-[#315cff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c70ff]"
                      >
                        Apply Now
                      </button>
                    )}
                  </article>
                );
              })
              }
              </div>
            )}
          </section>
        </>
      )}

      {showResumeModal && (
        <section className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Provide Your Resume</h2>

          <p className="mt-2 text-sm text-white/50">
            Applying for: {selectedJobForApply?.title}
          </p>

          {applyError && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">{applyError}</p>}

          <form onSubmit={handleModalSubmit} className="mt-6">
            <label className="block text-xs font-medium text-white/55">
              Resume / Portfolio URL
              <input
                type="url"
                required
                value={resumeUrlInput}
                onChange={(e) =>
                  setResumeUrlInput(e.target.value)
                }
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6382ff]"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => {
              setShowResumeModal(false);
              setApplyError('');
            }} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06]">
              Cancel
            </button>

            <button type="submit" disabled={isApplying} className="rounded-xl bg-[#315cff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4c70ff] disabled:cursor-not-allowed disabled:opacity-50">
              {isApplying ? 'Submitting...' : 'Confirm & Apply'}
            </button>
            </div>
          </form>
          </div>
        </section>
      )}
    </main>
  );
}
