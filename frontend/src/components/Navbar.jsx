import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  FileText, 
  Home, 
  Sparkles, 
  User, 
  Settings, 
  Bell, 
  Search,
  ChevronDown,
  Briefcase,
  FileCode,
  Database,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Design System matching your previous components
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
    glass: 'rgba(255, 255, 255, 0.95)',
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
const Button = ({ children, variant = 'primary', icon: Icon, size = 'md', ...props }) => {
  const sizes = {
    sm: {
      padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
      fontSize: '0.875rem',
    },
    md: {
      padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
      fontSize: '0.875rem',
    },
    lg: {
      padding: `${DESIGN_SYSTEM.spacing.md} ${DESIGN_SYSTEM.spacing.xl}`,
      fontSize: '1rem',
    },
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      background: DESIGN_SYSTEM.colors.secondary,
      color: '#FFFFFF',
      border: 'none',
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
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      color: DESIGN_SYSTEM.colors.textPrimary,
      border: `1px solid rgba(255, 255, 255, 0.2)`,
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        ...sizes[size],
        borderRadius: DESIGN_SYSTEM.borderRadius.md,
        fontWeight: '600',
        cursor: 'pointer',
        transition: DESIGN_SYSTEM.animations.transition,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Icon ? DESIGN_SYSTEM.spacing.sm : '0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        whiteSpace: 'nowrap',
        ...variants[variant],
      }}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </motion.button>
  );
};

