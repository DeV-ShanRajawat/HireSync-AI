import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CircleCheck,
  FileText,
  Gauge,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

export default function Home() {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  const isCompany = user?.type === 'Company';

  return (
    <main className="w-full overflow-hidden text-white">
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-12 sm:px-10 sm:pb-24 md:px-16 md:pt-16 lg:px-20 lg:pb-28">
        <div className="pointer-events-none absolute -right-32 -top-36 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#315cff]/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-48 left-0 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />

        <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium tracking-wide text-white/70 sm:mb-16">
          <Sparkles className="h-3.5 w-3.5 text-[#6685ff]" />
          NEXT-GEN AI HIRING & CAREER PORTAL
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <h1 className="max-w-4xl text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
              Find your next role with{' '}
              <span className="text-[#6382ff]">intelligent</span> AI
              evaluations.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              HireSync AI connects candidates with companies. Apply for jobs,
              complete AI-based assessments, and receive feedback on your
              performance.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#315cff] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#315cff]/20 transition hover:bg-[#4c70ff]"
              >
                Explore Open Jobs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {token ? (
                <Link
                  to={isCompany ? '/dashboard' : '/profile'}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.06]"
                >
                  {isCompany ? 'Company Dashboard' : 'View Profile & Status'}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.06]"
                >
                  Hire or Register
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="mt-11 flex items-center gap-3 text-xs text-white/45">
              <div className="flex -space-x-2">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#111] bg-[#e9b98d] text-sm">👩🏻‍💻</span>
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#111] bg-[#e78a8d] text-sm">👨🏽‍💻</span>
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#111] bg-[#8c9eff] text-sm">👩🏾‍💼</span>
              </div>
              Built for people ready for what’s next
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#191919] p-5 shadow-2xl shadow-black/40 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div>
                  <p className="text-xs text-white/45">Your next opportunity</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">Matched for you</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#315cff]/15 text-[#7892ff]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#202020] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#315cff] text-sm font-bold">A</span>
                    <div>
                      <p className="text-sm font-semibold">Visual Designer</p>
                      <p className="mt-1 text-xs text-white/45">Apex Studio · Remote</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">94% match</span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[11px] text-white/45">
                  <span>AI assessment ready</span>
                  <span className="inline-flex items-center gap-1 text-[#8298ff]">View role <ArrowUpRight className="h-3 w-3" /></span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-[#1d1d1d] p-4">
                  <div className="flex items-center gap-2 text-[10px] text-white/45"><Users className="h-3.5 w-3.5" /> Active talent</div>
                  <p className="mt-3 text-xl font-semibold">2,345</p>
                  <p className="mt-1 text-[10px] text-emerald-300">+12% this month</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-[#1d1d1d] p-4">
                  <div className="flex items-center gap-2 text-[10px] text-white/45"><CircleCheck className="h-3.5 w-3.5" /> Your progress</div>
                  <p className="mt-3 text-xl font-semibold">On track</p>
                  <p className="mt-1 text-[10px] text-[#8298ff]">Profile complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-6 py-16 sm:px-10 md:px-16 md:py-20 lg:px-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">The platform</p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Everything you need in one place</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/50">A platform designed for job seekers and hiring managers.</p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-white/[0.08] bg-[#181818] p-6 transition hover:border-white/20">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#315cff]/15 text-[#8298ff]"><Sparkles className="h-5 w-5" /></span>
            <h3 className="mt-6 text-lg font-semibold">AI Assessment</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">AI-based interview questions and performance feedback.</p>
            <ArrowUpRight className="mt-8 h-4 w-4 text-white/35" />
          </article>
          <article className="rounded-2xl border border-white/[0.08] bg-[#181818] p-6 transition hover:border-white/20">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300"><BriefcaseBusiness className="h-5 w-5" /></span>
            <h3 className="mt-6 text-lg font-semibold">Verified Companies</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">Explore job opportunities posted by companies.</p>
            <ArrowUpRight className="mt-8 h-4 w-4 text-white/35" />
          </article>
          <article className="rounded-2xl border border-white/[0.08] bg-[#181818] p-6 transition hover:border-white/20">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><ArrowDownRight className="h-5 w-5" /></span>
            <h3 className="mt-6 text-lg font-semibold">Fast Decisions</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">Track application status as it changes.</p>
            <ArrowUpRight className="mt-8 h-4 w-4 text-white/35" />
          </article>
        </div>
      </section>

      <section className="grid gap-8 border-t border-white/[0.08] px-6 py-16 sm:px-10 md:grid-cols-2 md:items-center md:px-16 md:py-20 lg:px-20">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">Meet your next interview</p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">Automated AI Pre-Screening &amp; Instant Assessment</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
            Apply for a position and receive interview questions based on the job requirements. Submit your answers to receive feedback on communication, technical depth, and overall suitability.
          </p>
          <Link to="/jobs" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#8298ff] transition hover:text-white">
            Try an application <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#191919] p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#315cff]/15 text-[#8298ff]"><Gauge className="h-5 w-5" /></span>
              <div><h3 className="text-sm font-semibold">Technical Assessment Example</h3><p className="mt-1 text-xs text-white/40">Assessment complete</p></div>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">Selected</span>
          </div>
          <div className="flex items-end justify-between py-6">
            <div><p className="text-xs text-white/45">Overall score</p><p className="mt-1 text-4xl font-semibold tracking-tight">90<span className="text-lg text-white/35">/100</span></p></div>
            <div className="grid h-16 w-16 place-items-center rounded-full border-[5px] border-[#315cff] text-xs font-semibold">90%</div>
          </div>
          <div className="space-y-4 border-t border-white/[0.08] pt-5">
            <div><div className="mb-2 flex justify-between text-xs"><span className="text-white/55">Communication</span><span>8/10</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-[#6382ff]" /></div></div>
            <div><div className="mb-2 flex justify-between text-xs"><span className="text-white/55">Technical Depth</span><span>9/10</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[90%] rounded-full bg-[#6382ff]" /></div></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-white/[0.08] px-6 py-16 sm:px-10 md:grid-cols-2 md:px-16 md:py-20 lg:px-20">
        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#181818] p-6 sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#315cff]/15 text-[#8298ff]"><Search className="h-5 w-5" /></span>
          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">Real-Time Application Status</h2>
          <p className="mt-3 text-sm leading-6 text-white/50">Candidates can track whether their applications are Applied, Selected, or Rejected.</p>
          <div className="mt-7 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-xs"><span>Senior React Engineer</span><span className="inline-flex items-center gap-1.5 text-emerald-300"><Check className="h-3.5 w-3.5" /> Selected</span></div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3 text-xs"><span>Node.js Developer</span><span className="text-[#8298ff]">Applied</span></div>
          </div>
          <Link to="/profile" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8298ff] hover:text-white">View Candidate Profile <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#181818] p-6 sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300"><FileText className="h-5 w-5" /></span>
          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">Frictionless Cloud Apply</h2>
          <p className="mt-3 text-sm leading-6 text-white/50">Keep a resume URL or portfolio link available on your profile to simplify job applications.</p>
          <div className="mt-7 rounded-xl border border-white/[0.08] bg-[#202020] p-4">
            <p className="text-xs text-white/40">Resume / Portfolio</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="truncate text-sm">your-portfolio.com</span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-emerald-300"><CircleCheck className="h-3.5 w-3.5" /> Synced with profile</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-6 py-16 sm:px-10 md:px-16 md:py-20 lg:px-20">
        <div className="grid gap-8 rounded-[1.5rem] border border-white/[0.08] bg-[#181818] p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">For teams that are growing</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">For Employers &amp; Organizations</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Companies can publish job openings and review applications from candidates.</p>
          </div>
          <Link to={token && isCompany ? '/dashboard' : '/auth'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#111] transition hover:bg-white/85">
            {token && isCompany ? 'Open Company Dashboard' : 'Get Started'}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-white/[0.08] px-6 py-20 text-center sm:px-10 md:py-24">
        <div className="pointer-events-none absolute inset-x-1/4 top-0 -z-10 h-56 rounded-full bg-[#315cff]/20 blur-[90px]" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#8298ff]">Your next chapter starts here</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">Ready to take the next step?</h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/50">Explore opportunities or create an account to get started.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-[#315cff] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4c70ff]">Browse Jobs <ArrowRight className="h-4 w-4" /></Link>
          {!token && <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.06]">Create Account <ArrowUpRight className="h-4 w-4" /></Link>}
        </div>
      </section>
    </main>
  );
}
