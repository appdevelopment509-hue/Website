// ======= Events Page Logic =======

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the 3D Starfield from main.js
    if (typeof initStarfield === 'function') {
        initStarfield();
    }

    // 2. Split Screen Expansion Logic using GSAP
    gsap.registerPlugin(ScrollToPlugin);

    const pastPanel = document.getElementById('panel-past');
    const upcomingPanel = document.getElementById('panel-upcoming');
    const backBtn = document.getElementById('back-btn');
    const nav = document.querySelector('.glass-nav');

    let isExpanded = false;

    function expandPanel(selectedPanel, hiddenPanel) {
        if (isExpanded) return;
        isExpanded = true;

        // Hide Navigation
        gsap.to(nav, { y: '-100%', duration: 0.5, ease: 'power3.inOut' });

        // Add Expanded State
        selectedPanel.classList.add('panel-expanded');
        
        // Disable pointer events on the hidden panel immediately
        hiddenPanel.style.pointerEvents = 'none';

        // Animate the split layout
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile) {
            // Mobile (Vertical Split)
            gsap.to(selectedPanel, { height: '100vh', duration: 0.8, ease: 'power4.inOut' });
            gsap.to(hiddenPanel, { height: '0vh', opacity: 0, duration: 0.8, ease: 'power4.inOut' });
        } else {
            // Desktop (Horizontal Split)
            gsap.to(selectedPanel, { width: '100vw', duration: 0.8, ease: 'power4.inOut' });
            gsap.to(hiddenPanel, { width: '0vw', opacity: 0, duration: 0.8, ease: 'power4.inOut' });
        }

        // Reveal the expanded content
        const expandedContent = selectedPanel.querySelector('.expanded-content');
        expandedContent.classList.remove('hidden');
        gsap.fromTo(expandedContent, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        // Show back button
        setTimeout(() => backBtn.classList.add('visible'), 500);

        // Optional: Change background overlay for better readability
        gsap.to(selectedPanel.querySelector('.panel-overlay'), { 
            background: 'rgba(2, 6, 23, 0.8)', 
            duration: 0.8 
        });
    }

    function resetSplitView() {
        if (!isExpanded) return;
        
        // Hide back button immediately
        backBtn.classList.remove('visible');
        
        const openPanel = document.querySelector('.panel-expanded');
        if (!openPanel) return;

        const otherPanel = openPanel.id === 'panel-past' ? upcomingPanel : pastPanel;
        const expandedContent = openPanel.querySelector('.expanded-content');

        // Fade out expanded content
        gsap.to(expandedContent, { 
            opacity: 0, y: 30, duration: 0.4, 
            onComplete: () => {
                expandedContent.classList.add('hidden');
                openPanel.classList.remove('panel-expanded');
                
                // Reset layout
                const isMobile = window.innerWidth <= 900;
                if (isMobile) {
                    gsap.to([openPanel, otherPanel], { height: '50vh', width: '100vw', opacity: 1, duration: 0.8, ease: 'power4.inOut' });
                } else {
                    gsap.to([openPanel, otherPanel], { width: '50vw', height: '100vh', opacity: 1, duration: 0.8, ease: 'power4.inOut' });
                }

                // Show Navigation again
                gsap.to(nav, { y: '0%', duration: 0.5, delay: 0.3, ease: 'power3.inOut' });

                // Restore pointer events
                openPanel.style.pointerEvents = 'auto';
                otherPanel.style.pointerEvents = 'auto';

                // Reset overlay alpha
                gsap.to(openPanel.querySelector('.panel-overlay'), { 
                    background: openPanel.id === 'panel-past' ? 
                        'radial-gradient(circle at center, rgba(112, 0, 255, 0.15) 0%, transparent 70%)' :
                        'radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
                    duration: 0.8 
                });

                isExpanded = false;
                
                // Scroll back to top
                gsap.to(window, { duration: 0, scrollTo: 0 });
            }
        });
    }

    // Attach Event Listeners
    pastPanel.addEventListener('click', (e) => {
        if (!isExpanded && e.target.closest('.panel-title-container')) {
            expandPanel(pastPanel, upcomingPanel);
        }
    });

    upcomingPanel.addEventListener('click', (e) => {
        if (!isExpanded && e.target.closest('.panel-title-container')) {
            expandPanel(upcomingPanel, pastPanel);
        }
    });

    backBtn.addEventListener('click', resetSplitView);

    // Handle Window Resize (crucial for resetting values if viewport changes orientation)
    window.addEventListener('resize', () => {
        if (!isExpanded) {
            const isMobile = window.innerWidth <= 900;
            if (isMobile) {
                gsap.set([pastPanel, upcomingPanel], { width: '100vw', height: '50vh' });
            } else {
                gsap.set([pastPanel, upcomingPanel], { width: '50vw', height: '100vh' });
            }
        }
    });
});
