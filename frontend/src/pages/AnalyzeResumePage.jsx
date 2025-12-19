import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Download, 
  Edit3,
  Target,
  BarChart3,
  Clock,
  Zap,
  Shield,
  RefreshCw,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Star,
  ChevronRight,
  Lightbulb,
  Users,
  ArrowRight,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  Globe,
  Moon,
  Sun,
  BarChart,
  Cpu,
  Target as TargetIcon,
  Award,
  Rocket,
  Clock as ClockIcon,
  PieChart,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Briefcase as BriefcaseIcon,
  Users as UsersIcon
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';

// Enhanced Design System with Dark Mode Support
const DESIGN_SYSTEM = {
  colors: {
    primary: {
      light: '#4A6FFF',
      dark: '#5B7FFF',
      gradient: 'linear-gradient(135deg, #4A6FFF 0%, #7B4FFF 100%)',
    },
    secondary: {
      light: '#2DD4BF',
      dark: '#22D3A9',
      gradient: 'linear-gradient(135deg, #2DD4BF 0%, #22D3A9 100%)',
    },
    accent: {
      light: '#FF6B8B',
      dark: '#FF5A78',
      gradient: 'linear-gradient(135deg, #FF6B8B 0%, #FF8E53 100%)',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: {
      light: '#F8FAFC',
      dark: '#0F172A',
    },
    surface: {
      light: '#FFFFFF',
      dark: '#1E293B',
    },
    text: {
      primary: {
        light: '#1E293B',
        dark: '#F1F5F9',
      },
      secondary: {
        light: '#64748B',
        dark: '#94A3B8',
      },
      tertiary: {
        light: '#94A3B8',
        dark: '#64748B',
      }
    },
    border: {
      light: '#E2E8F0',
      dark: '#334155',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.08)',
      dark: 'rgba(0, 0, 0, 0.3)',
    },
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px -1px rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.12), 0 10px 10px -5px rgba(0,0,0,0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.5rem',
    h4: '1.25rem',
    h5: '1.125rem',
    body: '0.875rem',
    small: '0.75rem',
  },
};

// Custom Hooks
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

const useScrollAnimation = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return [ref, controls];
};

// Enhanced Reusable Components
const Card = ({ children, hoverable = false, glass = false, ...props }) => {
  const [isDarkMode] = useDarkMode();
  
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      style={{
        background: glass 
          ? isDarkMode 
            ? 'rgba(30, 41, 59, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)'
          : isDarkMode ? DESIGN_SYSTEM.colors.surface.dark : DESIGN_SYSTEM.colors.surface.light,
        borderRadius: DESIGN_SYSTEM.borderRadius.lg,
        boxShadow: glass 
          ? '0 8px 32px rgba(0, 0, 0, 0.1)'
          : isDarkMode ? DESIGN_SYSTEM.shadows.lg : DESIGN_SYSTEM.shadows.lg,
        padding: DESIGN_SYSTEM.spacing.xl,
        backdropFilter: glass ? 'blur(10px)' : 'none',
        border: glass 
          ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
          : `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
        position: 'relative',
        overflow: 'hidden',
        ...props.style,
      }}
      {...props}
    >
      {glass && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light}, transparent)`,
        }} />
      )}
      {children}
    </motion.div>
  );
};

const Button = ({ children, variant = 'primary', icon: Icon, loading, size = 'md', fullWidth = false, ...props }) => {
  const [isDarkMode] = useDarkMode();
  
  const variants = {
    primary: {
      background: DESIGN_SYSTEM.colors.primary.gradient,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: `0 4px 20px ${isDarkMode ? 'rgba(74, 111, 255, 0.3)' : 'rgba(74, 111, 255, 0.2)'}`,
    },
    secondary: {
      background: DESIGN_SYSTEM.colors.secondary.gradient,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: `0 4px 20px ${isDarkMode ? 'rgba(45, 212, 191, 0.3)' : 'rgba(45, 212, 191, 0.2)'}`,
    },
    accent: {
      background: DESIGN_SYSTEM.colors.accent.gradient,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: `0 4px 20px ${isDarkMode ? 'rgba(255, 107, 139, 0.3)' : 'rgba(255, 107, 139, 0.2)'}`,
    },
    outline: {
      background: 'transparent',
      color: isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light,
      border: `2px solid ${isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light}`,
    },
    ghost: {
      background: 'transparent',
      color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
      border: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
    },
    success: {
      background: DESIGN_SYSTEM.colors.success,
      color: '#FFFFFF',
      border: 'none',
    },
    warning: {
      background: DESIGN_SYSTEM.colors.warning,
      color: '#FFFFFF',
      border: 'none',
    },
    glass: {
      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
      color: isDarkMode ? '#FFFFFF' : DESIGN_SYSTEM.colors.text.primary.light,
      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
      backdropFilter: 'blur(10px)',
    },
  };

  const sizes = {
    sm: { padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`, fontSize: '0.75rem' },
    md: { padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`, fontSize: '0.875rem' },
    lg: { padding: `${DESIGN_SYSTEM.spacing.md} ${DESIGN_SYSTEM.spacing.xl}`, fontSize: '1rem' },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      style={{
        ...sizes[size],
        borderRadius: DESIGN_SYSTEM.borderRadius.md,
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: DESIGN_SYSTEM.animations.transition,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Icon ? DESIGN_SYSTEM.spacing.sm : '0',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        opacity: loading ? 0.7 : 1,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        ...variants[variant],
      }}
      {...props}
    >
      {loading ? (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />
      ) : null}
      {children}
      <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        opacity: 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />
    </motion.button>
  );
};

