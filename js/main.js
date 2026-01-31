// ============================================
// SISTEMA PRINCIPAL - FLORISTERÍA SANTA BÁRBARA
// ============================================

// Variables globales
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
        // Datos de ejemplo si no hay nada
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
        },
        {
            id: 3,
            name: "Centro de Mesa Premium",
            description: "Elegante centro de mesa para eventos especiales con flores de temporada.",
            price: 35000,
            seasonPrice: 0,
            category: "Arreglos",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            seasonActive: false,
            blocked: false
        },
        {
            id: 4,
            name: "Orquídeas Exóticas",
            description: "Hermosa planta de orquídea en maceta decorativa, ideal para regalo corporativo.",
            price: 22000,
            seasonPrice: 19000,
            category: "Plantas",
            image: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            seasonActive: true,
            blocked: false
        },
        {
            id: 5,
            name: "Tulipanes Holandeses",
            description: "Delicado ramo de tulipanes importados de Holanda en colores variados.",
            price: 28000,
            seasonPrice: 0,
            category: "Tulipanes",
            image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            seasonActive: false,
            blocked: false
        },
        {
            id: 6,
            name: "Rosas Blancas Premium",
            description: "Exquisito ramo de 36 rosas blancas para bodas y eventos especiales.",
            price: 32000,
            seasonPrice: 28000,
            category: "Rosas",
            image: "https://images.unsplash.com/photo-1553531889-e5864f8a0672?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
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
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            title: "Ofertas de Temporada",
            description: "Descuentos especiales en nuestros arreglos más populares"
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
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                ${product.seasonActive && product.seasonPrice ? '<span class="product-badge">Oferta</span>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onclick="openImageModal('${product.image}')">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="price-container">
                    ${product.seasonActive && product.seasonPrice ? `
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
    `).join('');
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
// MODALES
// ============================================

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
// EVENT LISTENERS GLOBALES
// ============================================

// Cerrar modales al hacer clic fuera
document.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    const imageModal = document.getElementById('imageModal');
    
    if (cartModal && cartModal.classList.contains('active') && 
        event.target === cartModal) {
        closeCart();
    }
    
    if (imageModal && imageModal.classList.contains('active') && 
        event.target === imageModal) {
        closeImageModal();
    }
});

// Cerrar modales con ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCart();
        closeImageModal();
    }
});

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
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.blocked) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.seasonActive && product.seasonPrice ? product.seasonPrice : product.price,
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
};

window.openCart = function() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
};

window.closeCart = function() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};
