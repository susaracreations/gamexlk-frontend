import React, { useState, useEffect } from 'react';

const NoticeBar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosed, setIsClosed] = useState(() => {
        return localStorage.getItem('noticeDismissed') === 'true';
    });

    useEffect(() => {
        const handleScroll = () => {
            // Hide the bar when scrolling down, show when at the very top
            // Matches the Navbar scroll threshold for a smooth transition
            setIsVisible(window.scrollY <= 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Update a CSS variable to adjust the body and navbar layout dynamically
        const height = (isClosed || !isVisible) ? '0px' : '36px';
        document.documentElement.style.setProperty('--notice-height', height);
    }, [isClosed, isVisible]);

    const handleClose = () => {
        setIsClosed(true);
        localStorage.setItem('noticeDismissed', 'true');
    };

    if (isClosed || !isVisible) return null;

    return (
        <div className="notice-bar">
            <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
                <p style={{ margin: 0, padding: '0 40px' }}>
                    ⚠️ <strong>Notice:</strong> This website is still under development, so you might encounter some bugs or glitches.
                </p>
                <button 
                    className="notice-close-btn" 
                    onClick={handleClose}
                    aria-label="Close notice"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default NoticeBar;