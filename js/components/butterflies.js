let specialButterfly = null;
let butterflyAnimationId = null; // Used by both animate and hover
let hoverStartTime = 0; 

// Easing function: easeInOutQuad
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateButterflyToTarget(butterfly, targetX, targetY, duration, onComplete) {
    const startX = parseFloat(butterfly.style.getPropertyValue('--currentX') || 0);
    const startY = parseFloat(butterfly.style.getPropertyValue('--currentY') || 0);
    const startTime = performance.now();

    const swayAmplitude = 30 + Math.random() * 40; 
    const swayFrequency = Math.random() * 2 + 2; 

    let currentAngle = parseFloat(butterfly.style.getPropertyValue('--flight-angle')) || 0;

    // Set initial orientation towards the target
    const dxInitial = targetX - startX;
    const dyInitial = targetY - startY;
    if (Math.hypot(dxInitial, dyInitial) > 0.1) { 
        currentAngle = Math.atan2(dyInitial, dxInitial) * (180 / Math.PI);
        butterfly.style.setProperty('--flight-angle', `${currentAngle}deg`);
    }

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        let rawProgress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeInOutQuad(rawProgress);

        const linearX = startX + (targetX - startX) * easedProgress;
        const linearY = startY + (targetY - startY) * easedProgress;
        
        // --- Rotation Logic ---
        // Calculate a point slightly ahead on the linear path for orientation
        const lookAheadFactor = 0.05; // How far ahead to look (as a fraction of total progress)
        const lookAheadProgress = Math.min(rawProgress + lookAheadFactor, 1);
        const lookAheadEasedProgress = easeInOutQuad(lookAheadProgress);

        const lookAheadPointX = startX + (targetX - startX) * lookAheadEasedProgress;
        const lookAheadPointY = startY + (targetY - startY) * lookAheadEasedProgress;

        // Vector from current linear position to the look-ahead point
        const dirX = lookAheadPointX - linearX;
        const dirY = lookAheadPointY - linearY;

        if (Math.hypot(dirX, dirY) > 0.1) { // If there's a clear direction to look ahead
            const targetAngle = Math.atan2(dirY, dirX) * (180 / Math.PI);
            
            let angleDifference = targetAngle - currentAngle;
            // Normalize the angle difference to be between -180 and 180 degrees
            while (angleDifference > 180) angleDifference -= 360;
            while (angleDifference < -180) angleDifference += 360;

            const maxDegreesPerFrame = 5; // Max rotation in one frame (adjust for smoothness)
            const rotationThisFrame = Math.max(-maxDegreesPerFrame, Math.min(maxDegreesPerFrame, angleDifference));
            
            currentAngle += rotationThisFrame;
            currentAngle = (currentAngle + 360) % 360; // Normalize currentAngle

            butterfly.style.setProperty('--flight-angle', `${currentAngle}deg`);
        }
        // --- End Rotation Logic ---

        const pathLengthToTarget = Math.hypot(targetX - linearX, targetY - linearY);
        let perpendicularX = 0;
        let perpendicularY = 0;

        if (pathLengthToTarget > 0.1) {
            perpendicularX = -(targetY - linearY) / pathLengthToTarget;
            perpendicularY = (targetX - linearX) / pathLengthToTarget;
        }
        
        const swayOffset = swayAmplitude * Math.sin(swayFrequency * rawProgress * Math.PI);
        
        const currentX = linearX + perpendicularX * swayOffset;
        const currentY = linearY + perpendicularY * swayOffset;

        butterfly.style.setProperty('--currentX', `${currentX}px`);
        butterfly.style.setProperty('--currentY', `${currentY}px`);

        if (rawProgress < 1) {
            butterflyAnimationId = requestAnimationFrame(step);
        } else {
            butterfly.style.setProperty('--currentX', `${targetX}px`);
            butterfly.style.setProperty('--currentY', `${targetY}px`);
            
            // Ensure final orientation is correct
            if (Math.hypot(targetX - startX, targetY - startY) > 0.1) { // Avoid atan2(0,0) if start and target are same
                 const finalAngle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI);
                 butterfly.style.setProperty('--flight-angle', `${finalAngle}deg`);
            }


            if (onComplete) {
                onComplete();
            }
        }
    }
    butterflyAnimationId = requestAnimationFrame(step);
}

