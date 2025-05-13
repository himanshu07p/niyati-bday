const introModulePromise = import('./components/intro.js');
const messageModulePromise = import('./components/message.js');

async function revealContentAndInitialize() {
    const app = document.getElementById('app');
    app.style.display = 'block'; // Show the app container
    document.body.classList.add('content-revealed'); // Adjust body display

    const introModule = await introModulePromise;
    const messageModule = await messageModulePromise;

    // Sample data
    const userName = "Niyati";

    app.appendChild(introModule.renderIntro());
    app.appendChild(messageModule.renderMessage(userName));
}

document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('gift-box');
    const appContainer = document.getElementById('app');

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            giftBox.classList.add('hidden'); // Hide the gift box
            
            // Ensure the body is no longer trying to center everything once content is shown
            document.body.style.display = 'block'; 
            document.body.style.justifyContent = 'initial';
            document.body.style.alignItems = 'initial';
            
            revealContentAndInitialize(); // Initialize and render content
        }, { once: true }); // Ensure the event listener runs only once
    } else {
        // Fallback if gift box is not found, reveal content directly
        revealContentAndInitialize();
    }
});