// ============================================
// PANEL DE ADMINISTRACIÓN
// ============================================

// Variables del admin
let editingProductId = null;
let editingCarouselId = null;

// ============================================
// INICIALIZACIÓN DEL ADMIN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    renderAdminProducts();
    renderAdminCarousel();
    renderAdminConfig();
    updateSystemStatus();
    
    console.log('✅ Panel de administración inicializado');
});

function loadAdminData() {
    // Los datos se cargan desde localStorage en main.js
    // Esta función asegura que estamos sincronizados
    const savedProducts = localStorage.getItem('floristeria_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    const savedCarousel = localStorage.getItem('floristeria_carousel');
    if (savedCarousel) {
        carouselImages = JSON.parse(savedCarousel);
    }
    
    const savedConfig = localStorage.getItem('floristeria_config');
    if (savedConfig) {
        storeConfig = JSON.parse(savedConfig);
    }
    
    const savedCart = localStorage.getItem('floristeria_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================

function switchTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activar botón seleccionado
    document.querySelector(`.admin-tab[onclick*="${tabName}"]`).classList.add('active');
    
    // Actualizar estado del sistema si es necesario
    if (tabName === 'system') {
        updateSystemStatus();
    }
}

// ============================================
// ADMINISTRACIÓN DE PRODUCTOS
// ============================================

function saveProduct(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const seasonPrice = document.getElementById('productSeasonPrice').value ? 
        parseFloat(document.getElementById('productSeasonPrice').value) : 0;
    const image = document.getElementById('productImage').value.trim();
    const seasonActive = document.getElementById('productSeasonActive').checked;
    const blocked = document.getElementById('productBlocked').checked;
    
    // Validaciones
    if (!name || !category || !price || !image) {
        showSaveStatus('Por favor completa todos los campos requeridos', true);
        return;
    }
    
    if (price <= 0) {
        showSaveStatus('El precio debe ser mayor a cero', true);
        return;
    }
    
    if (seasonActive && seasonPrice <= 0) {
        showSaveStatus('El precio de temporada debe ser mayor a cero', true);
        return;
    }
    
    let product;
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                description,
                price,
                seasonPrice: seasonActive ? seasonPrice : 0,
                image,
                seasonActive,
                blocked
            };
        }
    } else {
        // Crear nuevo producto
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        product = {
            id: newId,
            name,
            category,
            description,
            price,
            seasonPrice: seasonActive ? seasonPrice : 0,
            image,
            seasonActive,
            blocked,
            createdAt: new Date().toISOString()
        };
        products.push(product);
    }
    
    // Guardar en localStorage
    localStorage.setItem('floristeria_products', JSON.stringify(products));
    
    // Recargar lista
    renderAdminProducts();
    
    // Limpiar formulario
    clearProductForm();
    
    // Mostrar confirmación
    showSaveStatus(productId ? 'Producto actualizado' : 'Producto agregado');
    
    // Forzar sincronización con otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_products',
        newValue: localStorage.getItem('floristeria_products')
    }));
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productSeasonPrice').value = product.seasonPrice || '';
    document.getElementById('productImage').value = product.image;
    document.getElementById('productSeasonActive').checked = product.seasonActive || false;
    document.getElementById('productBlocked').checked = product.blocked || false;
    
    // Scroll al formulario
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('productName').focus();
}

function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    products = products.filter(p => p.id !== id);
    localStorage.setItem('floristeria_products', JSON.stringify(products));
    renderAdminProducts();
    
    showSaveStatus('Producto eliminado');
    
    // Forzar sincronización
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_products',
        newValue: localStorage.getItem('floristeria_products')
    }));
}

function toggleProductBlock(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    product.blocked = !product.blocked;
    localStorage.setItem('floristeria_products', JSON.stringify(products));
    renderAdminProducts();
    
    showSaveStatus(product.blocked ? 'Producto bloqueado' : 'Producto desbloqueado');
    
    // Forzar sincronización
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_products',
        newValue: localStorage.getItem('floristeria_products')
    }));
}

function clearProductForm() {
    editingProductId = null;
    
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productSeasonPrice').value = '';
}

