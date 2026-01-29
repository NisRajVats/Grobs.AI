import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UploadResumePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('grobs-ai-token');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a PDF file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('http://127.0.0.1:8000/resume/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess('Resume uploaded and parsed successfully!');
      setFile(null);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-purple-950 to-slate-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="block bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upload Your Resume
            </span>
          </h1>
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
            Upload a PDF resume and let our AI parser extract and structure your information automatically.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
          
          <div className="relative rounded-3xl bg-linear-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/20 p-8 shadow-2xl">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-purple-500/30 hover:border-purple-500/50 bg-slate-700/20'
              }`}
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-40"></div>
                    <div className="relative w-20 h-20 bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl">
                      📄
                    </div>
                  </div>
                </div>

                {/* Text */}
                {file ? (
                  <div>
                    <p className="text-2xl font-bold text-cyan-300 mb-2">File Selected</p>
                    <p className="text-purple-200/70 text-lg">{file.name}</p>
                    <p className="text-purple-300/50 text-sm mt-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {isDragging ? 'Drop your resume here' : 'Drag & drop your resume here'}
                    </p>
                    <p className="text-purple-200/70">or click to browse</p>
                  </div>
                )}

                {/* File Input */}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-block mt-4 px-6 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 cursor-pointer transition-all duration-300"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                file && !isLoading
                  ? 'bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 cursor-pointer'
                  : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Parsing Resume...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload & Parse Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '⚡', title: 'Fast Parsing', desc: 'AI-powered extraction in seconds' },
            { icon: '🎯', title: 'Accurate', desc: 'Intelligent data structuring' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is encrypted' }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-800/40 border border-purple-500/20 p-6 text-center hover:border-purple-500/40 transition-all duration-300">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-purple-200/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
