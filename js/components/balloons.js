function createBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    if (!balloonContainer) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    // Randomize properties
    const colors = [
        'rgba(255, 105, 180, 0.8)', // Pink
        'rgba(137, 207, 240, 0.8)', // Light Blue
        'rgba(255, 218, 185, 0.8)', // Peach
        'rgba(173, 216, 230, 0.8)', // Light Sky Blue
        'rgba(221, 160, 221, 0.8)'  // Plum
    ];
    const balloonColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = balloonColor;
    balloon.style.left = `${Math.random() * 90}%`; // Random horizontal start position

    // Randomize animation duration and delay for a more natural look for floatUp
    const duration = Math.random() * 5 + 8; // Duration between 8s and 13s
    const delay = Math.random() * 5;      // Delay up to 5s

    balloon.style.animationDuration = `${duration}s`;
    balloon.style.animationDelay = `${delay}s`;

    // Click to pop
    balloon.addEventListener('click', () => {
        if (!balloon.classList.contains('popping')) { // Prevent multiple pops
            balloon.classList.add('popping');
            createParticles(balloon.getBoundingClientRect(), balloonColor, balloonContainer);
            // The existing animationend listener will handle removal of the balloon itself
        }
    }, { once: true }); // Click listener should only fire once

    // Remove balloon from DOM after its animation (either floatUp or balloonPop) completes
    balloon.addEventListener('animationend', () => {
        balloon.remove();
    });

    balloonContainer.appendChild(balloon);
}

function createParticles(balloonRect, color, container) {
    const numberOfParticles = 10 + Math.floor(Math.random() * 10); // 10-19 particles
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position particle at the center of the balloon
        // Adjust for balloonContainer's offset if it's not the viewport
        const containerRect = container.getBoundingClientRect();
        particle.style.left = `${balloonRect.left + balloonRect.width / 2 - containerRect.left}px`;
        particle.style.top = `${balloonRect.top + balloonRect.height / 2 - containerRect.top}px`;
        
        particle.style.backgroundColor = color.replace('0.8', '1'); // Use solid version of balloon color

        // Random direction and distance for scatter
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 30; // Scatter distance 30-80px
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${translateX}px`);
        particle.style.setProperty('--ty', `${translateY}px`);
        
        // Optional: slightly varied animation duration or delay for particles
        // particle.style.animationDuration = `${0.5 + Math.random() * 0.3}s`;


        particle.addEventListener('animationend', () => {
            particle.remove();
        });
        container.appendChild(particle);
    }
}

function startBalloonParty(numberOfBalloons = 15) {
    // Create initial batch
    for (let i = 0; i < numberOfBalloons; i++) {
        setTimeout(createBalloon, Math.random() * 2000); // Stagger initial creation
    }

    // Optionally, create new balloons periodically
    // setInterval(createBalloon, 3000); // Example: new balloon every 3 seconds
}

export { startBalloonParty };
