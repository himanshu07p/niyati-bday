function renderGallery(images) {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery';
    galleryContainer.classList.add('animate-fadeInUp', 'anim-delay-800ms'); // Fade in with delay

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.className = 'gallery-image';
        galleryContainer.appendChild(imgElement);
    });

    return galleryContainer;
}

export { renderGallery };