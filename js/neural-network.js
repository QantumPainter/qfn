// Neural Network Background Effect

document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile or has reduced motion preference
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Only create heavy animations on desktop devices
    if (!isMobile && !prefersReducedMotion) {
        // Create the neural network overlay div
        const neuralOverlay = document.createElement('div');
        neuralOverlay.className = 'neural-overlay';
        document.body.appendChild(neuralOverlay);
        
        // Create the neural connections div
        const neuralConnections = document.createElement('div');
        neuralConnections.className = 'neural-connections';
        document.body.appendChild(neuralConnections);

        // Optional: Add some dynamic floating nodes for a more interactive effect
        createNeuralNodes();
    }

    // Mobile Menu Functionality (always needed)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Listen for resize events to disable animations if window becomes too small
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile && !isMobile) {
            // Remove animations if window becomes mobile-sized
            const neuralOverlay = document.querySelector('.neural-overlay');
            const neuralConnections = document.querySelector('.neural-connections');
            const canvas = document.querySelector('canvas[style*="z-index: -6"]');
            
            if (neuralOverlay) neuralOverlay.remove();
            if (neuralConnections) neuralConnections.remove();
            if (canvas) canvas.remove();
        }
    });
});

function createNeuralNodes() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-6';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Nodes and connections - reduced for better performance
    const nodes = [];
    const maxNodes = window.innerWidth > 1200 ? 40 : 25; // Fewer nodes on smaller screens
    const connectionDistance = 120; // Reduced connection distance
    
    // Resize handler
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Skip if mobile
        if (width <= 768) {
            canvas.remove();
            return;
        }
        
        // Initialize nodes if empty
        if (nodes.length === 0) {
            for (let i = 0; i < maxNodes; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5 + 0.5, // Smaller nodes
                    vx: Math.random() * 0.2 - 0.1, // Slower movement
                    vy: Math.random() * 0.2 - 0.1,
                    color: `rgba(${Math.random() > 0.5 ? 137 : 70}, ${Math.random() > 0.5 ? 166 : 170}, ${Math.random() > 0.5 ? 212 : 225}, ${Math.random() * 0.3 + 0.05})` // More transparent
                });
            }
        }
    }
    
    // Animation loop with performance optimization
    let lastTime = 0;
    const targetFPS = 30; // Limit to 30 FPS for better performance
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
        if (currentTime - lastTime < frameInterval) {
            requestAnimationFrame(animate);
            return;
        }
        lastTime = currentTime;
        
        // Skip if page is not visible (performance optimization)
        if (document.hidden) {
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw nodes (with reduced complexity)
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Move node
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Connect to nearby nodes (limit connections for performance)
            let connections = 0;
            const maxConnections = 3; // Limit connections per node
            
            for (let j = i + 1; j < nodes.length && connections < maxConnections; j++) {
                const otherNode = nodes[j];
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    const opacity = (1 - distance / connectionDistance) * 0.1; // More transparent
                    ctx.strokeStyle = `rgba(137, 166, 212, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connections++;
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start
    window.addEventListener('resize', handleResize);
    handleResize();
    if (width > 768) { // Only start animation on desktop
        animate(0);
    }
} 