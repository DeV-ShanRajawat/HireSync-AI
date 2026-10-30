
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Initial mock job postings
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      type: 'Full-Time',
      location: 'Remote',
      salary: '$90,000 - $120,000',
      applicants: 18,
      status: 'Active',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Node.js Backend Engineer',
      type: 'Full-Time',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      applicants: 12,
      status: 'Active',
      postedDate: '5 days ago',
    },
    {
      id: 3,
      title: 'UI/UX Product Designer',
      type: 'Contract',
      location: 'Remote',
      salary: '$70,000 - $90,000',
      applicants: 8,
      status: 'Active',
      postedDate: '1 week ago',
    },
  ]);

  // Initial mock applicants
  const [applicants] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Senior Frontend Developer',
      appliedAt: '3 hours ago',
      status: 'Under Review',
      score: '94%',
    },
    {
      id: 2,
      name: 'Sophia Patel',
      role: 'Node.js Backend Engineer',
      appliedAt: 'Yesterday',
      status: 'Shortlisted',
      score: '88%',
    },
    {
      id: 3,
      name: 'Liam Miller',
      role: 'UI/UX Product Designer',
      appliedAt: '2 days ago',
      status: 'Interview Scheduled',
      score: '91%',
    },
  ]);

  // Form state for creating a new job
  const [newJob, setNewJob] = useState({
    title: '',
    location: 'Remote',
    type: 'Full-Time',
    salary: '',
  });

  // Read logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Create a new job
  const handleCreateJob = (e) => {
    e.preventDefault();

    if (!newJob.title) return;

    const job = {
      id: Date.now(),
      title: newJob.title,
      type: newJob.type,
      location: newJob.location || 'Remote',
      salary: newJob.salary || '$80,000 - $110,000',
      applicants: 0,
      status: 'Active',
      postedDate: 'Just now',
    };

    setJobs([job, ...jobs]);

    setNewJob({
      title: '',
      location: 'Remote',
      type: 'Full-Time',
      salary: '',
    });

    setShowPostModal(false);
  };

  // Delete a job
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  // Calculate total applicants across all jobs
  const totalApplicants = jobs.reduce(
    (acc, curr) => acc + curr.applicants,
    0
  );

  return (
    <div>
      {/* Dashboard header */}
      <div>
        <div>
          <p>Company Portal</p>

          <h1>
            {user?.name
              ? `${user.name} Dashboard`
              : 'Employer Dashboard'}
          </h1>

          <p>
            Manage your job openings, evaluate incoming applicants,
            and accelerate hiring.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPostModal(true)}
        >
          Post a New Job
        </button>
      </div>

      {/* Dashboard metrics */}
      <div>
        <div>
          <p>Active Jobs</p>
          <h3>{jobs.length}</h3>
          <p>+2 this month</p>
        </div>

        <div>
          <p>Total Applicants</p>
          <h3>{totalApplicants}</h3>
          <p>Across all listings</p>
        </div>

        <div>
          <p>Shortlisted</p>
          <h3>12</h3>
          <p>High match score</p>
        </div>

        <div>
          <p>Interviews</p>
          <h3>5</h3>
          <p>Next 7 days</p>
        </div>
      </div>

      {/* Posted jobs */}
      <div>
        <div>
          <h2>Your Posted Positions</h2>
          <span>{jobs.length} Active Positions</span>
        </div>

        {jobs.length === 0 ? (
          <div>
            <p>No job postings yet.</p>

            <button
              type="button"
              onClick={() => setShowPostModal(true)}
            >
              Create your first listing
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id}>
              <div>
                <h3>{job.title}</h3>
                <span>{job.status}</span>

                <p>Location: {job.location}</p>
                <p>Employment Type: {job.type}</p>
                <p>Salary: {job.salary}</p>
                <p>Posted {job.postedDate}</p>
              </div>

              <div>
                <span>{job.applicants}</span>
                <p>Applicants</p>

                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  title="Delete Listing"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent applicants */}
      <div>
        <div>
          <h2>Recent Applicants</h2>
          <span>View all</span>
        </div>

        <div>
          {applicants.map((app) => (
            <div key={app.id}>
              <h4>{app.name}</h4>
              <p>{app.role}</p>
              <span>{app.score} match</span>
              <p>{app.appliedAt}</p>
              <p>{app.status}</p>
            </div>
          ))}

          <div>
            <Link to="/jobs">
              Explore Candidate Pool
            </Link>
          </div>
        </div>
      </div>

      {/* Create job modal */}
      {showPostModal && (
        <div>
          <div>
            <button
              type="button"
              onClick={() => setShowPostModal(false)}
            >
              Close
            </button>

            <h3>Create Job Opening</h3>

            <p>
              Publish a new role on JobNest to start receiving applications.
            </p>

            <form onSubmit={handleCreateJob}>
              <div>
                <label htmlFor="jobTitle">Job Title</label>

                <input
                  id="jobTitle"
                  type="text"
                  required
                  placeholder="e.g. React Frontend Engineer"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <div>
                  <label htmlFor="jobType">Employment Type</label>

                  <select
                    id="jobType"
                    value={newJob.type}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="jobLocation">Location</label>

                  <input
                    id="jobLocation"
                    type="text"
                    placeholder="e.g. Remote or San Francisco"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobSalary">
                  Salary Range (Optional)
                </label>

                <input
                  id="jobSalary"
                  type="text"
                  placeholder="e.g. $90,000 - $120,000 / year"
                  value={newJob.salary}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      salary: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