function renderAdminProducts() {
    const productsList = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsList.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: var(--gray-light); margin-bottom: 1rem;"></i>
                    <h3>No hay productos</h3>
                    <p>Agrega tu primer producto usando el formulario superior</p>
                </td>
            </tr>
        `;
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     class="product-image-preview" 
                     onerror="this.src='https://via.placeholder.com/60x60?text=Imagen+No+Disponible'">
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.blocked ? '<br><span class="badge badge-inactive" style="margin-top: 5px;">BLOQUEADO</span>' : ''}
            </td>
            <td>${product.category}</td>
            <td>
                ${product.seasonActive && product.seasonPrice ? `
                    <div><strong style="color: var(--warning);">₡${product.seasonPrice.toLocaleString()}</strong></div>
                    <div style="text-decoration: line-through; color: var(--gray); font-size: 0.9rem;">
                        ₡${product.price.toLocaleString()}
                    </div>
                ` : `
                    <strong>₡${product.price.toLocaleString()}</strong>
                `}
            </td>
            <td>
                ${product.blocked ? 
                    '<span class="badge badge-inactive">No visible</span>' : 
                    '<span class="badge badge-active">Activo</span>'
                }
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-block" onclick="toggleProductBlock(${product.id})">
                        <i class="fas ${product.blocked ? 'fa-unlock' : 'fa-lock'}"></i>
                        ${product.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button class="btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// ADMINISTRACIÓN DEL CARRUSEL
// ============================================

function saveCarouselSlide(event) {
    event.preventDefault();
    
    const image = document.getElementById('carouselImage').value.trim();
    const title = document.getElementById('carouselTitle').value.trim();
    const description = document.getElementById('carouselDescription').value.trim();
    
    if (!image) {
        showSaveStatus('La URL de la imagen es requerida', true);
        return;
    }
    
    if (editingCarouselId) {
        // Editar slide existente
        const index = carouselImages.findIndex(s => s.id === editingCarouselId);
        if (index !== -1) {
            carouselImages[index] = {
                ...carouselImages[index],
                image,
                title,
                description
            };
        }
        editingCarouselId = null;
    } else {
        // Agregar nuevo slide
        const newId = carouselImages.length > 0 ? Math.max(...carouselImages.map(s => s.id)) + 1 : 1;
        carouselImages.push({
            id: newId,
            image,
            title,
            description
        });
    }
    
    localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    renderAdminCarousel();
    document.getElementById('carouselForm').reset();
    
    showSaveStatus(editingCarouselId ? 'Slide actualizado' : 'Slide agregado');
    
    // Forzar sincronización
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_carousel',
        newValue: localStorage.getItem('floristeria_carousel')
    }));
}

function deleteCarouselSlide(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este slide?')) {
        return;
    }
    
    carouselImages = carouselImages.filter(s => s.id !== id);
    localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    renderAdminCarousel();
    
    showSaveStatus('Slide eliminado');
    
    // Forzar sincronización
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_carousel',
        newValue: localStorage.getItem('floristeria_carousel')
    }));
}

function renderAdminCarousel() {
    const carouselList = document.getElementById('carouselList');
    
    if (carouselImages.length === 0) {
        carouselList.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-images" style="font-size: 3rem; color: var(--gray-light); margin-bottom: 1rem;"></i>
                    <h3>No hay slides en el carrusel</h3>
                    <p>Agrega tu primer slide usando el formulario superior</p>
                </td>
            </tr>
        `;
        return;
    }
    
    carouselList.innerHTML = carouselImages.map(slide => `
        <tr>
            <td>
                <img src="${slide.image}" alt="${slide.title || 'Slide'}" 
                     class="carousel-image-preview"
                     onerror="this.src='https://via.placeholder.com/100x60?text=Imagen+No+Disponible'">
            </td>
            <td>${slide.title || 'Sin título'}</td>
            <td>${slide.description || 'Sin descripción'}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-danger" onclick="deleteCarouselSlide(${slide.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============================================
// ADMINISTRACIÓN DE CONFIGURACIÓN
// ============================================

function saveConfig(event) {
    event.preventDefault();
    
    // Obtener valores básicos
    storeConfig.phone = document.getElementById('configPhone').value.trim();
    storeConfig.email = document.getElementById('configEmail').value.trim();
    storeConfig.address = document.getElementById('configAddress').value.trim();
    storeConfig.description = document.getElementById('configDescription').value.trim();
    storeConfig.showDelivery = document.getElementById('configDelivery').checked;
    
    // Obtener horarios
    const hourInputs = document.querySelectorAll('.hour-input');
    storeConfig.hours = Array.from(hourInputs)
        .map(input => input.value.trim())
        .filter(value => value);
    
    // Obtener métodos de pago
    const paymentInputs = document.querySelectorAll('.payment-input');
    storeConfig.paymentMethods = Array.from(paymentInputs)
        .map(input => input.value.trim())
        .filter(value => value);
    
    // Validaciones básicas
    if (!storeConfig.phone || !storeConfig.email || !storeConfig.address) {
        showSaveStatus('Por favor completa todos los campos requeridos', true);
        return;
    }
    
    localStorage.setItem('floristeria_config', JSON.stringify(storeConfig));
    
    showSaveStatus('Configuración guardada');
    
    // Forzar sincronización
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'floristeria_config',
        newValue: localStorage.getItem('floristeria_config')
    }));
}

function renderAdminConfig() {
    // Información básica
    document.getElementById('configPhone').value = storeConfig.phone || '';
    document.getElementById('configEmail').value = storeConfig.email || '';
    document.getElementById('configAddress').value = storeConfig.address || '';
    document.getElementById('configDescription').value = storeConfig.description || '';
    document.getElementById('configDelivery').checked = storeConfig.showDelivery || false;
    
    // Horarios
    const hoursList = document.getElementById('hoursList');
    const hours = storeConfig.hours || getDefaultConfig().hours;
    
    hoursList.innerHTML = hours.map((hour, index) => `
        <div class="hours-list-item">
            <input type="text" class="form-control hour-input" value="${hour}" 
                   placeholder="Ej: Lunes a Viernes: 9:00 AM - 7:00 PM">
            <button type="button" class="remove-item-btn" onclick="removeHourItem(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Métodos de pago
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    const paymentMethods = storeConfig.paymentMethods || getDefaultConfig().paymentMethods;
    
    paymentMethodsList.innerHTML = paymentMethods.map((method, index) => `
        <div class="payment-item">
            <input type="text" class="form-control payment-input" value="${method}" 
                   placeholder="Ej: SINPE Móvil">
            <button type="button" class="remove-item-btn" onclick="removePaymentMethod(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function addHourItem() {
    const hoursList = document.getElementById('hoursList');
    const newItem = document.createElement('div');
    newItem.className = 'hours-list-item';
    newItem.innerHTML = `
        <input type="text" class="form-control hour-input" 
               placeholder="Ej: Lunes a Viernes: 9:00 AM - 7:00 PM">
        <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    hoursList.appendChild(newItem);
    newItem.querySelector('input').focus();
}

function removeHourItem(index) {
    storeConfig.hours.splice(index, 1);
    renderAdminConfig();
}

function addPaymentMethod() {
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    const newItem = document.createElement('div');
    newItem.className = 'payment-item';
    newItem.innerHTML = `
        <input type="text" class="form-control payment-input" 
               placeholder="Ej: SINPE Móvil">
        <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    paymentMethodsList.appendChild(newItem);
    newItem.querySelector('input').focus();
}

function removePaymentMethod(index) {
    storeConfig.paymentMethods.splice(index, 1);
    renderAdminConfig();
}

// ============================================
// SISTEMA Y HERRAMIENTAS
// ============================================

function updateSystemStatus() {
    // Productos
    const activeProducts = products.filter(p => !p.blocked).length;
    document.getElementById('status-products').innerHTML = `
        <strong>${products.length}</strong> productos totales<br>
        <span class="status-good">${activeProducts} activos</span> | 
        <span class="status-error">${products.length - activeProducts} bloqueados</span>
    `;
    
    // Carrusel
    document.getElementById('status-carousel').innerHTML = `
        <strong>${carouselImages.length}</strong> slides<br>
        ${carouselImages.length >= 3 ? 
            '<span class="status-good">✓ Carrusel completo</span>' : 
            '<span class="status-warning">¡Agrega más slides!</span>'
        }
    `;
    
    // Carrito
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('status-cart').innerHTML = `
        <strong>${totalItems}</strong> productos en carrito<br>
        <span class="status-good">${cart.length} items diferentes</span>
    `;
    
    // Almacenamiento
    const totalSize = JSON.stringify(localStorage).length;
    const sizeKB = (totalSize / 1024).toFixed(2);
    document.getElementById('status-storage').innerHTML = `
        <strong>${sizeKB} KB</strong> usados<br>
        <span class="${sizeKB > 500 ? 'status-warning' : 'status-good'}">
            ${sizeKB > 500 ? '✓ Buen rendimiento' : '✓ Excelente rendimiento'}
        </span>
    `;
}

function exportData() {
    const data = {
        products,
        carousel: carouselImages,
        config: storeConfig,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `floristeria-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSaveStatus('Datos exportados correctamente');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validar estructura básica
                if (!data.products || !data.carousel || !data.config) {
                    throw new Error('Archivo no válido');
                }
                
                // Confirmar importación
                if (!confirm(`¿Importar ${data.products.length} productos, ${data.carousel.length} slides y configuración?`)) {
                    return;
                }
                
                // Importar datos
                localStorage.setItem('floristeria_products', JSON.stringify(data.products));
                localStorage.setItem('floristeria_carousel', JSON.stringify(data.carousel));
                localStorage.setItem('floristeria_config', JSON.stringify(data.config));
                
                // Recargar
                loadAdminData();
                renderAdminProducts();
                renderAdminCarousel();
                renderAdminConfig();
                updateSystemStatus();
                
                showSaveStatus('Datos importados correctamente');
                
            } catch (error) {
                alert('Error al importar datos: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function resetData() {
    if (!confirm('¿ESTÁS SEGURO? Esto eliminará todos los productos, el carrusel y la configuración.')) {
        return;
    }
    
    if (!confirm('¿REALMENTE SEGURO? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Restablecer a datos por defecto
    products = getDefaultProducts();
    carouselImages = getDefaultCarousel();
    storeConfig = getDefaultConfig();
    cart = [];
    
    // Guardar
    localStorage.setItem('floristeria_products', JSON.stringify(products));
    localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    localStorage.setItem('floristeria_config', JSON.stringify(storeConfig));
    localStorage.setItem('floristeria_cart', JSON.stringify(cart));
    
    // Recargar
    loadAdminData();
    renderAdminProducts();
    renderAdminCarousel();
    renderAdminConfig();
    updateSystemStatus();
    
    showSaveStatus('Datos restablecidos a valores por defecto');
}

function createSampleData() {
    if (!confirm('¿Crear datos de ejemplo? Esto agregará productos y slides de muestra.')) {
        return;
    }
    
    // Ya tenemos datos por defecto cargados
    showSaveStatus('Datos de ejemplo creados');
    
    // Recargar
    loadAdminData();
    renderAdminProducts();
    renderAdminCarousel();
    updateSystemStatus();
}

// ============================================
// UTILIDADES
// ============================================

function showSaveStatus(message, isError = false) {
    const status = document.getElementById('saveStatus');
    const icon = status.querySelector('i');
    const text = status.querySelector('span');
    
    text.textContent = message;
    status.className = 'save-status';
    
    if (isError) {
        icon.className = 'fas fa-exclamation-circle';
        status.style.background = 'var(--danger)';
    } else {
        icon.className = 'fas fa-check-circle';
        status.style.background = 'var(--success)';
    }
    
    status.classList.add('show');
    
    setTimeout(() => {
        status.classList.remove('show');
    }, 3000);
}

// ============================================
// FUNCIONES PÚBLICAS PARA HTML
// ============================================

// Estas funciones son llamadas desde los onclick en el HTML
window.switchTab = switchTab;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleProductBlock = toggleProductBlock;
window.clearProductForm = clearProductForm;
window.saveCarouselSlide = saveCarouselSlide;
window.deleteCarouselSlide = deleteCarouselSlide;
window.saveConfig = saveConfig;
window.addHourItem = addHourItem;
window.removeHourItem = removeHourItem;
window.addPaymentMethod = addPaymentMethod;
window.removePaymentMethod = removePaymentMethod;
window.exportData = exportData;
window.importData = importData;
window.resetData = resetData;
window.createSampleData = createSampleData;
