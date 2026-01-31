// ============================================
// SISTEMA PRINCIPAL MODIFICADO PARA IMÁGENES BASE64
// ============================================

// Variables globales (se sincronizan con admin.js)
let cart = JSON.parse(localStorage.getItem('floristeria_cart')) || [];
let products = [];
let categories = [];
let carouselImages = [];
let currentCarouselSlide = 0;
let carouselInterval;
let storeConfig = {};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    initCarousel();
    updateCartCount();
    updateFooterYear();
    
    console.log('✅ Tienda inicializada correctamente');
});

function loadAllData() {
    // Cargar productos
    const savedProducts = localStorage.getItem('floristeria_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = getDefaultProducts();
        localStorage.setItem('floristeria_products', JSON.stringify(products));
    }
    
    // Cargar carrusel
    const savedCarousel = localStorage.getItem('floristeria_carousel');
    if (savedCarousel) {
        carouselImages = JSON.parse(savedCarousel);
    } else {
        carouselImages = getDefaultCarousel();
        localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    }
    
    // Cargar configuración
    const savedConfig = localStorage.getItem('floristeria_config');
    if (savedConfig) {
        storeConfig = JSON.parse(savedConfig);
    } else {
        storeConfig = getDefaultConfig();
        localStorage.setItem('floristeria_config', JSON.stringify(storeConfig));
    }
    
    // Extraer categorías únicas
    categories = [...new Set(products.filter(p => !p.blocked).map(p => p.category))];
    
    // Renderizar todo
    renderCarousel();
    renderProducts();
    renderCategories();
    updateContactInfo();
    updateFooterInfo();
}

function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Ramos de Rosas Rojas",
            description: "Elegante ramo con 24 rosas rojas frescas, perfecto para aniversarios y declaraciones de amor.",
            price: 25000,
            seasonPrice: 22000,
            category: "Rosas",
            image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            seasonActive: true,
            blocked: false
        },
        {
            id: 2,
            name: "Arreglo de Girasoles",
            description: "Colorido arreglo con girasoles frescos que iluminarán cualquier espacio.",
            price: 18000,
            seasonPrice: 15000,
            category: "Girasoles",
            image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            seasonActive: true,
            blocked: false
        }
    ];
}

function getDefaultCarousel() {
    return [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            title: "Flores Frescas para Cada Ocasión",
            description: "Encuentra el arreglo perfecto para celebrar la vida"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            title: "Envío a Domicilio Gratis",
            description: "Llevamos felicidad hasta tu puerta en Santa Bárbara y alrededores"
        }
    ];
}

function getDefaultConfig() {
    return {
        phone: "(506) 8605-3613",
        email: "ventas@floristeriasantabarbara.com",
        address: "Santa Bárbara, Heredia, Costa Rica",
        description: "Flores frescas y arreglos florales para toda ocasión. Calidad y elegancia en cada detalle.",
        showDelivery: true,
        hours: [
            "Lunes a Viernes: 9:00 AM - 7:00 PM",
            "Sábados: 9:30 AM - 7:00 PM",
            "Almuerzo: 12:30 PM - 1:30 PM",
            "Domingos: CERRADO"
        ],
        paymentMethods: [
            "SINPE Móvil",
            "Efectivo",
            "Tarjetas",
            "Transferencia"
        ]
    };
}

// ============================================
// RENDERIZADO DE PRODUCTOS
// ============================================

function renderProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const productsToShow = filteredProducts || products.filter(p => !p.blocked);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    productsGrid.innerHTML = productsToShow.map(product => {
        // Verificar si la imagen es Base64 o URL
        const imageSrc = product.image && product.image.startsWith('data:image') ? 
            product.image : 
            (product.image || 'https://via.placeholder.com/600x400?text=Floristería+Santa+Bárbara');
        
        return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                ${product.seasonActive && product.seasonPrice > 0 ? '<span class="product-badge">Oferta</span>' : ''}
                <img src="${imageSrc}" alt="${product.name}" class="product-image" 
                     onclick="openImageModal('${imageSrc.replace(/'/g, "\\'")}')"
                     onerror="this.src='https://via.placeholder.com/600x400?text=Imagen+no+disponible'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="price-container">
                    ${product.seasonActive && product.seasonPrice > 0 ? `
                        <span class="season-price">₡${product.seasonPrice.toLocaleString()}</span>
                        <span class="original-price">₡${product.price.toLocaleString()}</span>
                    ` : `
                        <span class="product-price">₡${product.price.toLocaleString()}</span>
                    `}
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" 
                        ${product.blocked ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                    ${product.blocked ? 'No Disponible' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function renderCategories() {
    const categoryFilters = document.getElementById('categoryFilters');
    
    categoryFilters.innerHTML = `
        <button class="category-btn active" data-category="all" onclick="filterByCategory('all')">
            Todos
        </button>
        ${categories.map(category => `
            <button class="category-btn" data-category="${category}" onclick="filterByCategory('${category}')">
                ${category}
            </button>
        `).join('')}
    `;
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

function filterByCategory(category) {
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    if (category === 'all') {
        renderProducts();
    } else {
        const filteredProducts = products.filter(p => 
            !p.blocked && p.category === category
        );
        renderProducts(filteredProducts);
    }
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(p => 
        !p.blocked && (
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        )
    );
    
    renderProducts(filteredProducts);
}

// ============================================
// CARRUSEL
// ============================================

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
    
    carouselInner.innerHTML = carouselImages.map((slide, index) => {
        // Verificar si la imagen es Base64 o URL
        const imageSrc = slide.image && slide.image.startsWith('data:image') ? 
            slide.image : 
            (slide.image || 'https://via.placeholder.com/1200x400?text=Floristería+Santa+Bárbara');
        
        return `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${imageSrc}" alt="${slide.title || 'Imagen del carrusel'}" class="carousel-img"
                 onerror="this.src='https://via.placeholder.com/1200x400?text=Error+cargando+imagen'">
            ${slide.title || slide.description ? `
                <div class="carousel-caption">
                    ${slide.title ? `<h2>${slide.title}</h2>` : ''}
                    ${slide.description ? `<p>${slide.description}</p>` : ''}
                </div>
            ` : ''}
        </div>
        `;
    }).join('');
    
    carouselIndicators.innerHTML = carouselImages.map((_, index) => `
        <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                onclick="goToSlide(${index})"></button>
    `).join('');
}

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
// INFORMACIÓN DE CONTACTO Y FOOTER
// ============================================

function updateContactInfo() {
    if (!storeConfig.phone) return;
    
    document.getElementById('contact-phone').textContent = `Tel: ${storeConfig.phone}`;
    document.getElementById('contact-address').textContent = storeConfig.address;
    document.getElementById('contact-hours').textContent = storeConfig.hours?.[0] || 'Lunes a Sábado: 8am - 7pm';
}

function updateFooterInfo() {
    if (!storeConfig) return;
    
    // Descripción
    const footerDesc = document.getElementById('footer-description');
    if (footerDesc && storeConfig.description) {
        footerDesc.textContent = storeConfig.description;
    }
    
    // Dirección
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress && storeConfig.address) {
        footerAddress.textContent = storeConfig.address;
    }
    
    // Teléfono
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone && storeConfig.phone) {
        footerPhone.textContent = `Tel: ${storeConfig.phone}`;
    }
    
    // Email
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail && storeConfig.email) {
        footerEmail.textContent = storeConfig.email;
    }
    
    // Horarios
    const hoursList = document.getElementById('hours-list');
    if (hoursList && storeConfig.hours) {
        hoursList.innerHTML = storeConfig.hours.map(hour => `
            <li>${hour}</li>
        `).join('');
    }
    
    // Información de delivery
    const deliveryInfo = document.getElementById('delivery-info');
    if (deliveryInfo) {
        deliveryInfo.style.display = storeConfig.showDelivery ? 'block' : 'none';
    }
    
    // Métodos de pago
    const paymentList = document.getElementById('payment-list');
    if (paymentList && storeConfig.paymentMethods) {
        paymentList.innerHTML = storeConfig.paymentMethods.map(method => `
            <li><i class="fas fa-check"></i> ${method}</li>
        `).join('');
    }
}

function updateFooterYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// CARRITO DE COMPRAS
// ============================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.blocked) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.seasonActive && product.seasonPrice > 0 ? product.seasonPrice : product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`"${product.name}" agregado al carrito`);
    
    // Si el carrito está abierto, actualizarlo
    if (document.getElementById('cartModal').classList.contains('active')) {
        renderCartItems();
    }
}

