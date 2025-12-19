import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ========== DESIGN SYSTEM ==========
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
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h1: '2.5rem', // 40px
    h2: '2rem',   // 32px
    h3: '1.5rem', // 24px
    h4: '1.125rem', // 18px
    body: '1rem', // 16px
    small: '0.875rem', // 14px
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

// ========== REUSABLE COMPONENTS ==========
const Container = ({ children, ...props }) => (
  <div style={{
    maxWidth: '800px',
    margin: '0 auto',
    padding: DESIGN_SYSTEM.spacing.xl,
    ...props.style,
  }} {...props}>
    {children}
  </div>
);

const Card = ({ children, ...props }) => (
  <div style={{
    background: DESIGN_SYSTEM.colors.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    boxShadow: DESIGN_SYSTEM.shadows.lg,
    padding: DESIGN_SYSTEM.spacing.xl,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    ...props.style,
  }} {...props}>
    {children}
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: DESIGN_SYSTEM.spacing.md }}>
    {label && (
      <label style={{
        display: 'block',
        marginBottom: DESIGN_SYSTEM.spacing.xs,
        fontWeight: '500',
        color: DESIGN_SYSTEM.colors.textPrimary,
        fontSize: DESIGN_SYSTEM.typography.small,
      }}>
        {label}
      </label>
    )}
    <input style={{
      width: '100%',
      padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.md}`,
      border: `1px solid ${error ? DESIGN_SYSTEM.colors.error : DESIGN_SYSTEM.colors.border}`,
      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
      fontSize: DESIGN_SYSTEM.typography.body,
      color: DESIGN_SYSTEM.colors.textPrimary,
      backgroundColor: DESIGN_SYSTEM.colors.background,
      transition: DESIGN_SYSTEM.animations.transition,
      outline: 'none',
      ':focus': {
        borderColor: DESIGN_SYSTEM.colors.primary,
        boxShadow: `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}20`,
      },
    }} {...props} />
    {error && (
      <div style={{
        color: DESIGN_SYSTEM.colors.error,
        fontSize: DESIGN_SYSTEM.typography.small,
        marginTop: DESIGN_SYSTEM.spacing.xs,
      }}>
        {error}
      </div>
    )}
  </div>
);

const Button = ({ children, variant = 'primary', ...props }) => {
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
    <button style={{
      padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
      borderRadius: DESIGN_SYSTEM.borderRadius.md,
      border: 'none',
      fontWeight: '600',
      fontSize: DESIGN_SYSTEM.typography.body,
      cursor: 'pointer',
      transition: DESIGN_SYSTEM.animations.transition,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: DESIGN_SYSTEM.spacing.xs,
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
    }} {...props}>
      {children}
    </button>
  );
};

const ProgressBar = ({ currentStep, totalSteps = 7 }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div style={{
      marginBottom: DESIGN_SYSTEM.spacing.xxl,
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isCompleted || isActive 
                ? DESIGN_SYSTEM.colors.primary 
                : DESIGN_SYSTEM.colors.border,
              color: isCompleted || isActive ? '#FFFFFF' : DESIGN_SYSTEM.colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              border: `3px solid ${isActive ? DESIGN_SYSTEM.colors.secondary : 'transparent'}`,
              boxShadow: isActive ? `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}40` : 'none',
              transition: DESIGN_SYSTEM.animations.transition,
            }}>
              {isCompleted ? '✓' : stepNumber}
            </div>
          );
        })}
      </div>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        height: '4px',
        backgroundColor: DESIGN_SYSTEM.colors.border,
        zIndex: 0,
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: DESIGN_SYSTEM.colors.primary,
          transition: DESIGN_SYSTEM.animations.transition,
        }} />
      </div>
    </div>
  );
};

// ========== STEP COMPONENTS ==========
function PersonalInfoStep({ formData, setFormData, nextStep }) {
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.linkedin_url && !formData.linkedin_url.includes('linkedin.com')) {
      newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          👤
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Personal Information
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Let's start with the basics about you
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gap: DESIGN_SYSTEM.spacing.lg,
        }}>
          <Input
            label="Full Name *"
            name="full_name"
            value={formData.full_name || ''}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.full_name}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="john@example.com"
              error={errors.email}
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="(123) 456-7890"
            />
          </div>
          
          <Input
            label="LinkedIn Profile URL"
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url || ''}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            error={errors.linkedin_url}
          />
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: DESIGN_SYSTEM.spacing.xl,
        }}>
          <Button type="submit">
            Next: Education &nbsp;→
          </Button>
        </div>
      </form>
    </Card>
  );
}

function EducationStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({
    school: '',
    degree: '',
    major: '',
    gpa: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!currentEntry.school || !currentEntry.degree) return;
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { ...currentEntry, id: Date.now() }]
    }));
    setCurrentEntry({
      school: '',
      degree: '',
      major: '',
      gpa: '',
      start_date: '',
      end_date: '',
      description: '',
    });
  };
  
  const handleRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.secondary}, ${DESIGN_SYSTEM.colors.accent})`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          🎓
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Education
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Add your educational background
        </p>
      </div>
      
      {formData.education.length > 0 && (
        <div style={{ marginBottom: DESIGN_SYSTEM.spacing.xl }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Added Entries
          </h4>
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.sm,
          }}>
            {formData.education.map((edu) => (
              <div key={edu.id} style={{
                padding: DESIGN_SYSTEM.spacing.md,
                backgroundColor: DESIGN_SYSTEM.colors.background,
                borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: DESIGN_SYSTEM.colors.textPrimary,
                  }}>
                    {edu.degree}
                  </div>
                  <div style={{
                    color: DESIGN_SYSTEM.colors.textSecondary,
                    fontSize: DESIGN_SYSTEM.typography.small,
                  }}>
                    {edu.school} • {edu.start_date} - {edu.end_date || 'Present'}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(edu.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: DESIGN_SYSTEM.colors.error,
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: DESIGN_SYSTEM.spacing.xs,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAdd}>
        <div style={{
          borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          paddingTop: DESIGN_SYSTEM.spacing.xl,
        }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Add New Entry
          </h4>
          
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.lg,
          }}>
            <Input
              label="School/University *"
              name="school"
              value={currentEntry.school}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, school: e.target.value }))}
              placeholder="University of Example"
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Degree *"
                name="degree"
                value={currentEntry.degree}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="Bachelor of Science"
              />
              <Input
                label="Major"
                name="major"
                value={currentEntry.major}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, major: e.target.value }))}
                placeholder="Computer Science"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Start Date"
                name="start_date"
                value={currentEntry.start_date}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, start_date: e.target.value }))}
                placeholder="Sep 2020"
              />
              <Input
                label="End Date"
                name="end_date"
                value={currentEntry.end_date}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, end_date: e.target.value }))}
                placeholder="May 2024 or Present"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="GPA"
                name="gpa"
                value={currentEntry.gpa}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, gpa: e.target.value }))}
                placeholder="3.8/4.0"
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.xs,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: DESIGN_SYSTEM.typography.small,
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={currentEntry.description}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Relevant coursework, achievements, or activities..."
                style={{
                  width: '100%',
                  padding: DESIGN_SYSTEM.spacing.sm,
                  border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                  fontSize: DESIGN_SYSTEM.typography.body,
                  minHeight: '100px',
                  resize: 'vertical',
                  transition: DESIGN_SYSTEM.animations.transition,
                  ':focus': {
                    borderColor: DESIGN_SYSTEM.colors.primary,
                    boxShadow: `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}20`,
                    outline: 'none',
                  },
                }}
              />
            </div>
            
            <Button
              variant="secondary"
              type="submit"
              style={{ width: '100%' }}
              disabled={!currentEntry.school || !currentEntry.degree}
            >
              + Add This Entry
            </Button>
          </div>
        </div>
      </form>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <Button onClick={nextStep} disabled={formData.education.length === 0}>
          Next: Experience →
        </Button>
      </div>
    </Card>
  );
}

function ExperienceStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    current: false,
  });
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!currentEntry.company || !currentEntry.role) return;
    
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...currentEntry, id: Date.now() }]
    }));
    setCurrentEntry({
      company: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      current: false,
    });
  };
  
  const handleRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.accent}, #FF9E6D)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          💼
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Work Experience
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Add your professional experience
        </p>
      </div>
      
      {formData.experience.length > 0 && (
        <div style={{ marginBottom: DESIGN_SYSTEM.spacing.xl }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Added Positions
          </h4>
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.sm,
          }}>
            {formData.experience.map((exp) => (
              <div key={exp.id} style={{
                padding: DESIGN_SYSTEM.spacing.md,
                backgroundColor: DESIGN_SYSTEM.colors.background,
                borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: DESIGN_SYSTEM.colors.textPrimary,
                  }}>
                    {exp.role}
                  </div>
                  <div style={{
                    color: DESIGN_SYSTEM.colors.textSecondary,
                    fontSize: DESIGN_SYSTEM.typography.small,
                  }}>
                    {exp.company} • {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(exp.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: DESIGN_SYSTEM.colors.error,
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: DESIGN_SYSTEM.spacing.xs,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAdd}>
        <div style={{
          borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          paddingTop: DESIGN_SYSTEM.spacing.xl,
        }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Add New Position
          </h4>
          
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.lg,
          }}>
            <Input
              label="Company *"
              name="company"
              value={currentEntry.company}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Google, Microsoft, etc."
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Job Title *"
                name="role"
                value={currentEntry.role}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Software Engineer"
              />
              <Input
                label="Location"
                name="location"
                value={currentEntry.location}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, location: e.target.value }))}
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Start Date"
                name="start_date"
                value={currentEntry.start_date}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, start_date: e.target.value }))}
                placeholder="Jan 2022"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.sm }}>
                <Input
                  label="End Date"
                  name="end_date"
                  value={currentEntry.end_date}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, end_date: e.target.value }))}
                  placeholder="Present or Dec 2023"
                  disabled={currentEntry.current}
                />
                <div style={{ marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="current"
                    checked={currentEntry.current}
                    onChange={(e) => {
                      setCurrentEntry(prev => ({
                        ...prev,
                        current: e.target.checked,
                        end_date: e.target.checked ? '' : prev.end_date,
                      }));
                    }}
                    style={{ marginRight: DESIGN_SYSTEM.spacing.xs }}
                  />
                  <label htmlFor="current" style={{
                    fontSize: DESIGN_SYSTEM.typography.small,
                    color: DESIGN_SYSTEM.colors.textSecondary,
                  }}>
                    Current Role
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.xs,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: DESIGN_SYSTEM.typography.small,
              }}>
                Responsibilities & Achievements *
              </label>
              <textarea
                name="description"
                value={currentEntry.description}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="• Led development of new features...
