// ============================================
// SISTEMA DE CARRUSEL
// ============================================

function initCarousel() {
    // Iniciar rotación automática
    startCarouselRotation();
    
    // Detener rotación al pasar el mouse
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarouselRotation);
        carousel.addEventListener('mouseleave', startCarouselRotation);
    }
}

function renderCarousel() {
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    
    if (carouselImages.length === 0) {
        carouselInner.innerHTML = `
            <div class="carousel-item">
                <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <div style="text-align: center;">
                        <i class="fas fa-spa" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                        <h2>Floristería Santa Bárbara</h2>
                        <p>Agrega imágenes al carrusel desde el panel de administración</p>
                    </div>
                </div>
            </div>
        `;
        carouselIndicators.innerHTML = '';
        return;
    }
    
    carouselInner.innerHTML = carouselImages.map((slide, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${slide.image}" alt="${slide.title || 'Imagen del carrusel'}" class="carousel-img">
            ${slide.title || slide.description ? `
                <div class="carousel-caption">
                    ${slide.title ? `<h2>${slide.title}</h2>` : ''}
                    ${slide.description ? `<p>${slide.description}</p>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
    
    carouselIndicators.innerHTML = carouselImages.map((_, index) => `
        <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                onclick="goToSlide(${index})"></button>
    `).join('');
}

function startCarouselRotation() {
    stopCarouselRotation(); // Detener cualquier intervalo existente
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarouselRotation() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function nextSlide() {
    if (carouselImages.length === 0) return;
    
    currentCarouselSlide = (currentCarouselSlide + 1) % carouselImages.length;
    updateCarousel();
}

function prevSlide() {
    if (carouselImages.length === 0) return;
    
    currentCarouselSlide = (currentCarouselSlide - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
}

function goToSlide(index) {
    currentCarouselSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const carouselInner = document.getElementById('carousel-inner');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!carouselInner || carouselImages.length === 0) return;
    
    // Mover el carrusel
    carouselInner.style.transform = `translateX(-${currentCarouselSlide * 100}%)`;
    
    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentCarouselSlide);
    });
    
    // Reiniciar temporizador
    startCarouselRotation();
}

// ============================================
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

// Estas funciones son llamadas desde los onclick en el HTML
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
