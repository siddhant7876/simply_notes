// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faFolderPlus, faFolderOpen, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ token, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle sidebar toggle
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle navigation based on authentication state
    useEffect(() => {
        if (!token && location.pathname !== '/register') {
            console.log('No token found, redirecting to login');
            navigate('/login');
        }
    }, [token, navigate, location.pathname]);

    return (
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <button onClick={toggleSidebar} className="toggle-btn">
                <FontAwesomeIcon icon={faBars} />
            </button>
            <nav>
                {token ? ( 
                    <>
                        <button onClick={() => navigate('/home')}>
                            <FontAwesomeIcon icon={faHome} />
                            {sidebarOpen && <span>Home</span>}
                        </button>
                        <button onClick={() => navigate('/create-directory')}>
                            <FontAwesomeIcon icon={faFolderPlus} />
                            {sidebarOpen && <span>Create Directory</span>}
                        </button>
                        <button onClick={() => navigate('/view-directories')}>
                            <FontAwesomeIcon icon={faFolderOpen} />
                            {sidebarOpen && <span>View Directories</span>}
                        </button>
                        <button onClick={() => {
                            onLogout();
                            navigate('/login');
                        }}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/register')}>
                            <FontAwesomeIcon icon={faUserPlus} />
                            {sidebarOpen && <span>Register</span>}
                        </button>
                        <button onClick={() => navigate('/login')}>
                            <FontAwesomeIcon icon={faSignInAlt} />
                            {sidebarOpen && <span>Login</span>}
                        </button>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
