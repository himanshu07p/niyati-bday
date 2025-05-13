function renderMessage(userName) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    messageContainer.classList.add('animate-fadeInUp', 'anim-delay-600ms'); // Fade in with delay

    const messageHeader = document.createElement('h2');
    messageHeader.textContent = `Happy Birthday, ${userName}! 🎉`; // Added emoji
    messageContainer.appendChild(messageHeader);

    const messageBody = document.createElement('p');
    // Using template literals for multi-line string and easier formatting
    messageBody.innerHTML = `
        I hope your special day is filled with happiness, laughter, and all the people and moments you love most. 
        You bring so much joy and positivity into my life, and I’m so grateful for your friendship. 
        May your year ahead be full of new adventures, wonderful surprises, and dreams coming true. 
        Here’s to celebrating you today and always!
        <br><br>
        Wishing you all the best,
        <br>
        Himanshu
    `;
    messageContainer.appendChild(messageBody);

    return messageContainer;
}

export { renderMessage };