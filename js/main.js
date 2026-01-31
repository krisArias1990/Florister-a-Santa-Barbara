// ============================================
// SISTEMA PRINCIPAL COMPLETO CON ENVÍOS POR KM
// ============================================

// Variables globales
let cart = JSON.parse(localStorage.getItem('floristeria_cart')) || [];
let products = [];
let categories = [];
let carouselImages = [];
let currentCarouselSlide = 0;
let carouselInterval;
let storeConfig = {};
let selectedPaymentMethod = '';

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    initCarousel();
    updateCartCount();
    updateFooterYear();
    setupDeliveryForm();
    
    console.log('✅ Tienda inicializada correctamente');
    
    // Configurar fecha mínima (hoy)
    const today = new Date();
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = today.toISOString().split('T')[0];
    }
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
        console.log('Configuración cargada:', storeConfig);
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
        const imageSrc = product.image && product.image.startsWith('data:image') ? 
            product.image : 
            (product.image || 'https://via.placeholder.com/600x400?text=Floristería+Santa+Bárbara');
        
        return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                ${product.seasonActive && product.seasonPrice > 0 ? '<span class="product-badge">Oferta</span>' : ''}
                <img src="${imageSrc}" alt="${product.name}" class="product-image" 
                     onclick="openImageModal('${imageSrc.replace(/'/g, "\\'")}')">
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

// ============================================
// FOOTER Y CONTACTO
// ============================================

function updateContactInfo() {
    if (!storeConfig.phone) return;
    
    document.getElementById('contact-phone').textContent = `Tel: ${storeConfig.phone}`;
    document.getElementById('contact-address').textContent = storeConfig.address || 'Santa Bárbara, Heredia, Costa Rica';
    document.getElementById('contact-hours').textContent = storeConfig.hours?.[0] || 'Lunes a Sábado: 9am - 7pm';
}

function updateFooterInfo() {
    console.log('Actualizando footer con:', storeConfig);
    
    // Descripción
    const footerDesc = document.getElementById('footer-description');
    if (footerDesc && storeConfig.description) {
        footerDesc.textContent = storeConfig.description;
    } else if (footerDesc) {
        footerDesc.textContent = "Flores frescas y arreglos florales para toda ocasión. Calidad y elegancia en cada detalle.";
    }
    
    // Dirección
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) {
        footerAddress.textContent = storeConfig.address || 'Santa Bárbara, Heredia, Costa Rica';
    }
    
    // Teléfono
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
        footerPhone.textContent = storeConfig.phone ? `Tel: ${storeConfig.phone}` : 'Tel: (506) 8605-3613';
    }
    
    // Email
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
        footerEmail.textContent = storeConfig.email || 'ventas@floristeriasantabarbara.com';
    }
    
    // Horarios
    const hoursList = document.getElementById('hours-list');
    if (hoursList && storeConfig.hours && storeConfig.hours.length > 0) {
        hoursList.innerHTML = storeConfig.hours.map(hour => `
            <li>${hour}</li>
        `).join('');
    } else if (hoursList) {
        hoursList.innerHTML = `
            <li><strong>Lunes a Viernes:</strong> 9:00 AM - 7:00 PM</li>
            <li><strong>Sábados:</strong> 9:30 AM - 7:00 PM</li>
            <li><strong>Almuerzo:</strong> 12:30 PM - 1:30 PM</li>
            <li><strong>Domingos:</strong> <span style="color: var(--danger);">CERRADO</span></li>
        `;
    }
    
    // Información de delivery
    const deliveryInfo = document.getElementById('delivery-info');
    if (deliveryInfo) {
        deliveryInfo.style.display = storeConfig.showDelivery ? 'block' : 'none';
    }
    
    // Métodos de pago
    const paymentList = document.getElementById('payment-list');
    if (paymentList && storeConfig.paymentMethods && storeConfig.paymentMethods.length > 0) {
        paymentList.innerHTML = storeConfig.paymentMethods.map(method => `
            <li><i class="fas fa-check"></i> ${method}</li>
        `).join('');
    } else if (paymentList) {
        paymentList.innerHTML = `
            <li><i class="fas fa-check"></i> SINPE Móvil</li>
            <li><i class="fas fa-check"></i> Efectivo</li>
            <li><i class="fas fa-check"></i> Tarjetas</li>
            <li><i class="fas fa-check"></i> Transferencia</li>
        `;
    }
}

function updateFooterYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================
// CARRITO DE COMPRAS MEJORADO
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
    
    // Calcular envío basado en dirección
    const shipping = calculateShippingCost();
    
    // Calcular total
    const total = subtotal + shipping;
    
    // Renderizar items
    cartItemsContainer.innerHTML = cart.map(item => {
        const imageSrc = item.image && item.image.startsWith('data:image') ? 
            item.image : 
            (item.image || 'https://via.placeholder.com/60x60?text=Imagen');
        
        return `
        <div class="cart-item">
            <img src="${imageSrc}" alt="${item.name}" class="cart-item-image">
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
    
    if (shipping === 0) {
        cartShipping.textContent = 'Gratis';
    } else {
        cartShipping.textContent = `₡${shipping.toLocaleString()}`;
    }
    
    cartTotal.textContent = `₡${total.toLocaleString()}`;
}

function calculateShippingCost() {
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
    const addressField = document.getElementById('deliveryAddress');
    
    // Si es recoger en tienda, no hay envío
    if (deliveryType && deliveryType.value === 'pickup') {
        return 0;
    }
    
    // Si no hay dirección o está vacío, mostrar 0
    if (!addressField || !addressField.value.trim()) {
        return 0;
    }
    
    // Simulación de cálculo por KM (₡650 por KM)
    // En un sistema real, aquí llamarías a una API de Google Maps
    const distance = calculateDistance(addressField.value);
    return Math.round(distance * 650);
}

function calculateDistance(address) {
    // Simulación: basado en palabras clave en la dirección
    let distance = 5; // Distancia base en KM
    
    if (address.toLowerCase().includes('santa bárbara') || 
        address.toLowerCase().includes('santa barbara')) {
        distance = 2; // Muy cerca
    } else if (address.toLowerCase().includes('heredia')) {
        distance = 5;
    } else if (address.toLowerCase().includes('san josé') || 
               address.toLowerCase().includes('san jose')) {
        distance = 15;
    } else if (address.toLowerCase().includes('alajuela')) {
        distance = 10;
    } else if (address.toLowerCase().includes('cartago')) {
        distance = 20;
    }
    
    return distance;
}

function calculateShippingFromAddress() {
    const addressField = document.getElementById('deliveryAddress');
    const shippingElement = document.getElementById('cartShipping');
    const shippingDistance = document.getElementById('shippingDistance');
    
    if (!addressField || !addressField.value.trim()) {
        if (shippingElement) shippingElement.textContent = '₡0';
        if (shippingDistance) shippingDistance.textContent = '';
        return;
    }
    
    const distance = calculateDistance(addressField.value);
    const shippingCost = Math.round(distance * 650);
    
    if (shippingElement) {
        shippingElement.textContent = `₡${shippingCost.toLocaleString()}`;
    }
    
    if (shippingDistance) {
        shippingDistance.textContent = `(Aprox. ${distance} km)`;
    }
    
    // Recalcular total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = `₡${total.toLocaleString()}`;
    }
}

function setupDeliveryForm() {
    const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
    const addressField = document.getElementById('addressField');
    
    if (deliveryTypeRadios.length > 0 && addressField) {
        // Configurar evento para mostrar/ocultar dirección
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'delivery') {
                    addressField.style.display = 'block';
                    // Hacer campos de dirección requeridos
                    const addressInput = document.getElementById('deliveryAddress');
                    if (addressInput) addressInput.required = true;
                } else {
                    addressField.style.display = 'none';
                    // Quitar requerido
                    const addressInput = document.getElementById('deliveryAddress');
                    if (addressInput) addressInput.required = false;
                }
                calculateShippingFromAddress();
            });
        });
        
        // Estado inicial
        const initialValue = document.querySelector('input[name="deliveryType"]:checked');
        if (initialValue && initialValue.value === 'pickup') {
            addressField.style.display = 'none';
            const addressInput = document.getElementById('deliveryAddress');
            if (addressInput) addressInput.required = false;
        }
    }
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    
    // Remover selección anterior
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Agregar selección actual
    const selectedEl = document.querySelector(`.payment-method[onclick*="${method}"]`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
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
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
        showNotification('Carrito vaciado');
    }
}

// ============================================
// WHATSAPP ORDER MEJORADO
// ============================================

function sendWhatsAppOrder() {
    // Obtener datos del formulario
    const receiverName = document.getElementById('receiverName').value.trim();
    const receiverPhone = document.getElementById('receiverPhone').value.trim();
    const senderName = document.getElementById('senderName').value.trim();
    const senderPhone = document.getElementById('senderPhone').value.trim();
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const addressDetails = document.getElementById('addressDetails').value.trim();
    const cardMessage = document.getElementById('cardMessage').value.trim();
    const deliveryDate = document.getElementById('deliveryDate').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const orderNotes = document.getElementById('orderNotes').value.trim();
    
    // Validaciones
    if (!receiverName || !receiverPhone) {
        showNotification('Por favor ingresa el nombre y teléfono de QUIEN RECIBE', true);
        document.getElementById('receiverName').focus();
        return;
    }
    
    if (!senderName || !senderPhone) {
        showNotification('Por favor ingresa tu nombre y teléfono (QUIEN ENVÍA)', true);
        document.getElementById('senderName').focus();
        return;
    }
    
    if (!deliveryType) {
        showNotification('Por favor selecciona cómo quieres recibir el pedido', true);
        return;
    }
    
    if (deliveryType.value === 'delivery' && !deliveryAddress) {
        showNotification('Por favor ingresa la dirección para el envío', true);
        document.getElementById('deliveryAddress').focus();
        return;
    }
    
    if (!deliveryDate) {
        showNotification('Por favor selecciona la fecha de entrega', true);
        document.getElementById('deliveryDate').focus();
        return;
    }
    
    if (!deliveryTime) {
        showNotification('Por favor selecciona el horario de entrega', true);
        document.getElementById('deliveryTime').focus();
        return;
    }
    
    if (!selectedPaymentMethod) {
        showNotification('Por favor selecciona un método de pago', true);
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', true);
        return;
    }
    
    // Calcular totales
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = calculateShippingCost();
    const total = subtotal + shipping;
    
    // Formatear mensaje
    let message = `¡Hola! Quiero hacer un pedido:\n\n`;
    
    // Información de envío/recepción
    message += `📦 *INFORMACIÓN DEL PEDIDO*\n`;
    message += `📍 *Tipo:* ${deliveryType.value === 'delivery' ? 'ENVÍO A DOMICILIO' : 'RECOGER EN TIENDA'}\n`;
    message += `📅 *Fecha:* ${formatDate(deliveryDate)}\n`;
    message += `⏰ *Horario:* ${deliveryTime}\n\n`;
    
    // Quien recibe
    message += `👤 *QUIEN RECIBE*\n`;
    message += `• Nombre: ${receiverName}\n`;
    message += `• Teléfono: ${receiverPhone}\n\n`;
    
    // Quien envía
    message += `👤 *QUIEN ENVÍA*\n`;
    message += `• Nombre: ${senderName}\n`;
    message += `• Teléfono: ${senderPhone}\n\n`;
    
    // Dirección si aplica
    if (deliveryType.value === 'delivery' && deliveryAddress) {
        message += `🏠 *DIRECCIÓN DE ENVÍO*\n`;
        message += `• Dirección: ${deliveryAddress}\n`;
        if (addressDetails) {
            message += `• Señas: ${addressDetails}\n`;
        }
        
        // Generar enlace de Google Maps
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress + ', Santa Bárbara, Heredia, Costa Rica')}`;
        message += `• 📍 Google Maps: ${mapsLink}\n\n`;
    }
    
    // Método de pago
    const paymentMethods = {
        'sinpe': 'SINPE Móvil',
        'efectivo': 'Efectivo',
        'tarjeta': 'Tarjetas',
        'transferencia': 'Transferencia'
    };
    message += `💳 *MÉTODO DE PAGO*\n`;
    message += `• ${paymentMethods[selectedPaymentMethod] || selectedPaymentMethod}\n`;
    message += `• Referencia SINPE: 8605-3613\n\n`;
    
    // Productos
    message += `🛒 *PRODUCTOS*\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    // Total
    message += `\n💰 *TOTAL*\n`;
    message += `• Subtotal: ₡${subtotal.toLocaleString()}\n`;
    if (shipping > 0) {
        const distance = calculateDistance(deliveryAddress);
        message += `• Envío: ₡${shipping.toLocaleString()} (${distance} km x ₡650)\n`;
    } else {
        message += `• Envío: Gratis\n`;
    }
    message += `• *Total a pagar:* ₡${total.toLocaleString()}\n\n`;
    
    // Mensaje de tarjeta
    if (cardMessage) {
        message += `💌 *MENSAJE EN TARJETA*\n`;
        message += `"${cardMessage}"\n\n`;
    }
    
    // Notas adicionales
    if (orderNotes) {
        message += `📝 *NOTAS ADICIONALES*\n`;
        message += `${orderNotes}\n\n`;
    }
    
    // Información de contacto
    message += `---\n`;
    message += `📞 *Floristería Santa Bárbara*\n`;
    message += `• Teléfono: ${storeConfig.phone || '(506) 8605-3613'}\n`;
    message += `• Dirección: ${storeConfig.address || 'Santa Bárbara, Heredia, Costa Rica'}\n`;
    message += `• Horario: ${storeConfig.hours?.[0] || 'Lunes a Sábado: 9am - 7pm'}\n\n`;
    
    message += `¿Podrían confirmarme la disponibilidad? ¡Gracias!`;
    
    // Codificar mensaje
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = storeConfig.phone ? storeConfig.phone.replace(/\D/g, '') : '50686053613';
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Limpiar después de enviar
    clearCartAfterOrder();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function clearCartAfterOrder() {
    cart = [];
    saveCart();
    updateCartCount();
    
    // Limpiar formulario
    document.getElementById('receiverName').value = '';
    document.getElementById('receiverPhone').value = '';
    document.getElementById('senderName').value = '';
    document.getElementById('senderPhone').value = '';
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('addressDetails').value = '';
    document.getElementById('cardMessage').value = '';
    document.getElementById('deliveryDate').value = '';
    document.getElementById('deliveryTime').value = '';
    document.getElementById('orderNotes').value = '';
    
    // Resetear método de pago
    selectedPaymentMethod = '';
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    showNotification('Pedido enviado por WhatsApp');
    closeCart();
}

// ============================================
// NOTIFICACIONES Y MODALES
// ============================================

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
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

// ============================================
// SINCRONIZACIÓN
// ============================================

window.addEventListener('storage', function(event) {
    if (event.key === 'floristeria_products') {
        products = JSON.parse(event.newValue || '[]');
        renderProducts();
        renderCategories();
    }
    
    if (event.key === 'floristeria_carousel') {
        carouselImages = JSON.parse(event.newValue || '[]');
        renderCarousel();
    }
    
    if (event.key === 'floristeria_config') {
        storeConfig = JSON.parse(event.newValue || '{}');
        updateContactInfo();
        updateFooterInfo();
    }
    
    if (event.key === 'floristeria_cart') {
        cart = JSON.parse(event.newValue || '[]');
        updateCartCount();
    }
});

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.selectPayment = selectPayment;
window.calculateShippingFromAddress = calculateShippingFromAddress;