// Enhanced Progress Circle with Animation
const ProgressCircle = ({ score, size = 120, animated = true }) => {
  const [isDarkMode] = useDarkMode();
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayScore(score);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 80) return DESIGN_SYSTEM.colors.success;
    if (score >= 60) return DESIGN_SYSTEM.colors.secondary.light;
    if (score >= 40) return DESIGN_SYSTEM.colors.warning;
    return DESIGN_SYSTEM.colors.error;
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'relative', width: size, height: size }}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}
          strokeWidth="8"
          fill="none"
          opacity="0.3"
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`progress-gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getScoreColor(score)} />
            <stop offset="100%" stopColor={getScoreColor(score + 20)} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#progress-gradient-${score})`}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ 
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 8px rgba(74, 111, 255, 0.3))'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          {displayScore.toFixed(0)}
          <span style={{ fontSize: '1rem', opacity: 0.7 }}>%</span>
        </motion.div>
        <div style={{
          fontSize: '0.75rem',
          color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginTop: DESIGN_SYSTEM.spacing.xs,
        }}>
          Match Score
        </div>
      </div>
    </motion.div>
  );
};

// Floating Action Button
const Fab = ({ icon: Icon, onClick, variant = 'primary', ...props }) => {
  const [isDarkMode] = useDarkMode();
  
  const variants = {
    primary: {
      background: DESIGN_SYSTEM.colors.primary.gradient,
      color: '#FFFFFF',
    },
    secondary: {
      background: DESIGN_SYSTEM.colors.secondary.gradient,
      color: '#FFFFFF',
    },
    accent: {
      background: DESIGN_SYSTEM.colors.accent.gradient,
      color: '#FFFFFF',
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: DESIGN_SYSTEM.spacing.xl,
        right: DESIGN_SYSTEM.spacing.xl,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`,
        ...variants[variant],
        ...props.style,
      }}
      {...props}
    >
      <Icon size={24} />
    </motion.button>
  );
};

// Enhanced Resume Preview Component
function ResumePreview({ resume }) {
  const [isDarkMode] = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);

  const getResumeStats = () => {
    return {
      education: resume.education?.length || 0,
      experience: resume.experience?.length || 0,
      projects: resume.projects?.length || 0,
      skills: resume.skills?.length || 0,
    };
  };

  const stats = getResumeStats();

  return (
    <Card hoverable glass style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: DESIGN_SYSTEM.spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}>
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '48px',
              height: '48px',
              background: `linear-gradient(135deg, ${isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light}20, ${isDarkMode ? DESIGN_SYSTEM.colors.secondary.dark : DESIGN_SYSTEM.colors.secondary.light}20)`,
              borderRadius: DESIGN_SYSTEM.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: '1px',
              background: isDarkMode ? DESIGN_SYSTEM.colors.surface.dark : DESIGN_SYSTEM.colors.surface.light,
              borderRadius: DESIGN_SYSTEM.borderRadius.md - 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileText size={20} color={isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light} />
            </div>
          </motion.div>
          <div>
            <h3 style={{
              fontSize: DESIGN_SYSTEM.typography.h5,
              fontWeight: '700',
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
              margin: 0,
            }}>
              Resume Preview
            </h3>
            <p style={{
              fontSize: DESIGN_SYSTEM.typography.small,
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
              margin: `${DESIGN_SYSTEM.spacing.xs} 0 0 0`,
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.xs,
            }}>
              <span>{resume.full_name}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{resume.template_name || 'Modern'} Template</span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={isExpanded ? ChevronDown : ChevronRight}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Stats Grid with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: DESIGN_SYSTEM.spacing.sm,
          marginBottom: DESIGN_SYSTEM.spacing.xl,
        }}
      >
        {Object.entries(stats).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: isDarkMode 
                ? `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary.dark}20, ${DESIGN_SYSTEM.colors.secondary.dark}20)`
                : `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary.light}10, ${DESIGN_SYSTEM.colors.secondary.light}10)`,
              borderRadius: DESIGN_SYSTEM.borderRadius.md,
              padding: DESIGN_SYSTEM.spacing.md,
              textAlign: 'center',
              border: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
            }}
          >
            <div style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              background: DESIGN_SYSTEM.colors.primary.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: DESIGN_SYSTEM.spacing.xs,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}>
              {value}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: '600',
            }}>
              {key}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Education Preview */}
            {resume.education.length > 0 && (
              <div style={{ marginBottom: DESIGN_SYSTEM.spacing.lg }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: DESIGN_SYSTEM.spacing.sm, 
                  marginBottom: DESIGN_SYSTEM.spacing.md 
                }}>
                  <div style={{
                    padding: '4px',
                    background: DESIGN_SYSTEM.colors.primary.gradient,
                    borderRadius: '6px',
                  }}>
                    <GraduationCap size={12} color="#FFFFFF" />
                  </div>
                  <h4 style={{
                    fontSize: DESIGN_SYSTEM.typography.h5,
                    fontWeight: '600',
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    margin: 0,
                  }}>
                    Education
                  </h4>
                </div>
                {resume.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      background: isDarkMode 
                        ? `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.surface.dark}, ${DESIGN_SYSTEM.colors.background.dark})`
                        : DESIGN_SYSTEM.colors.background.light,
                      borderRadius: DESIGN_SYSTEM.borderRadius.md,
                      padding: DESIGN_SYSTEM.spacing.md,
                      marginBottom: DESIGN_SYSTEM.spacing.sm,
                      borderLeft: `4px solid ${DESIGN_SYSTEM.colors.primary.light}`,
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: DESIGN_SYSTEM.spacing.xs 
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '700', 
                          color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                          marginBottom: '2px'
                        }}>
                          {edu.degree}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light 
                        }}>
                          {edu.school}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                        background: isDarkMode ? DESIGN_SYSTEM.colors.background.dark : '#F1F5F9',
                        padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                        borderRadius: DESIGN_SYSTEM.borderRadius.full,
                        fontWeight: '500',
                      }}>
                        {edu.start_date} - {edu.end_date || 'Present'}
                      </div>
                    </div>
                    {edu.description && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                        lineHeight: 1.5,
                        marginTop: DESIGN_SYSTEM.spacing.sm,
                      }}>
                        {edu.description}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Skills Preview */}
            {resume.skills.length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: DESIGN_SYSTEM.spacing.sm, 
                  marginBottom: DESIGN_SYSTEM.spacing.md 
                }}>
                  <div style={{
                    padding: '4px',
                    background: DESIGN_SYSTEM.colors.secondary.gradient,
                    borderRadius: '6px',
                  }}>
                    <Zap size={12} color="#FFFFFF" />
                  </div>
                  <h4 style={{
                    fontSize: DESIGN_SYSTEM.typography.h5,
                    fontWeight: '600',
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    margin: 0,
                  }}>
                    Top Skills
                  </h4>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: DESIGN_SYSTEM.spacing.sm,
                  marginBottom: DESIGN_SYSTEM.spacing.lg,
                }}>
                  {resume.skills.slice(0, 12).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, type: 'spring' }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      style={{
                        background: DESIGN_SYSTEM.colors.primary.gradient,
                        color: '#FFFFFF',
                        padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`,
                        borderRadius: DESIGN_SYSTEM.borderRadius.full,
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(74, 111, 255, 0.3)',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Full Resume Button */}
      <div style={{ marginTop: 'auto', paddingTop: DESIGN_SYSTEM.spacing.lg }}>
        <Link 
          to="/print-preview" 
          state={{ resume }}
          style={{ textDecoration: 'none' }}
        >
          <Button 
            variant="outline" 
            fullWidth 
            icon={ExternalLink}
            style={{
              borderColor: isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light,
              color: isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light,
            }}
          >
            View Full Resume
            <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// Enhanced Analysis Results Component