• Improved performance by 30%...
• Collaborated with cross-functional teams..."
                style={{
                  width: '100%',
                  padding: DESIGN_SYSTEM.spacing.sm,
                  border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                  fontSize: DESIGN_SYSTEM.typography.body,
                  minHeight: '120px',
                  resize: 'vertical',
                  transition: DESIGN_SYSTEM.animations.transition,
                  ':focus': {
                    borderColor: DESIGN_SYSTEM.colors.primary,
                    boxShadow: `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}20`,
                    outline: 'none',
                  },
                }}
              />
              <div style={{
                fontSize: DESIGN_SYSTEM.typography.small,
                color: DESIGN_SYSTEM.colors.textTertiary,
                marginTop: DESIGN_SYSTEM.spacing.xs,
              }}>
                Use bullet points for better readability
              </div>
            </div>
            
            <Button
              variant="secondary"
              type="submit"
              style={{ width: '100%' }}
              disabled={!currentEntry.company || !currentEntry.role || !currentEntry.description}
            >
              + Add This Position
            </Button>
          </div>
        </div>
      </form>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <Button onClick={nextStep} disabled={formData.experience.length === 0}>
          Next: Projects →
        </Button>
      </div>
    </Card>
  );
}

function ProjectsStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({
    project_name: '',
    technologies: '',
    project_url: '',
    github_url: '',
    description: '',
  });
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!currentEntry.project_name) return;
    
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...currentEntry, id: Date.now() }]
    }));
    setCurrentEntry({
      project_name: '',
      technologies: '',
      project_url: '',
      github_url: '',
      description: '',
    });
  };
  
  const handleRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, #9D4EDD, #C77DFF)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          📁
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Projects
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Showcase your personal or professional projects
        </p>
      </div>
      
      {formData.projects.length > 0 && (
        <div style={{ marginBottom: DESIGN_SYSTEM.spacing.xl }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Added Projects
          </h4>
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.sm,
          }}>
            {formData.projects.map((proj) => (
              <div key={proj.id} style={{
                padding: DESIGN_SYSTEM.spacing.md,
                backgroundColor: DESIGN_SYSTEM.colors.background,
                borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: DESIGN_SYSTEM.colors.textPrimary,
                  }}>
                    {proj.project_name}
                  </div>
                  <div style={{
                    color: DESIGN_SYSTEM.colors.textSecondary,
                    fontSize: DESIGN_SYSTEM.typography.small,
                  }}>
                    {proj.technologies}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(proj.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: DESIGN_SYSTEM.colors.error,
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: DESIGN_SYSTEM.spacing.xs,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAdd}>
        <div style={{
          borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          paddingTop: DESIGN_SYSTEM.spacing.xl,
        }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Add New Project
          </h4>
          
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.lg,
          }}>
            <Input
              label="Project Name *"
              name="project_name"
              value={currentEntry.project_name}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, project_name: e.target.value }))}
              placeholder="E-commerce Platform"
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Live URL"
                name="project_url"
                value={currentEntry.project_url}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, project_url: e.target.value }))}
                placeholder="https://example.com"
              />
              <Input
                label="GitHub URL"
                name="github_url"
                value={currentEntry.github_url}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <Input
              label="Technologies Used"
              name="technologies"
              value={currentEntry.technologies}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, technologies: e.target.value }))}
              placeholder="React, Node.js, MongoDB, AWS"
            />
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: DESIGN_SYSTEM.spacing.xs,
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: DESIGN_SYSTEM.typography.small,
              }}>
                Project Description *
              </label>
              <textarea
                name="description"
                value={currentEntry.description}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project: goals, features, your role, technologies used, and outcomes..."
                style={{
                  width: '100%',
                  padding: DESIGN_SYSTEM.spacing.sm,
                  border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                  borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                  fontSize: DESIGN_SYSTEM.typography.body,
                  minHeight: '120px',
                  resize: 'vertical',
                  transition: DESIGN_SYSTEM.animations.transition,
                  ':focus': {
                    borderColor: DESIGN_SYSTEM.colors.primary,
                    boxShadow: `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}20`,
                    outline: 'none',
                  },
                }}
              />
            </div>
            
            <Button
              variant="secondary"
              type="submit"
              style={{ width: '100%' }}
              disabled={!currentEntry.project_name || !currentEntry.description}
            >
              + Add This Project
            </Button>
          </div>
        </div>
      </form>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <Button onClick={nextStep}>
          Next: Skills →
        </Button>
      </div>
    </Card>
  );
}