function saveCart() {
    localStorage.setItem('floristeria_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos desde el catálogo</p>
            </div>
        `;
        cartSubtotal.textContent = '₡0';
        cartShipping.textContent = '₡0';
        cartTotal.textContent = '₡0';
        return;
    }
    
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calcular envío (gratis para compras mayores a ₡30,000)
    const shipping = subtotal >= 30000 ? 0 : 2000;
    
    // Calcular total
    const total = subtotal + shipping;
    
    // Renderizar items
    cartItemsContainer.innerHTML = cart.map(item => {
        // Verificar si la imagen es Base64 o URL
        const imageSrc = item.image && item.image.startsWith('data:image') ? 
            item.image : 
            (item.image || 'https://via.placeholder.com/60x60?text=Imagen');
        
        return `
        <div class="cart-item">
            <img src="${imageSrc}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/60x60?text=Imagen'">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₡${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    // Actualizar totales
    cartSubtotal.textContent = `₡${subtotal.toLocaleString()}`;
    cartShipping.textContent = shipping === 0 ? 'Gratis' : `₡${shipping.toLocaleString()}`;
    cartTotal.textContent = `₡${total.toLocaleString()}`;
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartCount();
    renderCartItems();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Producto eliminado del carrito');
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Carrito vaciado');
}

function sendWhatsAppOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();
    
    // Validaciones básicas
    if (!name) {
        showNotification('Por favor ingresa tu nombre', true);
        document.getElementById('customerName').focus();
        return;
    }
    
    if (!phone) {
        showNotification('Por favor ingresa tu teléfono', true);
        document.getElementById('customerPhone').focus();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', true);
        return;
    }
    
    // Calcular totales
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= 30000 ? 0 : 2000;
    const total = subtotal + shipping;
    
    // Formatear mensaje
    let message = `¡Hola! Quiero hacer un pedido:\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Teléfono:* ${phone}\n`;
    if (address) message += `*Dirección:* ${address}\n`;
    if (notes) message += `*Notas:* ${notes}\n\n`;
    message += `*Pedido:*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Subtotal:* ₡${subtotal.toLocaleString()}\n`;
    message += `*Envío:* ${shipping === 0 ? 'Gratis' : `₡${shipping.toLocaleString()}`}\n`;
    message += `*Total:* ₡${total.toLocaleString()}\n\n`;
    message += `¿Podrían confirmarme la disponibilidad y el tiempo de entrega? ¡Gracias!`;
    
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = storeConfig.phone ? storeConfig.phone.replace(/\D/g, '') : '50686053613';
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Limpiar carrito después de enviar
    clearCart();
    closeCart();
    
    // Limpiar formulario
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('orderNotes').value = '';
    
    showNotification('Pedido enviado por WhatsApp');
}

// ============================================
// MODALES
// ============================================

function openCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.remove('error');
    
    if (isError) {
        notification.classList.add('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ============================================
// SISTEMA DE SINCRONIZACIÓN
// ============================================

// Escuchar cambios en localStorage desde otras pestañas
window.addEventListener('storage', function(event) {
    if (event.key === 'floristeria_products') {
        products = JSON.parse(event.newValue || '[]');
        renderProducts();
        renderCategories();
        console.log('🔄 Productos actualizados desde otra pestaña');
    }
    
    if (event.key === 'floristeria_carousel') {
        carouselImages = JSON.parse(event.newValue || '[]');
        renderCarousel();
        console.log('🔄 Carrusel actualizado desde otra pestaña');
    }
    
    if (event.key === 'floristeria_config') {
        storeConfig = JSON.parse(event.newValue || '{}');
        updateContactInfo();
        updateFooterInfo();
        console.log('🔄 Configuración actualizada desde otra pestaña');
    }
    
    if (event.key === 'floristeria_cart') {
        cart = JSON.parse(event.newValue || '[]');
        updateCartCount();
        console.log('🔄 Carrito actualizado desde otra pestaña');
    }
});

// ============================================
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

// Estas funciones son llamadas desde los onclick en el HTML
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.filterByCategory = filterByCategory;
window.searchProducts = searchProducts;
