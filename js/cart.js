// ============================================
// CARRITO DE COMPRAS COMPLETO - ENVÍO ₡0
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
    
    // Actualizar totales - IMPORTANTE: verificar dirección
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
// FUNCIONES DE CARRITO (definidas en main.js pero usadas aquí)
// ============================================

// Estas funciones están definidas en main.js, pero las referenciamos aquí
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
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

// Estas funciones son llamadas desde los onclick en el HTML
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
