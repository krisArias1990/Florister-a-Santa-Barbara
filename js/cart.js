// ============================================
// CARRITO DE COMPRAS COMPLETO
// ============================================

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
    
    // ✅ CALCULAR SOLO SUBTOTAL - ENVÍO ₡0
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 0; // ✅ ENVÍO SIEMPRE ₡0 HASTA CONFIRMACIÓN
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
    
    // Verificar si hay dirección para mostrar "POR CONFIRMAR"
    const addressField = document.getElementById('deliveryAddress');
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
    
    if (deliveryType && deliveryType.value === 'pickup') {
        cartShipping.textContent = 'Gratis';
        cartShipping.style.color = 'var(--success)';
        cartTotal.textContent = `₡${total.toLocaleString()}`;
    } else if (addressField && addressField.value.trim()) {
        // Si hay dirección, mostrar "POR CONFIRMAR"
        cartShipping.textContent = 'POR CONFIRMAR';
        cartShipping.style.color = 'var(--warning)';
        cartShipping.style.fontWeight = '600';
        cartTotal.textContent = `₡${subtotal.toLocaleString()} + ENVÍO`;
    } else {
        // Sin dirección, mostrar ₡0
        cartShipping.textContent = '₡0';
        cartShipping.style.color = 'inherit';
        cartTotal.textContent = `₡${total.toLocaleString()}`;
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
// FUNCIÓN DE WHATSAPP (CORREGIDA)
// ============================================

function sendWhatsAppOrder() {
    console.log('✅ Función sendWhatsAppOrder ejecutada');
    
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
    
    console.log('Datos capturados:', {
        receiverName, receiverPhone, senderName, senderPhone,
        deliveryType: deliveryType?.value,
        deliveryAddress, addressDetails, cardMessage,
        deliveryDate, deliveryTime, orderNotes
    });
    
    // Validaciones básicas
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
    
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Formatear mensaje
    let message = `¡Hola! Quiero hacer un pedido:\n\n`;
    
    // Información del pedido
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
        
        const googleMapsLink = generateGoogleMapsLink(deliveryAddress);
        const wazeLink = generateWazeLink(deliveryAddress);
        
        message += `• 📍 Google Maps: ${googleMapsLink}\n`;
        message += `• 🚗 Waze: ${wazeLink}\n\n`;
        
        message += `💰 *COSTO DE ENVÍO:* *POR CONFIRMAR*\n`;
        message += `   Nuestro equipo calculará el costo exacto.\n\n`;
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
    
    if (deliveryType.value === 'delivery') {
        message += `• Envío a domicilio: *POR CONFIRMAR*\n`;
        message += `• *Total productos:* ₡${subtotal.toLocaleString()}\n`;
        message += `• *+ Envío (por confirmar):* ---\n`;
        message += `• *Total final (con envío):* POR CONFIRMAR\n\n`;
    } else {
        message += `• Recoger en tienda: Gratis\n`;
        message += `• *Total a pagar:* ₡${subtotal.toLocaleString()}\n\n`;
    }
    
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
    
    console.log('Mensaje generado:', message);
    
    // Codificar mensaje
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = storeConfig.phone ? storeConfig.phone.replace(/\D/g, '') : '50686053613';
    
    console.log('URL de WhatsApp:', `https://wa.me/${phoneNumber}?text=${encodedMessage.substring(0, 100)}...`);
    
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

function generateGoogleMapsLink(address) {
    const encodedAddress = encodeURIComponent(address + ', Santa Bárbara, Heredia, Costa Rica');
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

function generateWazeLink(address) {
    const encodedAddress = encodeURIComponent(address + ', Santa Bárbara, Heredia');
    return `https://waze.com/ul?q=${encodedAddress}`;
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
// FUNCIONES AUXILIARES
// ============================================

window.saveCart = function() {
    localStorage.setItem('floristeria_cart', JSON.stringify(cart));
};

window.updateCartCount = function() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
};

window.showNotification = function(message, isError = false) {
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
};

// ============================================
// VARIABLES GLOBALES (definidas en main.js)
// ============================================

// Estas variables están definidas en main.js
// Si no están definidas, las definimos aquí como backup
if (typeof cart === 'undefined') window.cart = [];
if (typeof storeConfig === 'undefined') window.storeConfig = {};
if (typeof selectedPaymentMethod === 'undefined') window.selectedPaymentMethod = '';

// ============================================
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
