import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Code,
  Zap,
} from 'lucide-react';

const ResumeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getById(id);
      setResume(response.data);
    } catch (error) {
      alert('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await resumeAPI.analyze(id, jobDescription);
      setAnalysis(response.data);
    } catch (error) {
      alert('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold gradient-text">
                  {resume.full_name}
                </h1>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail className="w-5 h-5" />
                  <span>{resume.email}</span>
                </div>
                {resume.phone && (
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-5 h-5" />
                    <span>{resume.phone}</span>
                  </div>
                )}
                {resume.linkedin_url && (
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Linkedin className="w-5 h-5" />
                    <a
                      href={resume.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>

              {resume.skills && resume.skills.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-slate-800">Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-lg font-medium border border-primary-200"
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {resume.education && resume.education.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-slate-800">Education</h2>
                  </div>
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl"
                      >
                        <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                        <p className="text-slate-600">{edu.school}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {edu.start_date} - {edu.end_date}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {resume.experience && resume.experience.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-slate-800">
                      Experience
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {resume.experience.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl"
                      >
                        <h3 className="font-bold text-slate-800">{exp.role}</h3>
                        <p className="text-slate-600">{exp.company}</p>
                        <p className="text-sm text-slate-500 mb-2">
                          {exp.start_date} - {exp.end_date}
                        </p>
                        {exp.responsibilities && (
                          <p className="text-slate-600 text-sm whitespace-pre-wrap">
                            {exp.responsibilities}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {resume.projects && resume.projects.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <FolderGit2 className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-slate-800">Projects</h2>
                  </div>
                  <div className="space-y-4">
                    {resume.projects.map((proj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl"
                      >
                        <h3 className="font-bold text-slate-800">
                          {proj.project_name}
                        </h3>
                        {proj.project_url && (
                          <a
                            href={proj.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 text-sm hover:underline"
                          >
                            View Project
                          </a>
                        )}
                        {proj.description && (
                          <p className="text-slate-600 text-sm mt-2">
                            {proj.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-2xl p-8 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  AI Analysis
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                  placeholder="Paste the job description here to get AI-powered analysis..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </motion.button>

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6"
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBgColor(
                        analysis.score
                      )} shadow-2xl mb-4`}
                    >
                      <div className="text-center">
                        <div className="text-4xl font-black text-white">
                          {analysis.score}
                        </div>
                        <div className="text-sm font-semibold text-white/90">
                          Score
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-bold text-yellow-900">
                        Missing Keywords
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">
                        Suggestions for Improvement
                      </h3>
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {analysis.suggestions}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailPage;