// User Menu Component
const UserMenu = ({ user, onLogout, onClose }) => {
  const menuRef = useRef();
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: User, 
      label: 'Profile', 
      action: () => navigate('/profile'),
      color: DESIGN_SYSTEM.colors.primary
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      action: () => navigate('/settings'),
      color: DESIGN_SYSTEM.colors.secondary
    },
    { 
      icon: Briefcase, 
      label: 'My Resumes', 
      action: () => navigate('/dashboard'),
      color: DESIGN_SYSTEM.colors.accent
    },
    { 
      icon: FileCode, 
      label: 'Templates', 
      action: () => navigate('/templates'),
      color: '#9D4EDD'
    },
    { 
      icon: Database, 
      label: 'Storage', 
      action: () => navigate('/storage'),
      color: '#F59E0B'
    },
    { 
      icon: Shield, 
      label: 'Privacy', 
      action: () => navigate('/privacy'),
      color: '#10B981'
    },
  ];

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        background: DESIGN_SYSTEM.colors.surface,
        borderRadius: DESIGN_SYSTEM.borderRadius.lg,
        boxShadow: DESIGN_SYSTEM.shadows.xl,
        border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
        width: '320px',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      {/* User Info */}
      <div style={{
        padding: DESIGN_SYSTEM.spacing.lg,
        background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}20, ${DESIGN_SYSTEM.colors.secondary}20)`,
        borderBottom: `1px solid ${DESIGN_SYSTEM.colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '1.25rem',
          }}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{
              fontWeight: '600',
              color: DESIGN_SYSTEM.colors.textPrimary,
              fontSize: '1rem',
            }}>
              {user.email.split('@')[0]}
            </div>
            <div style={{
              color: DESIGN_SYSTEM.colors.textSecondary,
              fontSize: '0.875rem',
              marginTop: '2px',
            }}>
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: DESIGN_SYSTEM.spacing.xs }}>
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            onClick={() => {
              item.action();
              onClose();
            }}
            style={{
              width: '100%',
              padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: DESIGN_SYSTEM.spacing.md,
              cursor: 'pointer',
              transition: DESIGN_SYSTEM.animations.transition,
              textAlign: 'left',
              borderRadius: DESIGN_SYSTEM.borderRadius.sm,
              ':hover': {
                background: DESIGN_SYSTEM.colors.background,
              },
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: DESIGN_SYSTEM.borderRadius.sm,
              background: `${item.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <item.icon size={18} color={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '500',
                color: DESIGN_SYSTEM.colors.textPrimary,
                fontSize: '0.875rem',
              }}>
                {item.label}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Logout Section */}
      <div style={{
        padding: DESIGN_SYSTEM.spacing.lg,
        borderTop: `1px solid ${DESIGN_SYSTEM.colors.border}`,
        background: DESIGN_SYSTEM.colors.background,
      }}>
        <Button
          variant="outline"
          onClick={onLogout}
          icon={LogOut}
          style={{ width: '100%', borderColor: DESIGN_SYSTEM.colors.error, color: DESIGN_SYSTEM.colors.error }}
        >
          Logout
        </Button>
      </div>
    </motion.div>
  );
};

// Notification Badge
const NotificationBadge = ({ count }) => (
  <div style={{
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    minWidth: '18px',
    height: '18px',
    background: DESIGN_SYSTEM.colors.accent,
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.625rem',
    fontWeight: '600',
    padding: '2px',
  }}>
    {count > 99 ? '99+' : count}
  </div>
);

// Search Bar Component
const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <motion.div
        animate={{ width: isExpanded ? '280px' : '40px' }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: DESIGN_SYSTEM.borderRadius.full,
          background: DESIGN_SYSTEM.colors.background,
          border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
        }}
      >
        <input
          type="text"
          placeholder="Search resumes, templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          style={{
            width: '100%',
            height: '40px',
            padding: `0 ${DESIGN_SYSTEM.spacing.lg} 0 44px`,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            color: DESIGN_SYSTEM.colors.textPrimary,
            '::placeholder': {
              color: DESIGN_SYSTEM.colors.textTertiary,
            },
          }}
        />
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}>
          <Search size={18} color={DESIGN_SYSTEM.colors.textTertiary} />
        </div>
      </motion.div>
    </div>
  );
};

// Main Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example count
  const userMenuRef = useRef();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/create', label: 'Create Resume', icon: FileText },
    { path: '/templates', label: 'Templates', icon: Sparkles },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuButton = document.querySelector('.menu-button');
      
      if (
        showMobileMenu && 
        mobileMenu && 
        !mobileMenu.contains(event.target) &&
        !menuButton?.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileMenu]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: DESIGN_SYSTEM.colors.glass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${DESIGN_SYSTEM.colors.border}`,
          boxShadow: DESIGN_SYSTEM.shadows.sm,
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: `0 ${DESIGN_SYSTEM.spacing.xl}`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
          }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.md }}
            >
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.sm, textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
                    borderRadius: DESIGN_SYSTEM.borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 20px ${DESIGN_SYSTEM.colors.primary}40`,
                  }}
                >
                  <Sparkles size={24} color="#FFFFFF" />
                </motion.div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.025em',
                  }}>
                    GROBS.AI
                  </span>
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    color: DESIGN_SYSTEM.colors.textTertiary,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    Resume Builder
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              {user && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: DESIGN_SYSTEM.spacing.xs,
                  marginLeft: DESIGN_SYSTEM.spacing.xl,
                  '@media (max-width: 768px)': {
                    display: 'none',
                  },
                }}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: DESIGN_SYSTEM.spacing.sm,
                        padding: `${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.lg}`,
                        borderRadius: DESIGN_SYSTEM.borderRadius.md,
                        textDecoration: 'none',
                        transition: DESIGN_SYSTEM.animations.transition,
                        background: isActive(link.path) 
                          ? `${DESIGN_SYSTEM.colors.primary}15` 
                          : 'transparent',
                        border: isActive(link.path)
                          ? `1px solid ${DESIGN_SYSTEM.colors.primary}30`
                          : '1px solid transparent',
                        color: isActive(link.path)
                          ? DESIGN_SYSTEM.colors.primary
                          : DESIGN_SYSTEM.colors.textSecondary,
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        ':hover': {
                          background: isActive(link.path)
                            ? `${DESIGN_SYSTEM.colors.primary}20`
                            : DESIGN_SYSTEM.colors.background,
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <link.icon size={16} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right Side Actions */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_SYSTEM.spacing.lg }}>
                {/* Search Bar */}
                <div style={{ '@media (max-width: 768px)': { display: 'none' } }}>
                  <SearchBar />
                </div>

                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <Bell size={20} color={DESIGN_SYSTEM.colors.textSecondary} />
                  {notificationCount > 0 && <NotificationBadge count={notificationCount} />}
                </motion.div>

                {/* User Menu */}
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: DESIGN_SYSTEM.spacing.sm,
                      padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm} ${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.md}`,
                      background: 'transparent',
                      border: `1px solid ${DESIGN_SYSTEM.colors.border}`,
                      borderRadius: DESIGN_SYSTEM.borderRadius.full,
                      cursor: 'pointer',
                      transition: DESIGN_SYSTEM.animations.transition,
                      ':hover': {
                        background: DESIGN_SYSTEM.colors.background,
                        borderColor: DESIGN_SYSTEM.colors.primary,
                      },
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                    }}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown 
                      size={16} 
                      color={DESIGN_SYSTEM.colors.textSecondary}
                      style={{
                        transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: DESIGN_SYSTEM.animations.transition,
                      }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <UserMenu 
                        user={user} 
                        onLogout={handleLogout} 
                        onClose={() => setShowUserMenu(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="menu-button"
                  style={{
                    display: 'none',
                    '@media (max-width: 768px)': {
                      display: 'flex',
                    },
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: DESIGN_SYSTEM.spacing.xs,
                  }}
                >
                  {showMobileMenu ? (
                    <X size={24} color={DESIGN_SYSTEM.colors.textPrimary} />
                  ) : (
                    <Menu size={24} color={DESIGN_SYSTEM.colors.textPrimary} />
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              background: DESIGN_SYSTEM.colors.surface,
              borderBottom: `1px solid ${DESIGN_SYSTEM.colors.border}`,
              boxShadow: DESIGN_SYSTEM.shadows.lg,
              zIndex: 999,
              padding: DESIGN_SYSTEM.spacing.lg,
              '@media (min-width: 769px)': {
                display: 'none',
              },
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN_SYSTEM.spacing.sm }}>
              {/* Mobile Search */}
              <SearchBar />

              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: DESIGN_SYSTEM.spacing.md,
                    padding: `${DESIGN_SYSTEM.spacing.md} ${DESIGN_SYSTEM.spacing.lg}`,
                    borderRadius: DESIGN_SYSTEM.borderRadius.md,
                    textDecoration: 'none',
                    transition: DESIGN_SYSTEM.animations.transition,
                    background: isActive(link.path) 
                      ? `${DESIGN_SYSTEM.colors.primary}10` 
                      : 'transparent',
                    borderLeft: isActive(link.path)
                      ? `4px solid ${DESIGN_SYSTEM.colors.primary}`
                      : '4px solid transparent',
                    color: isActive(link.path)
                      ? DESIGN_SYSTEM.colors.primary
                      : DESIGN_SYSTEM.colors.textPrimary,
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    ':hover': {
                      background: DESIGN_SYSTEM.colors.background,
                    },
                  }}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div style={{
                height: '1px',
                background: DESIGN_SYSTEM.colors.border,
                margin: `${DESIGN_SYSTEM.spacing.md} 0`,
              }} />

              {/* Mobile User Info */}
              {user && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: DESIGN_SYSTEM.spacing.md,
                  padding: DESIGN_SYSTEM.spacing.md,
                  background: DESIGN_SYSTEM.colors.background,
                  borderRadius: DESIGN_SYSTEM.borderRadius.md,
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.primary}, ${DESIGN_SYSTEM.colors.secondary})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '600',
                      color: DESIGN_SYSTEM.colors.textPrimary,
                      fontSize: '0.875rem',
                    }}>
                      {user.email.split('@')[0]}
                    </div>
                    <div style={{
                      color: DESIGN_SYSTEM.colors.textSecondary,
                      fontSize: '0.75rem',
                      marginTop: '2px',
                    }}>
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          * {
            box-sizing: border-box;
          }
          
          a {
            text-decoration: none;
          }
          
          @media (max-width: 768px) {
            .mobile-menu {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;