function hoverButterfly(butterfly, centerX, centerY) {
    const hoverRadiusX = 15 + Math.random() * 10; 
    const hoverRadiusY = 10 + Math.random() * 5;  
    const hoverSpeed = 0.0015 + Math.random() * 0.001; 
    hoverStartTime = performance.now(); 

    function hoverStep(currentTime) {
        const elapsedTime = currentTime - hoverStartTime;
        
        const hoverX = centerX + hoverRadiusX * Math.cos(elapsedTime * hoverSpeed);
        const hoverY = centerY + hoverRadiusY * Math.sin(elapsedTime * hoverSpeed * 1.5); 

        butterfly.style.setProperty('--currentX', `${hoverX}px`);
        butterfly.style.setProperty('--currentY', `${hoverY}px`);

        butterflyAnimationId = requestAnimationFrame(hoverStep); 
    }
    if (butterflyAnimationId) { // Clear any ongoing animation (like a previous flight)
        cancelAnimationFrame(butterflyAnimationId);
    }
    butterflyAnimationId = requestAnimationFrame(hoverStep);
}

function startSpecialButterflyJourney() {
    const container = document.getElementById('butterfly-container');
    if (!container) return;

    if (specialButterfly && specialButterfly.parentElement) {
        specialButterfly.remove();
    }
    if (butterflyAnimationId) {
        cancelAnimationFrame(butterflyAnimationId);
        butterflyAnimationId = null;
    }

    specialButterfly = document.createElement('div');
    specialButterfly.className = 'butterfly'; // This class has the combined transform
    specialButterfly.textContent = '🦋';
    specialButterfly.style.fontSize = '30px'; 

    // Flutter animation is applied by the .butterfly class in CSS
    specialButterfly.style.animationDuration = `${Math.random() * 0.2 + 0.25}s`; // Randomize flutter speed

    container.appendChild(specialButterfly);

    // Delay to ensure flower image is rendered and its position can be read
    setTimeout(() => {
        const flowerImageEl = document.getElementById('bottom-right-image');

        if (!flowerImageEl) {
            console.error("Target flower image for butterfly not found.");
            if (specialButterfly.parentElement) specialButterfly.remove();
            return;
        }
        
        const rectFlower = flowerImageEl.getBoundingClientRect(); 
        
        const butterflyWidth = specialButterfly.offsetWidth || 30; // Fallback if offsetWidth is 0
        const butterflyHeight = specialButterfly.offsetHeight || 30; // Fallback

        const visibleFlowerTop = rectFlower.top;
        const visibleFlowerLeft = rectFlower.left;
        const visibleFlowerWidth = rectFlower.width / 2; 
        const visibleFlowerHeight = rectFlower.height / 2;

        const hoverCenterX = visibleFlowerLeft + visibleFlowerWidth / 2 - butterflyWidth / 2;
        const hoverCenterY = visibleFlowerTop - butterflyHeight - 10; // 10px padding above flower

        // Set initial position and orientation for hovering
        specialButterfly.style.setProperty('--currentX', `${hoverCenterX}px`);
        specialButterfly.style.setProperty('--currentY', `${hoverCenterY}px`);
        specialButterfly.style.setProperty('--flight-angle', `-15deg`); // Example: faces slightly up-left
        specialButterfly.style.opacity = '1'; // Make it visible
        
        console.log("Special butterfly appearing and starting hover.");
        hoverButterfly(specialButterfly, hoverCenterX, hoverCenterY);

    }, 800); // Increased delay slightly to ensure all elements are stable
}

export { startSpecialButterflyJourney };
