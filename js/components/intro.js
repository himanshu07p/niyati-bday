function renderIntro() {
    const introSection = document.createElement('section');
    introSection.classList.add('intro');

    const pageHeader = document.createElement('header');
    const mainHeading = document.createElement('h1');
    mainHeading.textContent = 'Happy Birthday!';
    mainHeading.classList.add('animate-textFocusIn'); // Animation for main title
    pageHeader.appendChild(mainHeading);

    introSection.appendChild(pageHeader);

    return introSection;
}

export { renderIntro };