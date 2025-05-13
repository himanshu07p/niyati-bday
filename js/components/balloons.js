let activeBalloons = [];
let tiltInfluenceX = 0;
let tiltInfluenceY = 0;
let balloonCreationIntervalId = null; 
let animationFrameId = null;

const TILT_SENSITIVITY_FACTOR = 0.3;
const BASE_UPWARD_SPEED = -2.0; 
const SWAY_MAGNITUDE = 0.15;
const SWAY_SPEED = 0.001;

function handleDeviceOrientation(event) {
    let { beta, gamma } = event; 

    gamma = Math.max(-90, Math.min(90, gamma)); 
    beta = Math.max(-90, Math.min(90, beta));   

    tiltInfluenceX = -(gamma / 90) * TILT_SENSITIVITY_FACTOR * 5;
    tiltInfluenceY = (beta / 90) * TILT_SENSITIVITY_FACTOR * 5;
}

function updateBalloonPositions() {
    const now = Date.now();
    for (let i = activeBalloons.length - 1; i >= 0; i--) {
        const balloonData = activeBalloons[i];
        const { element, x, y, swayOffset } = balloonData;

        const currentSway = Math.sin(swayOffset + now * SWAY_SPEED) * SWAY_MAGNITUDE;
        balloonData.x += tiltInfluenceX + currentSway;
        balloonData.y += BASE_UPWARD_SPEED + tiltInfluenceY;

        element.style.transform = `translate(${balloonData.x}px, ${balloonData.y}px) rotate(${tiltInfluenceX * 1.5}deg)`;

        const rect = element.getBoundingClientRect(); 
        if (rect.bottom < 0) {
            element.remove();
            activeBalloons.splice(i, 1);
        }
        
        const containerWidth = element.parentElement.offsetWidth;
        if (x > containerWidth) balloonData.x = -rect.width; 
        if (x < -rect.width) balloonData.x = containerWidth;
    }
    
    if (animationFrameId !== null) {
        animationFrameId = requestAnimationFrame(updateBalloonPositions);
    }
}

function createBalloon() {
    const balloonContainer = document.getElementById('balloon-container');
    if (!balloonContainer) return;

    const element = document.createElement('div');
    element.className = 'balloon';

    const colors = [
        'rgba(255, 105, 180, 0.8)', 'rgba(137, 207, 240, 0.8)',
        'rgba(255, 218, 185, 0.8)', 'rgba(173, 216, 230, 0.8)',
        'rgba(221, 160, 221, 0.8)'
    ];
    const balloonColor = colors[Math.floor(Math.random() * colors.length)];
    element.style.backgroundColor = balloonColor;

    const approxCssWidth = 60; 
    const initialX = Math.random() * (balloonContainer.offsetWidth - approxCssWidth);
    
    const initialY = balloonContainer.offsetHeight + Math.random() * 50; 
    element.style.opacity = '0'; 
    element.style.transform = `translate(${initialX}px, ${initialY}px)`;

    const balloonData = {
        element, x: initialX, y: initialY,
        swayOffset: Math.random() * Math.PI * 2
    };
    activeBalloons.push(balloonData);

    setTimeout(() => { element.style.opacity = '0.8'; }, 100 + Math.random() * 500); 

    element.addEventListener('click', () => {
        element.remove();
        const index = activeBalloons.findIndex(b => b.element === element);
        if (index > -1) activeBalloons.splice(index, 1);
    }, { once: true });

    balloonContainer.appendChild(element);
}

function startBalloonParty(numberOfBalloons = 10) { 
    activeBalloons.forEach(b => b.element.remove());
    activeBalloons = [];

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    if (balloonCreationIntervalId) {
        clearInterval(balloonCreationIntervalId);
    }

    window.removeEventListener('deviceorientation', handleDeviceOrientation, true);

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                } else {
                    console.warn("DeviceOrientation permission not granted.");
                }
            })
            .catch(console.error);
    } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    } else {
        console.warn("DeviceOrientationEvent not supported.");
    }

    for (let i = 0; i < numberOfBalloons; i++) {
        setTimeout(createBalloon, Math.random() * 1000 + i * 100);
    }
    
    balloonCreationIntervalId = setInterval(createBalloon, 2000);

    animationFrameId = requestAnimationFrame(updateBalloonPositions);
}

export { startBalloonParty };
