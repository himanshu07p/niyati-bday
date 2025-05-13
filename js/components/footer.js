function renderFooter() {
    const footerElement = document.createElement('footer');
    
    const footerText = document.createElement('p');
    footerText.textContent = '© 2024 Birthday Surprise. All rights reserved.';
    
    footerElement.appendChild(footerText);
    
    return footerElement;
}

export { renderFooter };
