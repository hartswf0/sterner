// The Sensory World: Interactive Presentation JavaScript - Fixed Version

class SoundscapePresentation {
    constructor() {
        this.currentSection = 'intro';
        this.isNavOpen = window.innerWidth > 768;
        this.audioContext = null;
        this.currentAudio = null;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupAudioPlayers();
        this.setupListeningInterface();
        this.setupExpandableQuotes();
        this.setupMobileNavigation();
        this.setupScrollBehavior();
        
        // Initialize Web Audio API for sound visualization
        this.initializeAudioContext();
        
        // Ensure initial state is correct
        this.updateActiveNavigation('intro');
        this.ensureIntroVisible();
        
        console.log('The Sensory World presentation initialized');
    }
    
    ensureIntroVisible() {
        // Make sure intro section is visible on load
        const introSection = document.getElementById('intro');
        if (introSection) {
            introSection.style.display = 'block';
            introSection.style.opacity = '1';
            introSection.style.transform = 'translateY(0)';
        }
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });
        
        // Set initial active states
        this.updateActiveNavigation('intro');
    }
    
    navigateToSection(sectionId) {
        console.log(`Navigating to section: ${sectionId}`);
        
        // Hide current section
        const currentSectionEl = document.querySelector(`#${this.currentSection}`);
        if (currentSectionEl) {
            currentSectionEl.classList.remove('active');
            currentSectionEl.style.display = 'none';
        }
        
        // Show new section with smooth transition
        setTimeout(() => {
            const newSectionEl = document.querySelector(`#${sectionId}`);
            if (newSectionEl) {
                newSectionEl.style.display = 'block';
                newSectionEl.classList.add('active');
                
                // Force reflow and then animate
                newSectionEl.offsetHeight;
                newSectionEl.style.opacity = '1';
                newSectionEl.style.transform = 'translateY(0)';
                
                this.currentSection = sectionId;
                this.updateActiveNavigation(sectionId);
                
                // Trigger section-specific animations
                setTimeout(() => {
                    this.triggerSectionAnimations(sectionId);
                }, 100);
                
                // Auto-close nav on mobile after selection
                if (window.innerWidth <= 768) {
                    this.closeNavigation();
                }
            }
        }, 150);
    }
    
    updateActiveNavigation(sectionId) {
        // Update nav link active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    triggerSectionAnimations(sectionId) {
        switch(sectionId) {
            case 'interface':
                this.animateListeningInterface();
                break;
            case 'timeline':
                this.animateTimeline();
                break;
            case 'noise-signal':
                this.animateNoiseSignal();
                break;
        }
    }
    
    setupAudioPlayers() {
        const playButtons = document.querySelectorAll('.play-btn');
        const referenceButtons = document.querySelectorAll('.reference-btn');
        
        playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const audioType = button.getAttribute('data-audio');
                this.playAudio(audioType, button);
            });
        });
        
        referenceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAudioReference(button.textContent);
            });
        });
    }
    
    async playAudio(audioType, button) {
        console.log(`Playing audio: ${audioType}`);
        
        // Stop any currently playing audio
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
            this.resetPlayButton();
        }
        
        try {
            // Store original text
            const originalText = button.textContent;
            
            // Simulate audio playback with visual feedback
            button.textContent = '⏸ Playing...';
            button.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            button.style.transform = 'scale(1.05)';
            
            // Create audio visualization
            this.createAudioVisualization(audioType, button);
            
            // Simulate audio duration
            const duration = this.getAudioDuration(audioType);
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, var(--accent-gold), #f4d03f)';
                button.style.transform = 'scale(1)';
            }, duration);
            
        } catch (error) {
            console.log('Audio playback simulation:', audioType);
            this.showAudioInfo(audioType);
        }
    }
    
    getAudioDuration(audioType) {
        const durations = {
            'stethoscope': 3000,
            'phonautograph': 10000,
            'edison': 5000,
            'gramophone': 8000,
            'ethnographic': 12000
        };
        return durations[audioType] || 5000;
    }
    
    createAudioVisualization(audioType, button) {
        // Create visual sound waves near the button
        const visualization = document.createElement('div');
        visualization.className = 'audio-visualization';
        visualization.innerHTML = `
            <div class="sound-wave"></div>
            <div class="sound-wave"></div>
            <div class="sound-wave"></div>
        `;
        
        // Position relative to button
        button.style.position = 'relative';
        button.parentNode.appendChild(visualization);
        
        // Remove after animation
        setTimeout(() => {
            if (visualization.parentNode) {
                visualization.parentNode.removeChild(visualization);
            }
        }, this.getAudioDuration(audioType));
    }
    
    showAudioReference(title) {
        console.log(`Showing reference for: ${title}`);
        // Show information about historical recordings
        const info = this.getHistoricalRecordingInfo(title);
        this.showModal('Historical Recording', info);
    }
    
    getHistoricalRecordingInfo(title) {
        const recordings = {
            'Au Clair de la Lune (1860)': {
                description: 'The earliest clearly recognizable record of the human voice, recorded by Édouard-Léon Scott de Martinville on April 9, 1860.',
                significance: 'This 10-second fragment represents the birth of sound recording technology.',
                archive: 'First Sounds Project',
                url: 'https://www.firstsounds.org/sounds/scott.php'
            },
            "Edison's Mary Had a Little Lamb": {
                description: 'One of the first recordings made by Thomas Edison on his tinfoil phonograph in 1877.',
                significance: 'Demonstrated the phonograph\'s ability to record and reproduce speech.',
                archive: 'Smithsonian Institution',
                url: 'https://americanhistory.si.edu/'
            },
            'Morse code sounder samples': {
                description: 'Audio recordings of telegraph sounders from the late 19th century.',
                significance: 'Illustrates the "audile technique" developed by telegraph operators.',
                archive: 'Various historical collections',
                url: '#'
            },
            'Telegraph key clicks': {
                description: 'Authentic sounds of telegraph keys and sounders in operation.',
                significance: 'Demonstrates indexical listening - local sounds representing distant events.',
                archive: 'Telegraph Historical Society',
                url: '#'
            },
            'Indigenous song recording': {
                description: 'Early ethnographic recordings collected by researchers like Frances Densmore.',
                significance: 'Complex colonial legacy of preservation and cultural destruction.',
                archive: 'Library of Congress',
                url: 'https://www.loc.gov/collections/national-jukebox/'
            }
        };
        
        return recordings[title] || { 
            description: 'Historical audio recording', 
            significance: 'Part of early sound technology development',
            archive: 'Various archives',
            url: '#'
        };
    }
    
    setupListeningInterface() {
        const apparatusButtons = document.querySelectorAll('.apparatus-btn');
        const signalBtn = document.querySelector('.signal-btn');
        const noiseBtn = document.querySelector('.noise-btn');
        
        apparatusButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Apparatus selected: ${button.getAttribute('data-apparatus')}`);
                
                // Update active apparatus
                apparatusButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const apparatus = button.getAttribute('data-apparatus');
                this.updateListeningInterface(apparatus);
            });
        });
        
        if (signalBtn) {
            signalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.highlightSignal();
            });
        }
        
        if (noiseBtn) {
            noiseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNoise();
            });
        }
    }
    
    updateListeningInterface(apparatus) {
        const descriptions = {
            'stethoscope': {
                signal: 'Heart beats, lung sounds, internal body rhythms',
                noise: 'Room sounds, patient movement, doctor\'s breathing',
                technique: 'Mediate auscultation - focused listening through instrument'
            },
            'telegraph': {
                signal: 'Morse code clicks - dots and dashes representing letters',
                noise: 'Office cacophony, multiple machines clicking simultaneously',
                technique: 'Indexical listening - local sounds representing distant events'
            },
            'phonograph': {
                signal: 'Recorded voice or music - "actual melody"',
                noise: 'Mechanical scratching, horn resonance, surface noise',
                technique: 'Faithful reproduction - listening for fidelity and presence'
            },
            'radio': {
                signal: 'Distant broadcasts, voice descriptions of events',
                noise: 'Static, interference, atmospheric disturbance',
                technique: 'Wireless reception - tuning in and out of signals'
            }
        };
        
        const info = descriptions[apparatus];
        if (info) {
            this.showInterfaceInfo(apparatus, info);
        }
    }
    
    showInterfaceInfo(apparatus, info) {
        console.log(`Updating interface info for: ${apparatus}`);
        
        // Create or update info display
        let infoDisplay = document.querySelector('.interface-info');
        if (!infoDisplay) {
            infoDisplay = document.createElement('div');
            infoDisplay.className = 'interface-info';
            const simulator = document.querySelector('.interface-simulator');
            if (simulator) {
                simulator.appendChild(infoDisplay);
            }
        }
        
        infoDisplay.innerHTML = `
            <h4>${apparatus.charAt(0).toUpperCase() + apparatus.slice(1)} Interface</h4>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Signal:</strong> ${info.signal}
                </div>
                <div class="info-item">
                    <strong>Noise:</strong> ${info.noise}
                </div>
                <div class="info-item">
                    <strong>Technique:</strong> ${info.technique}
                </div>
            </div>
        `;
        
        // Animate the info display
        infoDisplay.style.opacity = '0';
        infoDisplay.style.transform = 'translateY(10px)';
        setTimeout(() => {
            infoDisplay.style.transition = 'all 0.3s ease-out';
            infoDisplay.style.opacity = '1';
            infoDisplay.style.transform = 'translateY(0)';
        }, 50);
    }
    
    highlightSignal() {
        console.log('Highlighting signal elements');
        // Visual effect to highlight signal elements
        const layers = document.querySelectorAll('.layer');
        layers.forEach(layer => {
            layer.style.transition = 'all 0.3s ease-out';
            layer.style.border = '2px solid #28a745';
            layer.style.background = 'rgba(40, 167, 69, 0.1)';
            layer.style.transform = 'scale(1.02)';
        });
        
        setTimeout(() => {
            layers.forEach(layer => {
                layer.style.border = '1px solid var(--border-subtle)';
                layer.style.background = 'rgba(255, 255, 255, 0.02)';
                layer.style.transform = 'scale(1)';
            });
        }, 2000);
    }
    
    showNoise() {
        console.log('Showing noise elements');
        // Visual effect to show noise elements
        const layers = document.querySelectorAll('.layer');
        layers.forEach(layer => {
            layer.style.transition = 'all 0.3s ease-out';
            layer.style.border = '2px solid #dc3545';
            layer.style.background = 'rgba(220, 53, 69, 0.1)';
            layer.style.transform = 'scale(0.98)';
        });
        
        setTimeout(() => {
            layers.forEach(layer => {
                layer.style.border = '1px solid var(--border-subtle)';
                layer.style.background = 'rgba(255, 255, 255, 0.02)';
                layer.style.transform = 'scale(1)';
            });
        }, 2000);
    }
    
    setupExpandableQuotes() {
        const expandableQuotes = document.querySelectorAll('.quote-card.expandable');
        
        expandableQuotes.forEach(quote => {
            quote.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Quote card clicked');
                quote.classList.toggle('expanded');
                
                // Add visual feedback
                const impact = quote.querySelector('.quote-impact');
                if (impact) {
                    if (quote.classList.contains('expanded')) {
                        impact.style.display = 'block';
                        impact.style.opacity = '0';
                        impact.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            impact.style.transition = 'all 0.3s ease-out';
                            impact.style.opacity = '1';
                            impact.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        impact.style.display = 'none';
                    }
                }
            });
            
            // Add cursor pointer style
            quote.style.cursor = 'pointer';
        });
    }
    
    setupMobileNavigation() {
        const mobileToggle = document.getElementById('navToggleMobile');
        const navToggle = document.getElementById('navToggle');
        const sidebar = document.getElementById('navSidebar');
        const mainContent = document.querySelector('.main-content');
        
        // Fixed mobile navigation toggle
        const toggleNav = () => {
            console.log('Toggle navigation clicked');
            const isHidden = sidebar.classList.contains('hidden') || sidebar.classList.contains('show') === false;
            
            if (isHidden) {
                this.openNavigation();
            } else {
                this.closeNavigation();
            }
        };
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNav();
            });
        }
        
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNav();
            });
        }
        
        // Close nav when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
                this.closeNavigation();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.openNavigation();
            } else {
                this.closeNavigation();
            }
        });
        
        // Initialize nav state based on screen size
        if (window.innerWidth <= 768) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }
    
    openNavigation() {
        const sidebar = document.getElementById('navSidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('show');
        }
        if (mainContent && window.innerWidth > 768) {
            mainContent.classList.remove('full-width');
        }
        this.isNavOpen = true;
        console.log('Navigation opened');
    }
    
    closeNavigation() {
        const sidebar = document.getElementById('navSidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('show');
        }
        if (mainContent) {
            mainContent.classList.add('full-width');
        }
        this.isNavOpen = false;
        console.log('Navigation closed');
    }
    
    setupScrollBehavior() {
        // Handle anchor clicks within sections
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (target) {
                e.preventDefault();
                const targetId = target.getAttribute('href').substring(1);
                if (targetId && document.getElementById(targetId)) {
                    this.navigateToSection(targetId);
                }
            }
        });
    }
    
    animateListeningInterface() {
        const layers = document.querySelectorAll('.layer');
        layers.forEach((layer, index) => {
            layer.style.opacity = '0';
            layer.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                layer.style.transition = 'all 0.5s ease-out';
                layer.style.opacity = '1';
                layer.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
    
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }
    
    animateNoiseSignal() {
        const examples = document.querySelectorAll('.example-card');
        examples.forEach((card, index) => {
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
            }, index * 150);
        });
    }
    
    initializeAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    showModal(title, content) {
        console.log(`Showing modal: ${title}`);
        
        // Create modal for displaying additional information
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Description:</strong> ${content.description}</p>
                    <p><strong>Historical Significance:</strong> ${content.significance}</p>
                    <p><strong>Archive:</strong> ${content.archive}</p>
                    ${content.url && content.url !== '#' ? `<p><a href="${content.url}" target="_blank" style="color: var(--accent-gold);">Visit Archive →</a></p>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
    
    closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    resetPlayButton() {
        // Reset all play buttons to default state
        document.querySelectorAll('.play-btn').forEach(button => {
            if (button.textContent.includes('Playing')) {
                const originalText = button.textContent.replace('⏸ Playing...', '▶');
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, var(--accent-gold), #f4d03f)';
                button.style.transform = 'scale(1)';
            }
        });
    }
}

// Keyboard navigation support
const addKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                window.presentation.closeModal(modal);
            }
        }
        
        // Arrow key navigation between sections
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const sections = ['intro', 'timeline', 'apparatus', 'interface', 'ethnographic', 'noise-signal', 'transformations', 'quotes', 'archives'];
            const currentIndex = sections.indexOf(window.presentation.currentSection);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                window.presentation.navigateToSection(sections[currentIndex - 1]);
            } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
                window.presentation.navigateToSection(sections[currentIndex + 1]);
            }
        }
    });
};

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addKeyboardNavigation();
    window.presentation = new SoundscapePresentation();
    
    console.log('The Sensory World: Soundscapes, Orality, and Listening as Interface - Ready');
    
    // Debug: Log all sections found
    const sections = document.querySelectorAll('.section');
    console.log(`Found ${sections.length} sections:`, Array.from(sections).map(s => s.id));
});