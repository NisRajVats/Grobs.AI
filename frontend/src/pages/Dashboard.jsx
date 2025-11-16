import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  Trash2,
  Eye,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data);
    } catch (err) {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    setDeleteLoading(id);
    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeleteLoading(null);
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                My Resumes
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and optimize your professional resumes
              </p>
            </div>

            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Resume</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-3xl p-12 text-center"
          >
            <div className="bg-gradient-to-br from-primary-100 to-accent-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              No Resumes Yet
            </h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start building your professional resume with AI-powered insights and
              optimization
            </p>
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Resume</span>
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-effect rounded-2xl p-6 card-hover group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/resume/${resume.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Resume"
                        >
                          <Eye className="w-5 h-5 text-primary-600" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(resume.id)}
                        disabled={deleteLoading === resume.id}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Resume"
                      >
                        {deleteLoading === resume.id ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5 text-red-500" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {resume.full_name}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {resume.email}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-500">
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span>
                        {resume.experience?.length || 0} Experience
                        {resume.experience?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {resume.education?.length || 0} Education
                        {resume.education?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <Link to={`/resume/${resume.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
