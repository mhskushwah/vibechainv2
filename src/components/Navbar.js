import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaTree, FaInfoCircle, FaSignOutAlt, FaDollarSign } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null); // Reference for the nav element

  // Logout function
  const handleLogout = () => {
    console.log("User logged out due to tab close or inactivity.");
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    setMenuOpen(false); // Close menu after logout
    navigate('/logout');
  };

  // Handle scrolling
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setScrollingDown(currentScrollPos > prevScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  // Close navigation menu
  const closeMenu = () => {
    setMenuOpen(false); // Close the menu
  };

  // Handle logout when the tab is closed or inactive
  useEffect(() => {
    const handleTabClose = () => {
      handleLogout();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLogout();
      }
    };

    window.addEventListener('beforeunload', handleTabClose);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Hide navbar on Home page
  if (location.pathname === '/') return null;

  return (
    <nav ref={navRef} className={`navbar ${scrollingDown ? 'hide' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <a href="https://vibechain.vercel.app/" className="flex items-center" onClick={closeMenu}>
            <img src="assets/RiseBNB_files/logo.png" className="h-14" alt="RiseBNB Logo" />
          </a>
        </div>

        {/* Hamburger Menu Icon */}
        <div
          className="menu-icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click outside from closing the menu
            setMenuOpen(!menuOpen);
          }}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li><Link to="/dashboard" className="nav-link" onClick={closeMenu}><FaTachometerAlt /> Dashboard</Link></li>
          <li><Link to="/myteam" className="nav-link" onClick={closeMenu}><FaUsers /> My Team</Link></li>
          <li><Link to="/communitytree" className="nav-link" onClick={closeMenu}><FaTree /> Community Tree</Link></li>
          <li><Link to="/communityinfo" className="nav-link" onClick={closeMenu}><FaInfoCircle /> Community Info</Link></li>
          <li><Link to="/recentincome" className="nav-link" onClick={closeMenu}><FaTachometerAlt /> Recent Income</Link></li>
          <li><button className="nav-link logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
