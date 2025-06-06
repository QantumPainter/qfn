// Neural Network Background Effect

document.addEventListener('DOMContentLoaded', function() {
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

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

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
});

function createNeuralNodes() {
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
    
    // Nodes and connections
    const nodes = [];
    const maxNodes = 50; // Adjust for performance
    const connectionDistance = 150;
    
    // Resize handler
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Initialize nodes if empty
        if (nodes.length === 0) {
            for (let i = 0; i < maxNodes; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1,
                    vx: Math.random() * 0.3 - 0.15,
                    vy: Math.random() * 0.3 - 0.15,
                    color: `rgba(${Math.random() > 0.5 ? 137 : 70}, ${Math.random() > 0.5 ? 166 : 170}, ${Math.random() > 0.5 ? 212 : 225}, ${Math.random() * 0.4 + 0.1})`
                });
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw nodes
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
            
            // Connect to nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const otherNode = nodes[j];
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    const opacity = (1 - distance / connectionDistance) * 0.15;
                    ctx.strokeStyle = `rgba(137, 166, 212, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();
} 