function AnalysisResults({ result, onApplySkills, loading, resume }) {
  const [isDarkMode] = useDarkMode();
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <Card glass style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: DESIGN_SYSTEM.spacing.xxl,
      }}>
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          style={{
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary.gradient})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: DESIGN_SYSTEM.spacing.lg,
          }}
        >
          <BarChart3 size={32} color="#FFFFFF" />
        </motion.div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h4,
          fontWeight: '700',
          color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Ready to Analyze
        </h3>
        <p style={{
          fontSize: DESIGN_SYSTEM.typography.body,
          color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
          maxWidth: '300px',
          lineHeight: 1.6,
        }}>
          Paste a job description and click "Analyze with AI" to see how well your resume matches!
        </p>
      </Card>
    );
  }

  const getScoreLevel = (score) => {
    if (score >= 80) return { 
      label: 'Excellent Match', 
      color: DESIGN_SYSTEM.colors.success, 
      icon: Award,
      gradient: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.success}, #34D399)`
    };
    if (score >= 60) return { 
      label: 'Good Match', 
      color: DESIGN_SYSTEM.colors.secondary.light, 
      icon: TrendingUp,
      gradient: DESIGN_SYSTEM.colors.secondary.gradient
    };
    if (score >= 40) return { 
      label: 'Fair Match', 
      color: DESIGN_SYSTEM.colors.warning, 
      icon: AlertCircle,
      gradient: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.warning}, #FBBF24)`
    };
    return { 
      label: 'Needs Work', 
      color: DESIGN_SYSTEM.colors.error, 
      icon: XCircle,
      gradient: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.error}, #F87171)`
    };
  };

  const scoreLevel = getScoreLevel(result.score);

  const copySuggestions = () => {
    navigator.clipboard.writeText(result.suggestions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card glass style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: DESIGN_SYSTEM.spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 5, repeat: Infinity }
            }}
            style={{
              width: '48px',
              height: '48px',
              background: scoreLevel.gradient,
              borderRadius: DESIGN_SYSTEM.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 25px ${scoreLevel.color}40`,
            }}
          >
            <scoreLevel.icon size={24} color="#FFFFFF" />
          </motion.div>
          <div>
            <h3 style={{
              fontSize: DESIGN_SYSTEM.typography.h5,
              fontWeight: '700',
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
              margin: 0,
            }}>
              AI Analysis Results
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.sm,
              marginTop: DESIGN_SYSTEM.spacing.xs,
              flexWrap: 'wrap',
            }}>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: scoreLevel.color,
                  background: `${scoreLevel.color}15`,
                  padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.full,
                  border: `1px solid ${scoreLevel.color}30`,
                }}
              >
                {scoreLevel.label}
              </motion.span>
              <span style={{
                fontSize: '0.75rem',
                color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <ClockIcon size={12} />
                Just now
              </span>
            </div>
          </div>
        </div>
        <ProgressCircle score={result.score} size={80} />
      </div>

      {/* Missing Keywords Section */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: DESIGN_SYSTEM.spacing.lg }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.sm }}>
              <div style={{
                padding: '6px',
                background: DESIGN_SYSTEM.colors.accent.gradient,
                borderRadius: '8px',
              }}>
                <TargetIcon size={16} color="#FFFFFF" />
              </div>
              <h4 style={{
                fontSize: DESIGN_SYSTEM.typography.h5,
                fontWeight: '600',
                color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                margin: 0,
              }}>
                Missing Keywords
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                  marginLeft: DESIGN_SYSTEM.spacing.xs,
                }}>
                  ({result.missing_keywords.length})
                </span>
              </h4>
            </div>
            <Button
              variant="accent"
              icon={Sparkles}
              onClick={onApplySkills}
              loading={loading}
              size="sm"
            >
              Auto-Apply
            </Button>
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: DESIGN_SYSTEM.spacing.sm,
            marginBottom: DESIGN_SYSTEM.spacing.lg,
            maxHeight: '120px',
            overflowY: 'auto',
            padding: DESIGN_SYSTEM.spacing.sm,
            background: isDarkMode ? DESIGN_SYSTEM.colors.background.dark : '#F8FAFC',
            borderRadius: DESIGN_SYSTEM.borderRadius.md,
            border: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
          }}>
            {result.missing_keywords.map((keyword, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                style={{
                  background: DESIGN_SYSTEM.colors.accent.gradient,
                  color: '#FFFFFF',
                  padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={10} />
                {keyword}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.sm }}>
              <div style={{
                padding: '6px',
                background: DESIGN_SYSTEM.colors.primary.gradient,
                borderRadius: '8px',
              }}>
                <Lightbulb size={16} color="#FFFFFF" />
              </div>
              <h4 style={{
                fontSize: DESIGN_SYSTEM.typography.h5,
                fontWeight: '600',
                color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                margin: 0,
              }}>
                AI Suggestions
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={copied ? CheckCircle : Copy}
              onClick={copySuggestions}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div style={{
            flex: 1,
            background: isDarkMode ? DESIGN_SYSTEM.colors.background.dark : '#F8FAFC',
            borderRadius: DESIGN_SYSTEM.borderRadius.md,
            padding: DESIGN_SYSTEM.spacing.md,
            fontSize: DESIGN_SYSTEM.typography.body,
            lineHeight: 1.6,
            color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
            whiteSpace: 'pre-wrap',
            overflowY: 'auto',
            border: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              opacity: 0.1,
              pointerEvents: 'none',
            }}>
              <Sparkles size={48} />
            </div>
            {result.suggestions}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: DESIGN_SYSTEM.spacing.sm,
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
      }}>
        <Link to="/print-preview" state={{ resume }} style={{ textDecoration: 'none' }}>
          <Button 
            variant="primary" 
            icon={Download}
            fullWidth
          >
            Export PDF
          </Button>
        </Link>
        <Link to="/editor" state={{ resume }} style={{ textDecoration: 'none' }}>
          <Button 
            variant="outline" 
            icon={Edit3}
            fullWidth
          >
            Edit Resume
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// Modern Navigation Component
function Navigation() {
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'Resumes', icon: FileText, path: '/resumes' },
    { label: 'Analyze', icon: BarChart, path: '/analyze', active: true },
    { label: 'Templates', icon: Sparkles, path: '/templates' },
    { label: 'Career Coach', icon: Users, path: '/coach' },
  ];

  const userMenuItems = [
    { label: 'Profile', icon: User },
    { label: 'Settings', icon: Settings },
    { label: 'Help & Support', icon: HelpCircle },
    { label: 'Logout', icon: LogOut, action: () => {
      localStorage.removeItem('grobs-ai-token');
      navigate('/login');
    }},
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: isDarkMode 
            ? 'rgba(15, 23, 42, 0.8)' 
            : 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)'}`,
          padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.xl}`,
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: DESIGN_SYSTEM.spacing.sm,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: DESIGN_SYSTEM.colors.primary.gradient,
              borderRadius: DESIGN_SYSTEM.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={20} color="#FFFFFF" />
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              lineHeight: 1,
            }}>
              <span style={{
                fontWeight: '800',
                fontSize: '1.25rem',
                background: DESIGN_SYSTEM.colors.primary.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Grobs AI
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                fontWeight: '500',
              }}>
                Resume Analyzer
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: DESIGN_SYSTEM.spacing.md,
            '@media (max-width: 768px)': {
              display: 'none',
            }
          }}>
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                style={{
                  padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.md}`,
                  background: item.active ? DESIGN_SYSTEM.colors.primary.gradient : 'transparent',
                  color: item.active ? '#FFFFFF' : (isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light),
                  border: 'none',
                  borderRadius: DESIGN_SYSTEM.borderRadius.md,
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: DESIGN_SYSTEM.spacing.sm,
                  transition: DESIGN_SYSTEM.animations.transition,
                }}
              >
                <item.icon size={16} />
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={20} />
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                background: DESIGN_SYSTEM.colors.error,
                borderRadius: '50%',
                border: `2px solid ${isDarkMode ? DESIGN_SYSTEM.colors.surface.dark : DESIGN_SYSTEM.colors.surface.light}`,
              }} />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_SYSTEM.spacing.sm,
                padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                borderRadius: DESIGN_SYSTEM.borderRadius.full,
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: DESIGN_SYSTEM.colors.primary.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: '#FFFFFF',
                fontSize: '0.875rem',
              }}>
                U
              </div>
              <ChevronDown size={16} />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'none',
                '@media (max-width: 768px)': {
                  display: 'flex',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* User Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: DESIGN_SYSTEM.spacing.xl,
                background: isDarkMode ? DESIGN_SYSTEM.colors.surface.dark : DESIGN_SYSTEM.colors.surface.light,
                borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                boxShadow: isDarkMode ? DESIGN_SYSTEM.shadows.xl : DESIGN_SYSTEM.shadows.xl,
                border: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 1001,
              }}
            >
              {userMenuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)' 
                  }}
                  onClick={item.action || (() => {})}
                  style={{
                    width: '100%',
                    padding: `${DESIGN_SYSTEM.spacing.md} ${DESIGN_SYSTEM.spacing.lg}`,
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: DESIGN_SYSTEM.spacing.sm,
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    borderBottom: index !== userMenuItems.length - 1 
                      ? `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`
                      : 'none',
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              display: 'none',
              '@media (max-width: 768px)': {
                display: 'block',
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Main Component
function AnalyzeResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resume, setResume] = useState(location.state?.resume);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');
  const [isDarkMode] = useDarkMode();
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const token = localStorage.getItem('grobs-ai-token');

  // Update character and word count
  useEffect(() => {
    const chars = jobDescription.length;
    const words = jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
    setCharCount(chars);
    setWordCount(words);
  }, [jobDescription]);

  const handleAnalyzeClick = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    if (!token) {
      setError('You are not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/resume/${resume.id}/analyze`, 
        { text: jobDescription },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setAnalysisResult(response.data);
      setSuccess('Analysis complete! Check your results.');
      setLoading(false);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  const handleApplySkills = async () => {
    if (!analysisResult?.missing_keywords?.length) {
      setError("No skills to apply. Please run an analysis first.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const currentSkillNames = new Set(resume.skills.map(skill => skill.name.toLowerCase()));
    const newSkillsToAdd = analysisResult.missing_keywords
      .filter(keyword => !currentSkillNames.has(keyword.toLowerCase()))
      .map(name => ({ name, id: Date.now() + Math.random() }));

    if (newSkillsToAdd.length === 0) {
      setSuccess("Your skills are already up to date!");
      setLoading(false);
      return;
    }

    const updatedResume = {
      ...resume,
      skills: [...resume.skills, ...newSkillsToAdd]
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/resume/${resume.id}`,
        updatedResume,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setResume(updatedResume);
      setSuccess(`🎉 ${newSkillsToAdd.length} new skill(s) added to your resume!`);
      setLoading(false);

    } catch (err) {
      console.error("Error updating resume:", err);
      setError(err.response?.data?.detail || "Could not save new skills. Please try again.");
      setLoading(false);
    }
  };

  const handleClearAnalysis = () => {
    setAnalysisResult(null);
    setJobDescription('');
    setSuccess('');
    setError('');
  };

  const handleLoadExampleJD = () => {
    const exampleJD = `We are looking for a Senior Full-Stack Developer with expertise in:
• React.js and TypeScript for frontend development
• Node.js and Python for backend services
• AWS cloud infrastructure (Lambda, S3, RDS)
• Microservices architecture and REST APIs
• CI/CD pipelines and DevOps practices
• Experience with Docker and Kubernetes
• Strong problem-solving skills and ability to work in agile teams

Requirements:
- 5+ years of professional experience
- Bachelor's degree in Computer Science or related field
- Experience with testing frameworks (Jest, Cypress)
- Knowledge of database design and optimization
- Excellent communication and teamwork skills`;
    
    setJobDescription(exampleJD);
    setError('');
  };

  const clearJobDescription = () => {
    setJobDescription('');
    setError('');
    setSuccess('');
  };

  if (!resume) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? DESIGN_SYSTEM.colors.background.dark : DESIGN_SYSTEM.colors.background.light,
      fontFamily: DESIGN_SYSTEM.typography.fontFamily,
      transition: DESIGN_SYSTEM.animations.transitionSlow,
    }}>
      <Navigation />

      {/* Hero Section with Parallax Effect */}
      <div style={{
        position: 'relative',
        padding: `${DESIGN_SYSTEM.spacing.xxxl} ${DESIGN_SYSTEM.spacing.xl} ${DESIGN_SYSTEM.spacing.xxl}`,
        marginBottom: DESIGN_SYSTEM.spacing.xl,
        overflow: 'hidden',
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary.dark}10, ${DESIGN_SYSTEM.colors.secondary.dark}10)`
            : `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary.light}05, ${DESIGN_SYSTEM.colors.secondary.light}05)`,
        }}>
          {/* Animated gradient orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle at center, ${
                  i === 0 ? DESIGN_SYSTEM.colors.primary.light :
                  i === 1 ? DESIGN_SYSTEM.colors.secondary.light :
                  DESIGN_SYSTEM.colors.accent.light
                }${isDarkMode ? '10' : '05'}, transparent 70%)`,
                top: `${30 + i * 20}%`,
                left: `${10 + i * 30}%`,
                filter: 'blur(60px)',
              }}
            />
          ))}
        </div>

        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.xl,
              marginBottom: DESIGN_SYSTEM.spacing.xl,
            }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '80px',
                height: '80px',
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.2)',
                borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.3)'}`,
              }}
            >
              <Sparkles size={40} color={isDarkMode ? '#FFFFFF' : DESIGN_SYSTEM.colors.primary.light} />
            </motion.div>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                margin: `0 0 ${DESIGN_SYSTEM.spacing.sm} 0`,
                background: DESIGN_SYSTEM.colors.primary.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}>
                AI Resume Analyzer
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                margin: 0,
                maxWidth: '600px',
                lineHeight: 1.6,
              }}>
                Optimize your resume for any job description using advanced AI analysis and get personalized improvement suggestions
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: DESIGN_SYSTEM.spacing.md,
              '@media (max-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              }
            }}
          >
            {[
              { 
                label: 'Total Skills', 
                value: resume.skills.length,
                icon: ZapIcon,
                color: DESIGN_SYSTEM.colors.primary.light
              },
              { 
                label: 'Experience', 
                value: resume.experience.length,
                icon: BriefcaseIcon,
                color: DESIGN_SYSTEM.colors.secondary.light
              },
              { 
                label: 'Education', 
                value: resume.education.length,
                icon: GraduationCap,
                color: DESIGN_SYSTEM.colors.accent.light
              },
              { 
                label: 'Match Score', 
                value: analysisResult?.score ? `${analysisResult.score.toFixed(0)}%` : '--',
                icon: TrendingUpIcon,
                color: DESIGN_SYSTEM.colors.success
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                style={{
                  background: isDarkMode 
                    ? 'rgba(30, 41, 59, 0.6)' 
                    : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                  padding: DESIGN_SYSTEM.spacing.lg,
                  border: `1px solid ${isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)'}`,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: DESIGN_SYSTEM.spacing.sm,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <stat.icon size={18} color={stat.color} />
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: `0 ${DESIGN_SYSTEM.spacing.xl}`,
        paddingBottom: DESIGN_SYSTEM.spacing.xxxl,
      }}>
        {/* Tab Navigation with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            gap: DESIGN_SYSTEM.spacing.sm,
            marginBottom: DESIGN_SYSTEM.spacing.xl,
            background: isDarkMode 
              ? 'rgba(30, 41, 59, 0.6)' 
              : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: DESIGN_SYSTEM.borderRadius.lg,
            padding: DESIGN_SYSTEM.spacing.sm,
            border: `1px solid ${isDarkMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          {[
            { id: 'analysis', label: 'AI Analysis', icon: BarChart3 },
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'insights', label: 'Insights', icon: PieChart },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
                background: activeTab === tab.id 
                  ? DESIGN_SYSTEM.colors.primary.gradient 
                  : 'transparent',
                color: activeTab === tab.id 
                  ? '#FFFFFF' 
                  : (isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light),
                border: 'none',
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: DESIGN_SYSTEM.spacing.sm,
                transition: DESIGN_SYSTEM.animations.transition,
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: DESIGN_SYSTEM.spacing.xl,
            marginBottom: DESIGN_SYSTEM.spacing.xxl,
            minHeight: '600px',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: '1fr',
              gap: DESIGN_SYSTEM.spacing.lg,
            }
          }}
        >
          {/* Column 1: Resume Preview */}
          <ResumePreview resume={resume} />

          {/* Column 2: Job Description Input */}
          <Card glass style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: DESIGN_SYSTEM.spacing.lg,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: DESIGN_SYSTEM.colors.secondary.gradient,
                    borderRadius: DESIGN_SYSTEM.borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={24} color="#FFFFFF" />
                </motion.div>
                <div>
                  <h3 style={{
                    fontSize: DESIGN_SYSTEM.typography.h5,
                    fontWeight: '700',
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    margin: 0,
                  }}>
                    Job Description
                  </h3>
                  <p style={{
                    fontSize: DESIGN_SYSTEM.typography.small,
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                    margin: `${DESIGN_SYSTEM.spacing.xs} 0 0 0`,
                  }}>
                    Paste the job you want to apply for
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm }}>
                <Button
                  variant="ghost"
                  icon={RefreshCw}
                  onClick={handleLoadExampleJD}
                  size="sm"
                >
                  Example
                </Button>
                <Button
                  variant="ghost"
                  icon={Trash2}
                  onClick={clearJobDescription}
                  size="sm"
                  disabled={!jobDescription.trim()}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                position: 'relative',
                flex: 1,
                marginBottom: DESIGN_SYSTEM.spacing.md,
              }}>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={`Paste the job description here...\n\n💡 Pro tips:\n• Include required skills and technologies\n• Mention experience level and qualifications\n• List job responsibilities and duties\n• Add company culture and values\n\nYou can also:\n1. Copy-paste from LinkedIn\n2. Use job posting URL\n3. Type manually\n\nThe more detailed, the better the analysis!`}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '300px',
                    padding: DESIGN_SYSTEM.spacing.lg,
                    border: `2px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
                    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                    fontSize: DESIGN_SYSTEM.typography.body,
                    lineHeight: 1.6,
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                    background: isDarkMode ? DESIGN_SYSTEM.colors.surface.dark : DESIGN_SYSTEM.colors.surface.light,
                    resize: 'none',
                    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
                    transition: DESIGN_SYSTEM.animations.transition,
                    outline: 'none',
                    '::placeholder': {
                      color: isDarkMode ? DESIGN_SYSTEM.colors.text.tertiary.dark : DESIGN_SYSTEM.colors.text.tertiary.light,
                    },
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = DESIGN_SYSTEM.colors.primary.light;
                    e.target.style.boxShadow = `0 0 0 3px ${DESIGN_SYSTEM.colors.primary.light}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: DESIGN_SYSTEM.spacing.md,
                  right: DESIGN_SYSTEM.spacing.md,
                  display: 'flex',
                  alignItems: 'center',
                  gap: DESIGN_SYSTEM.spacing.sm,
                  background: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.md,
                  fontSize: DESIGN_SYSTEM.typography.small,
                }}>
                  <span style={{
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                  }}>
                    {wordCount} words
                  </span>
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                  }} />
                  <span style={{
                    color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                  }}>
                    {charCount} chars
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: DESIGN_SYSTEM.spacing.lg,
                paddingTop: DESIGN_SYSTEM.spacing.lg,
                borderTop: `1px solid ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light}`,
              }}>
                <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm }}>
                  <Button
                    variant="ghost"
                    onClick={handleClearAnalysis}
                    disabled={loading || (!analysisResult && !jobDescription)}
                  >
                    Reset All
                  </Button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Cpu}
                    onClick={handleAnalyzeClick}
                    loading={loading}
                    style={{
                      minWidth: '200px',
                      padding: `${DESIGN_SYSTEM.spacing.md} ${DESIGN_SYSTEM.spacing.xl}`,
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid currentColor',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: DESIGN_SYSTEM.spacing.sm,
                        }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={20} style={{ marginRight: DESIGN_SYSTEM.spacing.sm }} />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  style={{
                    marginTop: DESIGN_SYSTEM.spacing.md,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    padding: DESIGN_SYSTEM.spacing.md,
                    borderRadius: DESIGN_SYSTEM.borderRadius.md,
                    background: error 
                      ? `${DESIGN_SYSTEM.colors.error}15`
                      : `${DESIGN_SYSTEM.colors.success}15`,
                    border: `1px solid ${error ? DESIGN_SYSTEM.colors.error : DESIGN_SYSTEM.colors.success}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: DESIGN_SYSTEM.spacing.sm,
                  }}>
                    {error ? (
                      <>
                        <AlertCircle size={20} color={DESIGN_SYSTEM.colors.error} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            color: DESIGN_SYSTEM.colors.error, 
                            fontSize: DESIGN_SYSTEM.typography.body,
                            fontWeight: '600',
                            marginBottom: '2px',
                          }}>
                            Error
                          </div>
                          <div style={{ 
                            color: DESIGN_SYSTEM.colors.error, 
                            fontSize: DESIGN_SYSTEM.typography.small,
                            opacity: 0.9,
                          }}>
                            {error}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} color={DESIGN_SYSTEM.colors.success} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            color: DESIGN_SYSTEM.colors.success, 
                            fontSize: DESIGN_SYSTEM.typography.body,
                            fontWeight: '600',
                            marginBottom: '2px',
                          }}>
                            Success
                          </div>
                          <div style={{ 
                            color: DESIGN_SYSTEM.colors.success, 
                            fontSize: DESIGN_SYSTEM.typography.small,
                            opacity: 0.9,
                          }}>
                            {success}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Column 3: Analysis Results */}
          <AnalysisResults 
            result={analysisResult} 
            onApplySkills={handleApplySkills} 
            loading={loading}
            resume={resume}
          />
        </motion.div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            marginBottom: DESIGN_SYSTEM.spacing.xxl,
          }}
        >
          <div style={{ 
            textAlign: 'center',
            marginBottom: DESIGN_SYSTEM.spacing.xl,
          }}>
            <h2 style={{
              fontSize: DESIGN_SYSTEM.typography.h3,
              fontWeight: '800',
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
              marginBottom: DESIGN_SYSTEM.spacing.sm,
            }}>
              Unlock More Features
            </h2>
            <p style={{
              fontSize: DESIGN_SYSTEM.typography.body,
              color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Take your job search to the next level with our premium features
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: DESIGN_SYSTEM.spacing.lg,
            '@media (max-width: 768px)': {
              gridTemplateColumns: '1fr',
            }
          }}>
            {[
              {
                title: 'Career Coach',
                description: 'Get personalized career advice and roadmap',
                icon: UsersIcon,
                color: DESIGN_SYSTEM.colors.primary.light,
                features: ['Personalized roadmap', 'Interview prep', 'Salary negotiation']
              },
              {
                title: 'ATS Optimizer',
                description: 'Ensure your resume passes through ATS systems',
                icon: ShieldIcon,
                color: DESIGN_SYSTEM.colors.secondary.light,
                features: ['ATS compatibility', 'Keyword optimization', 'Format check']
              },
              {
                title: 'Cover Letter AI',
                description: 'Generate personalized cover letters instantly',
                icon: ZapIcon,
                color: DESIGN_SYSTEM.colors.accent.light,
                features: ['AI-generated letters', 'Custom templates', 'One-click apply']
              },
            ].map((feature, index) => (
              <Card key={index} hoverable glass>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: DESIGN_SYSTEM.spacing.md,
                  marginBottom: DESIGN_SYSTEM.spacing.lg,
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                    background: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <feature.icon size={24} color={feature.color} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: DESIGN_SYSTEM.typography.h5,
                      fontWeight: '700',
                      color: isDarkMode ? DESIGN_SYSTEM.colors.text.primary.dark : DESIGN_SYSTEM.colors.text.primary.light,
                      margin: `0 0 ${DESIGN_SYSTEM.spacing.xs} 0`,
                    }}>
                      {feature.title}
                    </h4>
                    <p style={{
                      fontSize: DESIGN_SYSTEM.typography.small,
                      color: isDarkMode ? DESIGN_SYSTEM.colors.text.secondary.dark : DESIGN_SYSTEM.colors.text.secondary.light,
                      margin: 0,
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: DESIGN_SYSTEM.spacing.xs,
                  marginBottom: DESIGN_SYSTEM.spacing.lg,
                }}>
                  {feature.features.map((feat, idx) => (
                    <span key={idx} style={{
                      fontSize: DESIGN_SYSTEM.typography.small,
                      color: feature.color,
                      background: `${feature.color}15`,
                      padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                      borderRadius: DESIGN_SYSTEM.borderRadius.full,
                      fontWeight: '500',
                    }}>
                      {feat}
                    </span>
                  ))}
                </div>
                <Button variant="outline" fullWidth>
                  Upgrade to Pro
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <Fab 
        icon={Rocket} 
        onClick={handleAnalyzeClick}
        style={{ display: jobDescription.trim() ? 'flex' : 'none' }}
      />

      {/* Global Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          :root {
            color-scheme: light dark;
          }
          
          [data-theme="dark"] {
            color-scheme: dark;
          }
          
          [data-theme="light"] {
            color-scheme: light;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            margin: 0;
            overflow-x: hidden;
          }
          
          button:focus {
            outline: 2px solid ${DESIGN_SYSTEM.colors.primary.light};
            outline-offset: 2px;
          }
          
          textarea:focus {
            outline: none;
          }
          
          ::selection {
            background: ${DESIGN_SYSTEM.colors.primary.light}40;
            color: inherit;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${isDarkMode ? DESIGN_SYSTEM.colors.background.dark : DESIGN_SYSTEM.colors.background.light};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? DESIGN_SYSTEM.colors.border.dark : DESIGN_SYSTEM.colors.border.light};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? DESIGN_SYSTEM.colors.primary.dark : DESIGN_SYSTEM.colors.primary.light};
          }
        `}
      </style>
    </div>
  );
}

export default AnalyzeResumePage;