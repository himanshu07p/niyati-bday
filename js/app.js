const introModulePromise = import('./components/intro.js');
const messageModulePromise = import('./components/message.js');
const balloonsModulePromise = import('./components/balloons.js');
const butterfliesModulePromise = import('./components/butterflies.js'); // Import butterflies

async function revealContentAndInitialize() {
    const app = document.getElementById('app');
    app.style.display = 'block'; // Show the app container
    document.body.classList.add('content-revealed'); // Adjust body display

    const messageModule = await messageModulePromise;
    const balloonsModule = await balloonsModulePromise; // Await balloons module
    const butterfliesModule = await butterfliesModulePromise; // Await butterflies module

    // Sample data
    const userName = "Niyati";

    app.appendChild(messageModule.renderMessage(userName));

    balloonsModule.startBalloonParty(); // Start the balloons
    butterfliesModule.startSpecialButterflyJourney(); // Updated function call
}

document.addEventListener('DOMContentLoaded', () => {
    const giftWrapper = document.getElementById('gift-wrapper');
    const giftBox = document.getElementById('gift-box');

    if (giftBox && giftWrapper) {
        giftBox.addEventListener('click', () => {
            giftBox.classList.add('opening'); // Trigger lid opening animation

            // Add 'opened' class to trigger fade out after a short delay for lid animation
            setTimeout(() => {
                giftBox.classList.add('opened');
            }, 100); // Small delay to ensure 'opening' styles apply first

            giftBox.addEventListener('animationend', (event) => {
                // Ensure we're listening for the fadeOut animation
                if (event.animationName === 'giftFadeOut') {
                    giftWrapper.classList.add('hidden'); // Hide the entire gift wrapper
                    
                    revealContentAndInitialize(); // Initialize and render content
                }
            }, { once: true }); // Ensure the event listener runs only once for this animation
        }, { once: true }); 
    } else {
        // Fallback if gift box is not found, reveal content directly
        if(giftWrapper) giftWrapper.classList.add('hidden'); // Hide wrapper if it exists
        revealContentAndInitialize();
    }
});