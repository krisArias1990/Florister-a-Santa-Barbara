// ============================================
// SISTEMA DE CARRITO DE COMPRAS
// ============================================

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
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
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
    `).join('');
    
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
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

// Estas funciones son llamadas desde los onclick en el HTML
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.closeCart = closeCart;