function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('Technical');
  
  const categories = ['Technical', 'Soft Skills', 'Tools', 'Languages', 'Certifications'];
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!currentSkill.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { 
        name: currentSkill.trim(), 
        category: skillCategory,
        id: Date.now() 
      }]
    }));
    setCurrentSkill('');
  };
  
  const handleRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };
  
  const getSkillsByCategory = (category) => {
    return formData.skills.filter(skill => skill.category === category);
  };
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, #F59E0B, #FBBF24)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          🛠️
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Skills & Expertise
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Add your skills categorized by type
        </p>
      </div>
      
      {formData.skills.length > 0 && (
        <div style={{ marginBottom: DESIGN_SYSTEM.spacing.xl }}>
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.lg,
          }}>
            {categories.map(category => {
              const skills = getSkillsByCategory(category);
              if (skills.length === 0) return null;
              
              return (
                <div key={category}>
                  <h4 style={{
                    fontSize: DESIGN_SYSTEM.typography.h4,
                    color: DESIGN_SYSTEM.colors.textPrimary,
                    marginBottom: DESIGN_SYSTEM.spacing.sm,
                  }}>
                    {category}
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: DESIGN_SYSTEM.spacing.sm,
                  }}>
                    {skills.map(skill => (
                      <div key={skill.id} style={{
                        backgroundColor: DESIGN_SYSTEM.colors.background,
                        padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
                        borderRadius: DESIGN_SYSTEM.borderRadius.full,
                        border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: DESIGN_SYSTEM.spacing.xs,
                      }}>
                        <span style={{
                          fontSize: DESIGN_SYSTEM.typography.small,
                          color: DESIGN_SYSTEM.colors.textPrimary,
                        }}>
                          {skill.name}
                        </span>
                        <button
                          onClick={() => handleRemove(skill.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: DESIGN_SYSTEM.colors.error,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <form onSubmit={handleAddSkill}>
        <div style={{
          borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          paddingTop: DESIGN_SYSTEM.spacing.xl,
        }}>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.md,
          }}>
            Add New Skill
          </h4>
          
          <div style={{
            display: 'grid',
            gap: DESIGN_SYSTEM.spacing.lg,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: DESIGN_SYSTEM.spacing.lg }}>
              <Input
                label="Skill Name"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="e.g., React, Python, Communication"
              />
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                  fontWeight: '500',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                  fontSize: DESIGN_SYSTEM.typography.small,
                }}>
                  Category
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.md}`,
                    border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                    fontSize: DESIGN_SYSTEM.typography.body,
                    backgroundColor: DESIGN_SYSTEM.colors.background,
                    color: DESIGN_SYSTEM.colors.textPrimary,
                    transition: DESIGN_SYSTEM.animations.transition,
                    ':focus': {
                      borderColor: DESIGN_SYSTEM.colors.primary,
                      boxShadow: `0 0 0 3px ${DESIGN_SYSTEM.colors.primary}20`,
                      outline: 'none',
                    },
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button
              variant="secondary"
              type="submit"
              style={{ width: '100%' }}
              disabled={!currentSkill.trim()}
            >
              + Add Skill
            </Button>
          </div>
        </div>
      </form>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <Button onClick={nextStep}>
          Next: Template →
        </Button>
      </div>
    </Card>
  );
}

function TemplateStep({ formData, setFormData, nextStep, prevStep }) {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with bold accents',
      color: DESIGN_SYSTEM.colors.primary,
      icon: '✨',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Classic layout perfect for corporate roles',
      color: '#1E293B',
      icon: '👔',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching design for creative industries',
      color: DESIGN_SYSTEM.colors.accent,
      icon: '🎨',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant with clean whitespace',
      color: '#64748B',
      icon: '⚪',
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Strong typography with vibrant colors',
      color: '#EF4444',
      icon: '🔥',
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Traditional format for research and academia',
      color: '#10B981',
      icon: '📚',
    },
  ];
  
  const handleSelectTemplate = (templateId) => {
    setFormData(prev => ({ ...prev, template_name: templateId }));
  };
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, #EC4899, #F472B6)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          🎨
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Choose Your Template
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Select a design that matches your personal style and career goals
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: DESIGN_SYSTEM.spacing.lg,
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            style={{
              border: `3px solid ${formData.template_name === template.id ? template.color : DESIGN_SYSTEM.colors.border}`,
              borderRadius: DESIGN_SYSTEM.borderRadius.lg,
              padding: DESIGN_SYSTEM.spacing.lg,
              backgroundColor: DESIGN_SYSTEM.colors.background,
              cursor: 'pointer',
              transition: DESIGN_SYSTEM.animations.transition,
              position: 'relative',
              overflow: 'hidden',
              ':hover': {
                transform: 'translateY(-4px)',
                boxShadow: DESIGN_SYSTEM.shadows.lg,
              },
            }}
          >
            {formData.template_name === template.id && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: template.color,
                color: '#FFFFFF',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
              }}>
                ✓
              </div>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.md,
              marginBottom: DESIGN_SYSTEM.spacing.md,
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: `${template.color}20`,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                {template.icon}
              </div>
              <div>
                <h4 style={{
                  fontSize: DESIGN_SYSTEM.typography.h4,
                  color: DESIGN_SYSTEM.colors.textPrimary,
                  margin: 0,
                }}>
                  {template.name}
                </h4>
                <div style={{
                  height: '4px',
                  width: '30px',
                  backgroundColor: template.color,
                  borderRadius: DESIGN_SYSTEM.borderRadius.full,
                  marginTop: DESIGN_SYSTEM.spacing.xs,
                }} />
              </div>
            </div>
            
            <p style={{
              color: DESIGN_SYSTEM.colors.textSecondary,
              fontSize: DESIGN_SYSTEM.typography.small,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {template.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: DESIGN_SYSTEM.spacing.xs,
              marginTop: DESIGN_SYSTEM.spacing.md,
            }}>
              <div style={{
                width: '20px',
                height: '30px',
                backgroundColor: template.color,
                borderRadius: '2px',
              }} />
              <div style={{
                flex: 1,
                height: '30px',
                backgroundColor: `${template.color}30`,
                borderRadius: '2px',
              }} />
              <div style={{
                width: '20px',
                height: '30px',
                backgroundColor: template.color,
                borderRadius: '2px',
              }} />
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: DESIGN_SYSTEM.spacing.xl,
        paddingTop: DESIGN_SYSTEM.spacing.xl,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <Button onClick={nextStep} disabled={!formData.template_name}>
          Next: Review →
        </Button>
      </div>
    </Card>
  );
}

function ReviewStep({ formData, prevStep, onSubmit, isSubmitting }) {
  const [previewData, setPreviewData] = useState(null);
  
  useEffect(() => {
    // Calculate preview data
    const data = {
      personalInfo: {
        name: formData.full_name || 'Not provided',
        email: formData.email || 'Not provided',
        phone: formData.phone || 'Not provided',
        linkedin: formData.linkedin_url || 'Not provided',
      },
      education: formData.education.length,
      experience: formData.experience.length,
      projects: formData.projects.length,
      skills: formData.skills.length,
      template: formData.template_name || 'modern',
    };
    setPreviewData(data);
  }, [formData]);
  
  return (
    <Card>
      <div style={{
        textAlign: 'center',
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, #10B981, #34D399)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '1.5rem',
          color: '#FFFFFF',
        }}>
          📄
        </div>
        <h3 style={{
          fontSize: DESIGN_SYSTEM.typography.h3,
          color: DESIGN_SYSTEM.colors.textPrimary,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          Review & Submit
        </h3>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
        }}>
          Review your information before generating your resume
        </p>
      </div>
      
      {previewData && (
        <div style={{
          display: 'grid',
          gap: DESIGN_SYSTEM.spacing.lg,
          marginBottom: DESIGN_SYSTEM.spacing.xl,
        }}>
          <div style={{
            backgroundColor: DESIGN_SYSTEM.colors.background,
            borderRadius: DESIGN_SYSTEM.borderRadius.lg,
            padding: DESIGN_SYSTEM.spacing.lg,
          }}>
            <h4 style={{
              fontSize: DESIGN_SYSTEM.typography.h4,
              color: DESIGN_SYSTEM.colors.textPrimary,
              marginBottom: DESIGN_SYSTEM.spacing.md,
            }}>
              📋 Summary
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: DESIGN_SYSTEM.spacing.md,
            }}>
              <div style={{
                backgroundColor: DESIGN_SYSTEM.colors.surface,
                padding: DESIGN_SYSTEM.spacing.md,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: DESIGN_SYSTEM.colors.primary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  {previewData.education}
                </div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                }}>
                  Education Entries
                </div>
              </div>
              
              <div style={{
                backgroundColor: DESIGN_SYSTEM.colors.surface,
                padding: DESIGN_SYSTEM.spacing.md,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: DESIGN_SYSTEM.colors.primary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  {previewData.experience}
                </div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                }}>
                  Experience Entries
                </div>
              </div>
              
              <div style={{
                backgroundColor: DESIGN_SYSTEM.colors.surface,
                padding: DESIGN_SYSTEM.spacing.md,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: DESIGN_SYSTEM.colors.primary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  {previewData.skills}
                </div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                }}>
                  Skills
                </div>
              </div>
              
              <div style={{
                backgroundColor: DESIGN_SYSTEM.colors.surface,
                padding: DESIGN_SYSTEM.spacing.md,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: DESIGN_SYSTEM.colors.primary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  {previewData.projects}
                </div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                }}>
                  Projects
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: DESIGN_SYSTEM.colors.background,
            borderRadius: DESIGN_SYSTEM.borderRadius.lg,
            padding: DESIGN_SYSTEM.spacing.lg,
          }}>
            <h4 style={{
              fontSize: DESIGN_SYSTEM.typography.h4,
              color: DESIGN_SYSTEM.colors.textPrimary,
              marginBottom: DESIGN_SYSTEM.spacing.md,
            }}>
              👤 Personal Information
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: DESIGN_SYSTEM.spacing.md,
            }}>
              <div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  Name
                </div>
                <div style={{
                  fontWeight: '600',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                }}>
                  {previewData.personalInfo.name}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  Email
                </div>
                <div style={{
                  fontWeight: '600',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                }}>
                  {previewData.personalInfo.email}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  Phone
                </div>
                <div style={{
                  fontWeight: '600',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                }}>
                  {previewData.personalInfo.phone}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                  marginBottom: DESIGN_SYSTEM.spacing.xs,
                }}>
                  LinkedIn
                </div>
                <div style={{
                  fontWeight: '600',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                  wordBreak: 'break-all',
                }}>
                  {previewData.personalInfo.linkedin}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: DESIGN_SYSTEM.colors.background,
            borderRadius: DESIGN_SYSTEM.borderRadius.lg,
            padding: DESIGN_SYSTEM.spacing.lg,
          }}>
            <h4 style={{
              fontSize: DESIGN_SYSTEM.typography.h4,
              color: DESIGN_SYSTEM.colors.textPrimary,
              marginBottom: DESIGN_SYSTEM.spacing.md,
            }}>
              🎨 Selected Template
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.md,
              padding: DESIGN_SYSTEM.spacing.md,
              backgroundColor: DESIGN_SYSTEM.colors.surface,
              borderRadius: DESIGN_SYSTEM.borderRadius.md,
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: `${DESIGN_SYSTEM.colors.primary}20`,
                borderRadius: DESIGN_SYSTEM.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}>
                🎨
              </div>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: DESIGN_SYSTEM.colors.textPrimary,
                  textTransform: 'capitalize',
                }}>
                  {previewData.template}
                </div>
                <div style={{
                  fontSize: DESIGN_SYSTEM.typography.small,
                  color: DESIGN_SYSTEM.colors.textSecondary,
                }}>
                  {previewData.template === 'modern' && 'Clean, contemporary design with bold accents'}
                  {previewData.template === 'professional' && 'Classic layout perfect for corporate roles'}
                  {previewData.template === 'creative' && 'Eye-catching design for creative industries'}
                  {previewData.template === 'minimal' && 'Simple and elegant with clean whitespace'}
                  {previewData.template === 'bold' && 'Strong typography with vibrant colors'}
                  {previewData.template === 'academic' && 'Traditional format for research and academia'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div style={{
        backgroundColor: `${DESIGN_SYSTEM.colors.success}10`,
        border: `1px solid ${DESIGN_SYSTEM.colors.success}30`,
        borderRadius: DESIGN_SYSTEM.borderRadius.lg,
        padding: DESIGN_SYSTEM.spacing.lg,
        marginBottom: DESIGN_SYSTEM.spacing.xl,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: DESIGN_SYSTEM.spacing.md,
          marginBottom: DESIGN_SYSTEM.spacing.sm,
        }}>
          <div style={{
            color: DESIGN_SYSTEM.colors.success,
            fontSize: '1.25rem',
          }}>
            ✅
          </div>
          <h4 style={{
            fontSize: DESIGN_SYSTEM.typography.h4,
            color: DESIGN_SYSTEM.colors.textPrimary,
            margin: 0,
          }}>
            Ready to Generate
          </h4>
        </div>
        <p style={{
          color: DESIGN_SYSTEM.colors.textSecondary,
          fontSize: DESIGN_SYSTEM.typography.body,
          margin: 0,
        }}>
          Your resume will be generated with the selected template. You can always edit and regenerate later.
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Button variant="ghost" onClick={prevStep}>
          ← Back
        </Button>
        <div style={{ display: 'flex', gap: DESIGN_SYSTEM.spacing.md }}>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            📥 Download PDF
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            style={{
              background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
            }}
          >
            {isSubmitting ? 'Generating...' : '✨ Generate Resume'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ========== MAIN FORM COMPONENT ==========
function ResumeForm({ existingData, onSave, saveButtonText }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState(existingData || {
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    template_name: 'modern',
  });

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Saving data:", formData);
      onSave(formData);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return <EducationStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ExperienceStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <ProjectsStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <SkillsStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <TemplateStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        return <ReviewStep formData={formData} prevStep={prevStep} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return <div>Error: Unknown step.</div>;
    }
  };

  const stepLabels = [
    'Personal Info',
    'Education',
    'Experience',
    'Projects',
    'Skills',
    'Template',
    'Review',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: DESIGN_SYSTEM.colors.background,
      padding: `${DESIGN_SYSTEM.spacing.xxl} 0`,
      fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    }}>
      <Container>
        <div style={{
          textAlign: 'center',
          marginBottom: DESIGN_SYSTEM.spacing.xxl,
        }}>
          <h1 style={{
            fontSize: DESIGN_SYSTEM.typography.h1,
            color: DESIGN_SYSTEM.colors.textPrimary,
            marginBottom: DESIGN_SYSTEM.spacing.sm,
            fontWeight: '700',
          }}>
            Build Your Resume
          </h1>
          <p style={{
            fontSize: DESIGN_SYSTEM.typography.body,
            color: DESIGN_SYSTEM.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Create a professional resume in 7 simple steps. Your progress is automatically saved.
          </p>
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={7} />
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: DESIGN_SYSTEM.spacing.sm,
          marginBottom: DESIGN_SYSTEM.spacing.xl,
          flexWrap: 'wrap',
        }}>
          {stepLabels.map((label, index) => (
            <div
              key={index}
              style={{
                padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`,
                borderRadius: DESIGN_SYSTEM.borderRadius.full,
                backgroundColor: currentStep === index + 1 
                  ? DESIGN_SYSTEM.colors.primary 
                  : DESIGN_SYSTEM.colors.background,
                color: currentStep === index + 1 
                  ? '#FFFFFF' 
                  : DESIGN_SYSTEM.colors.textSecondary,
                fontSize: DESIGN_SYSTEM.typography.small,
                fontWeight: currentStep === index + 1 ? '600' : '400',
                transition: DESIGN_SYSTEM.animations.transition,
                cursor: 'pointer',
              }}
              onClick={() => setCurrentStep(index + 1)}
            >
              {label}
            </div>
          ))}
        </div>
        
        {renderStep()}
        
        <div style={{
          textAlign: 'center',
          marginTop: DESIGN_SYSTEM.spacing.xxl,
          color: DESIGN_SYSTEM.colors.textTertiary,
          fontSize: DESIGN_SYSTEM.typography.small,
        }}>
          <p>
            Your data is securely stored and you can return to edit anytime.
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.xs,
              marginLeft: DESIGN_SYSTEM.spacing.sm,
              color: DESIGN_SYSTEM.colors.success,
            }}>
              <span style={{ fontSize: '1rem' }}>🔒</span>
              Secure & Private
            </span>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default ResumeForm;