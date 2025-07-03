// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Matrix effect for hero section canvas
window.onload = function() {
    const canvas = document.getElementById('matrix-canvas');
    // Check if canvas element exists. It might not on smaller screens due to CSS hiding it.
    if (!canvas) {
        console.log("Matrix canvas not found, likely due to screen size.");
        return;
    }

    const ctx = canvas.getContext('2d');

    // Set canvas size to fill its parent container dynamically
    const resizeCanvas = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        // Re-initialize drops to fit new column count
        const newColumns = canvas.width / fontSize;
        drops.length = 0; // Clear existing drops
        for (let x = 0; x < newColumns; x++) {
            drops[x] = 1;
        }
    };

    // Characters for the matrix effect
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+{}|:"<>?~`-=[]\\;,./абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const fontSize = 16;
    let columns = canvas.width / fontSize;
    const drops = [];

    // Initialize drops at the top of each column
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Function to draw the matrix effect
    function drawMatrix() {
        // Semi-transparent black rectangle to fade out old characters
        ctx.fillStyle = 'rgba(13, 13, 30, 0.05)'; /* Match body background for fading */
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; /* Green text */
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Send the drop back to the top randomly when it goes off screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++; // Move the drop down
        }
    }

    // Initial canvas resize and draw setup
    resizeCanvas(); // Set initial size
    setInterval(drawMatrix, 33); // Animation speed (approx 30 frames per second)

    // Adjust canvas size and re-initialize drops on window resize
    window.addEventListener('resize', resizeCanvas);
};

 /* --- Interconnected Atomic Background --- */
const atomicCanvas = document.createElement('canvas');
atomicCanvas.id = 'atomic-bg';
atomicCanvas.style.position = 'fixed';
atomicCanvas.style.top = 0;
atomicCanvas.style.left = 0;
atomicCanvas.style.width = '100vw';
atomicCanvas.style.height = '100vh';
atomicCanvas.style.zIndex = '-1';
atomicCanvas.style.pointerEvents = 'none';
document.body.prepend(atomicCanvas);

const atomicCtx = atomicCanvas.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
atomicCanvas.width = canvasWidth;
atomicCanvas.height = canvasHeight;

// --- Mouse Interaction Setup ---
const mouse = {
    x: null,
    y: null,
    radius: 150 // Radius of the interaction area around the cursor
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    atomicCanvas.width = canvasWidth;
    atomicCanvas.height = canvasHeight;
    initPoints();
});

// --- Parameters adjusted for a fully interconnected look ---
const POINTS = 100; // More points for an even denser web
const DIST = 260;  // **Increased distance to connect almost all points**
const points = [];
const colors = [
    '#a365f7', '#8c8cff', '#6a40e8', '#c471ed'
];

function initPoints() {
    points.length = 0;
    for (let i = 0; i < POINTS; i++) {
        points.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}
initPoints();

function drawConnections() {
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const a = points[i];
            const b = points[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);

            if (distance < DIST) {
                atomicCtx.beginPath();
                atomicCtx.moveTo(a.x, a.y);
                atomicCtx.lineTo(b.x, b.y);
                
                const opacity = 1 - (distance / DIST);
                atomicCtx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`; 
                atomicCtx.lineWidth = 1;
                atomicCtx.stroke();
            }
        }
    }
}

function animate() {
    atomicCtx.fillStyle = '#000000';
    atomicCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawConnections();

    for (const p of points) {
        // --- MOUSE INTERACTION LOGIC ---
        let pushX = 0;
        let pushY = 0;
        if (mouse.x !== null) {
            const distance = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const forceDirectionX = (p.x - mouse.x) / distance;
                const forceDirectionY = (p.y - mouse.y) / distance;
                pushX = forceDirectionX * force * 5; // Push strength multiplier
                pushY = forceDirectionY * force * 5;
            }
        }

        // Update point position with its base velocity and any push from the mouse
        p.x += p.dx + pushX;
        p.y += p.dy + pushY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvasWidth) p.dx *= -1;
        if (p.y < 0 || p.y > canvasHeight) p.dy *= -1;

        // Draw the point
        atomicCtx.beginPath();
        atomicCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        atomicCtx.fillStyle = p.color;
        atomicCtx.shadowColor = p.color;
        atomicCtx.shadowBlur = 8;
        atomicCtx.fill();
        atomicCtx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
}

animate();

document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');

    // Wait for the new, longer animation sequence to complete
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }
    }, 4000); // Total time: 1.7s (typing start) + 4.5s (typing duration) + buffer

    // --- Typed.js Initialization ---
    if (document.getElementById('typed-element')) {
        var typed = new Typed('#typed-element', {
            strings: [
                'Aspiring Full Stack Developer',
                'Enthusiastic Software Engineer',
                'Web Developer',
                'Tech Learner',
                'Problem Solver'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            smartBackspace: true, // This will only backspace what's needed
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }

    // --- REPLACE your existing "Smooth Scroll" block with this ---

    // --- Navbar Hide/Show on Scroll ---
    const header = document.querySelector('.header-bg');
    if (header) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            // Don't hide if the contact panel is open
            const contactPanel = document.getElementById('contact-panel');
            if (contactPanel && contactPanel.classList.contains('open')) {
                header.classList.remove('header-hidden');
                return;
            }

            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scrolling down, hide header
                header.classList.add('header-hidden');
            } else {
                // Scrolling up, show header
                header.classList.remove('header-hidden');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // --- Smooth Scroll Navigation (and hide navbar on click) ---
    document.querySelectorAll('a.nav-item').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.hash; // Use .hash to get the #... part
            const headerElement = document.querySelector('.header-bg');

            // Special case for the Home button to scroll to the top
            if (!targetId || targetId === '#') {
                if (headerElement) {
                    headerElement.classList.add('header-hidden');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return; // Exit after handling
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement && headerElement) {
                // Immediately hide the navbar when a link is clicked
                headerElement.classList.add('header-hidden');

                // Scroll to the target section
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Also, close the mobile menu if it's open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // --- Contact Panel Logic ---
    const openPanelBtn = document.getElementById('open-contact-panel');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const contactPanel = document.getElementById('contact-panel');
    const panelOverlay = document.getElementById('panel-overlay');

    const openPanel = () => {
        if (contactPanel) contactPanel.classList.add('open');
        if (panelOverlay) panelOverlay.classList.add('visible');
    };

    const closePanel = () => {
        if (contactPanel) contactPanel.classList.remove('open');
        if (panelOverlay) panelOverlay.classList.remove('visible');
    };

    if (openPanelBtn) {
        openPanelBtn.addEventListener('click', openPanel);
    }
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', closePanel);
    }
    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanel);
    }

    // Function to create a seamless loop for tech sliders
    function setupContinuousSlider(sliderClass) {
        const slider = document.querySelector(`.${sliderClass}`);
        if (slider) {
            // Clone all items and append them to the slider
            const items = slider.querySelectorAll('.tech-item');
            items.forEach(item => {
                const clone = item.cloneNode(true);
                slider.appendChild(clone);
            });
        }
    }

    // Apply the seamless loop to all skill sliders
    setupContinuousSlider('languages-slider');
    setupContinuousSlider('frameworks-slider');
    setupContinuousSlider('databases-tools-slider');
    setupContinuousSlider('tools-slider');

});
