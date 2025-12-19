import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ResumeTemplate } from '../components/ResumeTemplate';
import { Download, Printer, Share2, Edit3, Home, ChevronLeft, ChevronRight, FileText, Settings, Eye, EyeOff } from 'lucide-react';

// Design System matching the previous form
const DESIGN_SYSTEM = {
  colors: {
    primary: '#4A6FFF',
    secondary: '#2DD4BF',
    accent: '#FF6B8B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Reusable Components
const Button = ({ children, variant = 'primary', icon: Icon, ...props }) => {
  const variants = {
    primary: {
      background: DESIGN_SYSTEM.colors.primary,
      color: '#FFFFFF',
    },
    secondary: {
      background: DESIGN_SYSTEM.colors.secondary,
      color: '#FFFFFF',
    },
    outline: {
      background: 'transparent',
      color: DESIGN_SYSTEM.colors.primary,
      border: `2px solid ${DESIGN_SYSTEM.colors.primary}`,
    },
    ghost: {
      background: 'transparent',
      color: DESIGN_SYSTEM.colors.textSecondary,
      border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
    },
  };

  return (
    <button
      style={{
        padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
        borderRadius: DESIGN_SYSTEM.borderRadius.md,
        border: 'none',
        fontWeight: '600',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: DESIGN_SYSTEM.animations.transition,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Icon ? DESIGN_SYSTEM.spacing.sm : '0',
        fontFamily: "'Inter', sans-serif",
        ...variants[variant],
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: DESIGN_SYSTEM.shadows.md,
        },
        ':active': {
          transform: 'translateY(0)',
        },
        ':disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
          transform: 'none',
        },
      }}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, ...props }) => (
  <div
    style={{
      background: DESIGN_SYSTEM.colors.surface,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      boxShadow: DESIGN_SYSTEM.shadows.lg,
      padding: DESIGN_SYSTEM.spacing.xl,
      marginBottom: DESIGN_SYSTEM.spacing.lg,
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: DESIGN_SYSTEM.spacing.xl,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: DESIGN_SYSTEM.colors.surface,
          borderRadius: DESIGN_SYSTEM.borderRadius.lg,
          padding: DESIGN_SYSTEM.spacing.xl,
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: DESIGN_SYSTEM.spacing.md,
            right: DESIGN_SYSTEM.spacing.md,
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: DESIGN_SYSTEM.colors.textSecondary,
            padding: DESIGN_SYSTEM.spacing.xs,
            borderRadius: DESIGN_SYSTEM.borderRadius.sm,
            ':hover': {
              background: DESIGN_SYSTEM.colors.background,
            },
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

function PrintResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume } = location.state || {};

  // State
  const [showPreview, setShowPreview] = useState(true);
  const [scale, setScale] = useState(1);
  const [showPrintSettings, setShowPrintSettings] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [printOptions, setPrintOptions] = useState({
    margins: 'default',
    pageSize: 'A4',
    quality: 'high',
    includeDate: true,
    includePageNumbers: false,
  });

  // Refs
  const contentRef = useRef(null);

  // Print functionality
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${resume?.full_name}_Resume_${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: ${printOptions.pageSize};
        margin: ${printOptions.margins === 'minimal' ? '0.5in' : '0.75in'};
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle edit resume
  const handleEdit = () => {
    navigate('/resume-form', { state: { resume } });
  };

  // Share resume as JSON
  const handleShare = async () => {
    try {
      const shareData = {
        title: `${resume.full_name}'s Resume`,
        text: `Check out ${resume.full_name}'s resume`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const resumeJson = JSON.stringify(resume, null, 2);
        await navigator.clipboard.writeText(resumeJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Calculate resume stats
  const getResumeStats = () => {
    if (!resume) return {};
    return {
      education: resume.education?.length || 0,
      experience: resume.experience?.length || 0,
      projects: resume.projects?.length || 0,
      skills: resume.skills?.length || 0,
      lastUpdated: new Date().toLocaleDateString(),
    };
  };

  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  // If no resume data, show error
  if (!resume) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: DESIGN_SYSTEM.colors.background,
        fontFamily: "'Inter', sans-serif",
      }}>
        <Card>
          <div style={{ textAlign: 'center', padding: DESIGN_SYSTEM.spacing.xxl }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: DESIGN_SYSTEM.colors.error,
              color: '#FFFFFF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              color: DESIGN_SYSTEM.colors.textPrimary,
              marginBottom: DESIGN_SYSTEM.spacing.md,
            }}>
              Resume Not Found
            </h2>
            <p style={{
              color: DESIGN_SYSTEM.colors.textSecondary,
              marginBottom: DESIGN_SYSTEM.spacing.xl,
              maxWidth: '400px',
            }}>
              The resume data could not be loaded. Please return to the dashboard and try again.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <Home size={18} />
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = getResumeStats();

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.background} 0%, #e0e7ff 100%)`,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div className="no-print" style={{
        background: DESIGN_SYSTEM.colors.surface,
        borderBottom: `1px solid ${DESIGN_SYSTEM.colors.border}`,
        padding: `${DESIGN_SYSTEM.spacing.lg} ${DESIGN_SYSTEM.spacing.xl}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: DESIGN_SYSTEM.shadows.sm,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: DESIGN_SYSTEM.spacing.lg,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.lg }}>
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft size={18} />
              Back
            </Button>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                color: DESIGN_SYSTEM.colors.textPrimary,
                margin: 0,
                fontWeight: '600',
              }}>
                {resume.full_name}'s Resume
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: DESIGN_SYSTEM.colors.textSecondary,
                margin: `${DESIGN_SYSTEM.spacing.xs} 0 0 0`,
              }}>
                Template: <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                  {resume.template_name || 'modern'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm, flexWrap: 'wrap' }}>
            <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button variant="ghost" onClick={handleEdit}>
              <Edit3 size={18} />
              Edit
            </Button>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 size={18} />
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button onClick={() => setShowPrintSettings(true)}>
              <Settings size={18} />
              Print Settings
            </Button>
            <Button variant="secondary" onClick={handlePrint} disabled={isPrinting}>
              {isPrinting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Preparing...
                </>
              ) : (
                <>
                  <Printer size={18} />
                  Print / Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="no-print" style={{
        background: DESIGN_SYSTEM.colors.surface,
        borderBottom: `1px solid ${DESIGN_SYSTEM.colors.border}`,
        padding: DESIGN_SYSTEM.spacing.md,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: DESIGN_SYSTEM.spacing.xl,
          flexWrap: 'wrap',
        }}>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: DESIGN_SYSTEM.colors.primary,
                marginBottom: DESIGN_SYSTEM.spacing.xs,
              }}>
                {value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: DESIGN_SYSTEM.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: DESIGN_SYSTEM.spacing.xl,
        display: 'grid',
        gridTemplateColumns: showPreview ? '300px 1fr' : '1fr',
        gap: DESIGN_SYSTEM.spacing.xl,
        minHeight: 'calc(100vh - 160px)',
      }}>
        {/* Sidebar */}
        {showPreview && (
          <div className="no-print" style={{
            height: 'fit-content',
            position: 'sticky',
            top: '160px',
          }}>
            <Card>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: DESIGN_SYSTEM.spacing.sm,
                marginBottom: DESIGN_SYSTEM.spacing.lg,
              }}>
                <FileText size={20} color={DESIGN_SYSTEM.colors.primary} />
                <h3 style={{
                  fontSize: '1rem',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                  margin: 0,
                  fontWeight: '600',
                }}>
                  Preview Controls
                </h3>
              </div>

              {/* Zoom Controls */}
              <div style={{ marginBottom: DESIGN_SYSTEM.spacing.lg }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.sm,
                  fontWeight: '500',
                }}>
                  Zoom ({Math.round(scale * 100)}%)
                </div>
                <div style={{
                  display: 'flex',
                  gap: DESIGN_SYSTEM.spacing.xs,
                  background: DESIGN_SYSTEM.colors.background,
                  padding: DESIGN_SYSTEM.spacing.xs,
                  borderRadius: DESIGN_SYSTEM.borderRadius.md,
                }}>
                  <Button
                    variant="ghost"
                    onClick={handleZoomOut}
                    style={{ flex: 1 }}
                    disabled={scale <= 0.5}
                  >
                    -
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleZoomReset}
                    style={{ flex: 2 }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleZoomIn}
                    style={{ flex: 1 }}
                    disabled={scale >= 2}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{
                background: DESIGN_SYSTEM.colors.background,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                padding: DESIGN_SYSTEM.spacing.md,
                marginBottom: DESIGN_SYSTEM.spacing.lg,
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.sm,
                  fontWeight: '500',
                }}>
                  Resume Quality Score
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: DESIGN_SYSTEM.spacing.sm,
                }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: DESIGN_SYSTEM.colors.border,
                    borderRadius: DESIGN_SYSTEM.borderRadius.full,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${Math.min((stats.education + stats.experience + stats.skills) * 10, 100)}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
                      borderRadius: DESIGN_SYSTEM.borderRadius.full,
                    }} />
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: DESIGN_SYSTEM.colors.primary,
                  }}>
                    {Math.min((stats.education + stats.experience + stats.skills) * 10, 100)}%
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.sm,
                  fontWeight: '500',
                }}>
                  Printing Tips
                </div>
                <ul style={{
                  paddingLeft: DESIGN_SYSTEM.spacing.lg,
                  margin: 0,
                  fontSize: '0.75rem',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  lineHeight: 1.6,
                }}>
                  <li>Use high-quality paper for best results</li>
                  <li>Check margins before printing</li>
                  <li>Save a digital copy for online applications</li>
                  <li>Update contact information regularly</li>
                </ul>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h4 style={{
                fontSize: '0.875rem',
                color: DESIGN_SYSTEM.colors.textPrimary,
                marginBottom: DESIGN_SYSTEM.spacing.md,
                fontWeight: '600',
              }}>
                Quick Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_SYSTEM.spacing.sm }}>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <Home size={16} />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit3 size={16} />
                  Edit Resume
                </Button>
                <Button variant="outline" onClick={() => window.open('/templates', '_blank')}>
                  <ChevronRight size={16} />
                  Browse Templates
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Resume Preview */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: DESIGN_SYSTEM.spacing.lg,
        }}>
          {/* Preview Header */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.md}`,
            background: DESIGN_SYSTEM.colors.surface,
            borderRadius: DESIGN_SYSTEM.borderRadius.md,
            boxShadow: DESIGN_SYSTEM.shadows.sm,
          }}>
            <div style={{ fontSize: '0.875rem', color: DESIGN_SYSTEM.colors.textSecondary }}>
              Preview Mode • Ready for {printOptions.quality === 'high' ? 'Professional' : 'Standard'} Print
            </div>
            <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm, alignItems: 'center' }}>
              <div style={{
                fontSize: '0.75rem',
                color: DESIGN_SYSTEM.colors.textTertiary,
                background: DESIGN_SYSTEM.colors.background,
                padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                borderRadius: DESIGN_SYSTEM.borderRadius.sm,
              }}>
                Scale: {Math.round(scale * 100)}%
              </div>
              <Button variant="ghost" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? 'Hide Controls' : 'Show Controls'}
              </Button>
            </div>
          </div>

          {/* Resume Container */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: DESIGN_SYSTEM.spacing.xl,
            background: '#f8f9fa',
            borderRadius: DESIGN_SYSTEM.borderRadius.lg,
            boxShadow: DESIGN_SYSTEM.shadows.md,
            overflow: 'auto',
            position: 'relative',
            minHeight: '800px',
          }}>
            {/* Page Simulation */}
            <div
              ref={contentRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: DESIGN_SYSTEM.animations.transition,
                width: printOptions.pageSize === 'A4' ? '210mm' : 'letter',
                minHeight: printOptions.pageSize === 'A4' ? '297mm' : '11in',
                background: '#FFFFFF',
                boxShadow: DESIGN_SYSTEM.shadows.xl,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Print-only content */}
              {printOptions.includeDate && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '9px',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  opacity: 0.7,
                }}>
                  Generated: {new Date().toLocaleDateString()}
                </div>
              )}
              
              {printOptions.includePageNumbers && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  fontSize: '9px',
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  opacity: 0.7,
                }}>
                  Page 1
                </div>
              )}

              {/* Resume Content */}
              <ResumeTemplate resume={resume} />
            </div>
          </div>

          {/* Preview Footer */}
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: DESIGN_SYSTEM.spacing.lg,
            padding: DESIGN_SYSTEM.spacing.lg,
            background: DESIGN_SYSTEM.colors.surface,
            borderRadius: DESIGN_SYSTEM.borderRadius.md,
            flexWrap: 'wrap',
          }}>
            <Button variant="ghost" onClick={handleZoomOut} disabled={scale <= 0.5}>
              Zoom Out
            </Button>
            <Button variant="ghost" onClick={handleZoomReset}>
              Reset View
            </Button>
            <Button variant="ghost" onClick={handleZoomIn} disabled={scale >= 2}>
              Zoom In
            </Button>
            <div style={{ width: '1px', background: DESIGN_SYSTEM.colors.border }} />
            <Button onClick={handlePrint} disabled={isPrinting}>
              {isPrinting ? 'Preparing PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Print Settings Modal */}
      <Modal isOpen={showPrintSettings} onClose={() => setShowPrintSettings(false)}>
        <div style={{ padding: DESIGN_SYSTEM.spacing.md }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.lg,
            fontWeight: '600',
          }}>
            Print Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_SYSTEM.spacing.lg }}>
            {/* Page Size */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.sm,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: '0.875rem',
              }}>
                Page Size
              </label>
              <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm }}>
                {['A4', 'Letter', 'Legal'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPrintOptions(prev => ({ ...prev, pageSize: size.toLowerCase() }))}
                    style={{
                      flex: 1,
                      padding: DESIGN_SYSTEM.spacing.sm,
                      background: printOptions.pageSize === size.toLowerCase() 
                        ? DESIGN_SYSTEM.colors.primary 
                        : DESIGN_SYSTEM.colors.background,
                      color: printOptions.pageSize === size.toLowerCase() 
                        ? '#FFFFFF' 
                        : DESIGN_SYSTEM.colors.textPrimary,
                      border: 'none',
                      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: DESIGN_SYSTEM.animations.transition,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.sm,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: '0.875rem',
              }}>
                Margins
              </label>
              <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm }}>
                {['Minimal', 'Default', 'Wide'].map((margin) => (
                  <button
                    key={margin}
                    onClick={() => setPrintOptions(prev => ({ ...prev, margins: margin.toLowerCase() }))}
                    style={{
                      flex: 1,
                      padding: DESIGN_SYSTEM.spacing.sm,
                      background: printOptions.margins === margin.toLowerCase() 
                        ? DESIGN_SYSTEM.colors.primary 
                        : DESIGN_SYSTEM.colors.background,
                      color: printOptions.margins === margin.toLowerCase() 
                        ? '#FFFFFF' 
                        : DESIGN_SYSTEM.colors.textPrimary,
                      border: 'none',
                      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: DESIGN_SYSTEM.animations.transition,
                    }}
                  >
                    {margin}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.sm,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: '0.875rem',
              }}>
                Print Quality
              </label>
              <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.sm }}>
                {['Standard', 'High'].map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setPrintOptions(prev => ({ ...prev, quality: quality.toLowerCase() }))}
                    style={{
                      flex: 1,
                      padding: DESIGN_SYSTEM.spacing.sm,
                      background: printOptions.quality === quality.toLowerCase() 
                        ? DESIGN_SYSTEM.colors.primary 
                        : DESIGN_SYSTEM.colors.background,
                      color: printOptions.quality === quality.toLowerCase() 
                        ? '#FFFFFF' 
                        : DESIGN_SYSTEM.colors.textPrimary,
                      border: 'none',
                      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: DESIGN_SYSTEM.animations.transition,
                    }}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: DESIGN_SYSTEM.spacing.md,
              }}>
                {[
                  { id: 'includeDate', label: 'Include generation date', checked: printOptions.includeDate },
                  { id: 'includePageNumbers', label: 'Include page numbers', checked: printOptions.includePageNumbers },
                ].map((option) => (
                  <div key={option.id} style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.sm }}>
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={option.checked}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        [option.id]: e.target.checked 
                      }))}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: DESIGN_SYSTEM.colors.primary,
                      }}
                    />
                    <label htmlFor={option.id} style={{
                      fontSize: '0.875rem',
                      color: DESIGN_SYSTEM.colors.textPrimary,
                      cursor: 'pointer',
                    }}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: DESIGN_SYSTEM.spacing.sm,
            marginTop: DESIGN_SYSTEM.spacing.xl,
            paddingTop: DESIGN_SYSTEM.spacing.xl,
            borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          }}>
            <Button variant="ghost" onClick={() => setShowPrintSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowPrintSettings(false);
              handlePrint();
            }}>
              Apply & Print
            </Button>
          </div>
        </div>
      </Modal>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PrintResumePage;