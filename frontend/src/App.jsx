import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Page Imports
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateResumePage from './pages/CreateResumePage';
import PrintResumePage from './pages/PrintResumePage';
import AnalyzeResumePage from './pages/AnalyzeResumePage';
import EditResumePage from './pages/EditResumePage';

// Component Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Navigation Component (Dark & Beautiful) ---
function Navigation() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => { auth.logout(); navigate('/login'); };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border-b border-purple-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-black text-xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  G
                </span>
              </div>
              <div>
                <span className="block text-2xl font-black bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GROBS.AI
                </span>
                <span className="block text-xs text-purple-400 font-medium -mt-1">Resume Intelligence</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {auth.isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="relative overflow-hidden group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-r from-rose-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="relative">Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="relative inline-flex items-center rounded-2xl px-6 py-3 text-sm font-bold text-purple-300 hover:text-white transition-all duration-300 hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-purple-500/30"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="relative overflow-hidden group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Get Started</span>
                  <svg className="relative w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- HomePage Component (Dark Dashboard) ---
function HomePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const token = localStorage.getItem('grobs-ai-token');

  useEffect(() => {
    const fetchResumes = async () => {
      if (!token) {
        auth.logout(); navigate('/login'); return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/resumes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        if (error.response?.status === 401) {
          alert("Session expired."); auth.logout(); navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [auth, navigate, token]);

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      await axios.delete(
        `http://127.0.0.1:8000/resume/${resumeId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert("Could not delete resume.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-purple-950 to-slate-900 pt-20 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-size-[72px_72px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AI-Powered Resume Platform
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6">
            <span className="block bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Resume
            </span>
            <span className="block bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          
          <p className="text-xl text-purple-200/70 max-w-3xl mx-auto leading-relaxed">
            Create, analyze, and perfect your resumes with cutting-edge AI technology.
            <span className="block text-cyan-300/60 text-base mt-2">Stand out from the crowd with intelligent insights.</span>
          </p>
        </div>

        {/* CTA Section */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between p-8 rounded-3xl bg-linear-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-3xl font-black mb-2 bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Ready to Create Magic? ✨
              </h2>
              <p className="text-purple-200/70 text-lg">Build a professional resume that commands attention</p>
            </div>
            <Link 
              to="/create-resume" 
              className="relative overflow-hidden group inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-black shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="relative">Create New Resume</span>
              <div className="relative w-2 h-2 rounded-full bg-white animate-ping"></div>
            </Link>
          </div>
        </div>

        {/* Resumes Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black bg-linear-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                Your Resumes
              </h2>
              <p className="text-purple-300/60">Manage and optimize your professional profiles</p>
            </div>
            <div className="text-sm font-bold bg-linear-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-500/30 text-purple-200 shadow-lg">
              {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-cyan-400 border-r-purple-400"></div>
              </div>
              <p className="mt-6 text-purple-300/70 font-semibold">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative text-center py-24 rounded-3xl bg-linear-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-28 h-28 bg-linear-to-r from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center border border-purple-500/30">
                    <svg className="w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3 bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  No Resumes Yet
                </h3>
                <p className="text-purple-200/70 mb-8 text-lg max-w-md mx-auto">
                  Start your journey by creating your first professional resume
                </p>
                <Link 
                  to="/create-resume" 
                  className="inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-8 py-4 text-base font-black shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Resume
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume, index) => (
                <div 
                  key={resume.id}
                  onMouseEnter={() => setHoveredCard(resume.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative rounded-3xl overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Animated Border */}
                  <div className={`absolute inset-0 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl transition-all duration-500 ${
                    hoveredCard === resume.id ? 'opacity-60' : 'opacity-0'
                  }`}></div>
                  
                  {/* Card Content */}
                  <div className="relative rounded-3xl bg-linear-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-purple-500/20 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2">
                    {/* Header with Avatar */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black text-white mb-1 truncate">{resume.full_name}</h3>
                        <p className="text-purple-300/70 text-sm truncate">{resume.email}</p>
                      </div>
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-2xl blur-md opacity-50"></div>
                        <div className="relative w-12 h-12 bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {resume.full_name?.charAt(0) || 'U'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Row 1 */}
                    <div className="flex gap-2 mb-2">
                      <Link 
                        to="/print-preview" 
                        state={{ resume: resume }} 
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-4 py-3 text-sm font-bold border border-purple-500/20 hover:border-purple-500/40 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-300 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                        </svg>
                        Print
                      </Link>
                      <Link 
                        to={`/resume/${resume.id}/analyze`} 
                        state={{ resume: resume }} 
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-300 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analyze
                      </Link>
                    </div>

                    {/* Action Buttons - Row 2 */}
                    <div className="flex gap-2">
                      <Link 
                        to={`/edit-resume/${resume.id}`} 
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all duration-300 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(resume.id)} 
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all duration-300 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// --- App Component (Main Router) ---
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-resume" element={<CreateResumePage />} />
            <Route path="/print-preview" element={<PrintResumePage />} />
            <Route path="/resume/:resumeId/analyze" element={<AnalyzeResumePage />} />
            <Route path="/edit-resume/:resumeId" element={<EditResumePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;