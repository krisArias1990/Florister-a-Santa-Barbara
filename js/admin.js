// ============================================
// PANEL DE ADMINISTRACIÓN COMPLETO
// ============================================

// Variables del admin
let editingProductId = null;
let editingCarouselId = null;
let products = [];
let carouselImages = [];
let storeConfig = {};
let cart = [];

// ============================================
// INICIALIZACIÓN DEL ADMIN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    setupImageUploads();
    renderAdminProducts();
    renderAdminCarousel();
    renderAdminConfig();
    updateSystemStatus();
    
    console.log('✅ Panel de administración inicializado');
    
    // Configurar arrastrar y soltar
    setupDragAndDrop();
});

function loadAdminData() {
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
    
    // Cargar carrito
    const savedCart = localStorage.getItem('floristeria_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
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
// SISTEMA DE SUBIDA DE IMÁGENES
// ============================================

function setupImageUploads() {
    // Configurar arrastrar y soltar para productos
    const productUploadArea = document.getElementById('productUploadArea');
    const productFileInput = document.getElementById('productImageFile');
    
    productUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        productUploadArea.classList.add('dragover');
    });
    
    productUploadArea.addEventListener('dragleave', function(e) {
        productUploadArea.classList.remove('dragover');
    });
    
    productUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        productUploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            productFileInput.files = e.dataTransfer.files;
            handleProductImageUpload({ target: productFileInput });
        }
    });
    
    // Configurar arrastrar y soltar para carrusel
    const carouselUploadArea = document.getElementById('carouselUploadArea');
    const carouselFileInput = document.getElementById('carouselImageFile');
    
    carouselUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        carouselUploadArea.classList.add('dragover');
    });
    
    carouselUploadArea.addEventListener('dragleave', function(e) {
        carouselUploadArea.classList.remove('dragover');
    });
    
    carouselUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        carouselUploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            carouselFileInput.files = e.dataTransfer.files;
            handleCarouselImageUpload({ target: carouselFileInput });
        }
    });
}

function setupDragAndDrop() {
    // Configurar para todas las áreas de upload
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function(e) {
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length) {
                // Determinar si es para producto o carrusel
                if (this.id === 'productUploadArea') {
                    const input = document.getElementById('productImageFile');
                    input.files = files;
                    handleProductImageUpload({ target: input });
                } else if (this.id === 'carouselUploadArea') {
                    const input = document.getElementById('carouselImageFile');
                    input.files = files;
                    handleCarouselImageUpload({ target: input });
                }
            }
        });
    });
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validaciones
    if (file.size > 2 * 1024 * 1024) {
        showSaveStatus('La imagen es demasiado grande. Máximo 2MB.', true);
        return;
    }
    
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        showSaveStatus('Solo se permiten imágenes JPG, JPEG o PNG.', true);
        return;
    }
    
    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Guardar en campo oculto
        document.getElementById('productImageData').value = base64Image;
        
        // Mostrar vista previa
        const previewImg = document.getElementById('productPreviewImg');
        previewImg.src = base64Image;
        document.getElementById('productImagePreview').style.display = 'block';
        document.getElementById('productUploadArea').style.display = 'none';
        
        showSaveStatus('Imagen del producto cargada correctamente');
    };
    
    reader.readAsDataURL(file);
}

function handleCarouselImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validaciones
    if (file.size > 2 * 1024 * 1024) {
        showSaveStatus('La imagen es demasiado grande. Máximo 2MB.', true);
        return;
    }
    
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        showSaveStatus('Solo se permiten imágenes JPG, JPEG o PNG.', true);
        return;
    }
    
    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Guardar en campo oculto
        document.getElementById('carouselImageData').value = base64Image;
        
        // Mostrar vista previa
        const previewImg = document.getElementById('carouselPreviewImg');
        previewImg.src = base64Image;
        document.getElementById('carouselImagePreview').style.display = 'block';
        document.getElementById('carouselUploadArea').style.display = 'none';
        
        showSaveStatus('Imagen del carrusel cargada correctamente');
    };
    
    reader.readAsDataURL(file);
}

function removeProductImage() {
    document.getElementById('productImageData').value = '';
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImagePreview').style.display = 'none';
    document.getElementById('productUploadArea').style.display = 'block';
}

function removeCarouselImage() {
    document.getElementById('carouselImageData').value = '';
    document.getElementById('carouselImageFile').value = '';
    document.getElementById('carouselImagePreview').style.display = 'none';
    document.getElementById('carouselUploadArea').style.display = 'block';
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
    const imageData = document.getElementById('productImageData').value;
    const seasonActive = document.getElementById('productSeasonActive').checked;
    const blocked = document.getElementById('productBlocked').checked;
    
    // Validaciones
    if (!name || !category || !price) {
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
    
    if (!imageData && !productId) {
        showSaveStatus('Debes subir una imagen para el producto', true);
        return;
    }
    
    let product;
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            // Mantener la imagen existente si no se subió una nueva
            const existingImage = imageData || products[index].image;
            
            products[index] = {
                ...products[index],
                name,
                category,
                description,
                price,
                seasonPrice: seasonActive ? seasonPrice : 0,
                image: existingImage,
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
            image: imageData,
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
    document.getElementById('productSeasonActive').checked = product.seasonActive || false;
    document.getElementById('productBlocked').checked = product.blocked || false;
    
    // Configurar imagen existente
    if (product.image && product.image.startsWith('data:image')) {
        // Es una imagen Base64
        document.getElementById('productImageData').value = product.image;
        document.getElementById('productPreviewImg').src = product.image;
        document.getElementById('productImagePreview').style.display = 'block';
        document.getElementById('productUploadArea').style.display = 'none';
    } else {
        // Es una URL
        document.getElementById('productImageData').value = product.image;
        document.getElementById('productPreviewImg').src = product.image;
        document.getElementById('productImagePreview').style.display = 'block';
        document.getElementById('productUploadArea').style.display = 'none';
    }
    
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
    document.getElementById('productImageData').value = '';
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImagePreview').style.display = 'none';
    document.getElementById('productUploadArea').style.display = 'block';
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
    
    productsList.innerHTML = products.map(product => {
        // Verificar si la imagen es Base64 o URL
        const imageSrc = product.image && product.image.startsWith('data:image') ? 
            product.image : 
            (product.image || 'https://via.placeholder.com/60x60?text=Sin+imagen');
        
        return `
        <tr>
            <td>
                <img src="${imageSrc}" alt="${product.name}" 
                     class="product-image-preview"
                     onerror="this.src='https://via.placeholder.com/60x60?text=Error'">
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.blocked ? '<br><span class="badge badge-inactive" style="margin-top: 5px;">BLOQUEADO</span>' : ''}
            </td>
            <td>${product.category}</td>
            <td>
                ${product.seasonActive && product.seasonPrice > 0 ? `
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
                ${product.image && product.image.startsWith('data:image') ? 
                    '<br><span class="badge badge-warning" style="margin-top: 3px;">Imagen local</span>' : 
                    ''
                }
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-secondary" onclick="toggleProductBlock(${product.id})">
                        <i class="fas ${product.blocked ? 'fa-unlock' : 'fa-lock'}"></i>
                        ${product.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

// ============================================
// ADMINISTRACIÓN DEL CARRUSEL
// ============================================

function saveCarouselSlide(event) {
    event.preventDefault();
    
    const imageData = document.getElementById('carouselImageData').value;
    const title = document.getElementById('carouselTitle').value.trim();
    const description = document.getElementById('carouselDescription').value.trim();
    
    if (!imageData) {
        showSaveStatus('Debes subir una imagen para el carrusel', true);
        return;
    }
    
    if (editingCarouselId) {
        // Editar slide existente
        const index = carouselImages.findIndex(s => s.id === editingCarouselId);
        if (index !== -1) {
            carouselImages[index] = {
                ...carouselImages[index],
                image: imageData,
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
            image: imageData,
            title,
            description
        });
    }
    
    localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    renderAdminCarousel();
    
    // Limpiar formulario
    document.getElementById('carouselForm').reset();
    document.getElementById('carouselImageData').value = '';
    document.getElementById('carouselImageFile').value = '';
    document.getElementById('carouselImagePreview').style.display = 'none';
    document.getElementById('carouselUploadArea').style.display = 'block';
    
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
    
    carouselList.innerHTML = carouselImages.map(slide => {
        // Verificar si la imagen es Base64 o URL
        const imageSrc = slide.image && slide.image.startsWith('data:image') ? 
            slide.image : 
            (slide.image || 'https://via.placeholder.com/100x60?text=Sin+imagen');
        
        return `
        <tr>
            <td>
                <img src="${imageSrc}" alt="${slide.title || 'Slide'}" 
                     class="carousel-image-preview"
                     onerror="this.src='https://via.placeholder.com/100x60?text=Error'">
            </td>
            <td>${slide.title || 'Sin título'}</td>
            <td>${slide.description || 'Sin descripción'}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-danger" onclick="deleteCarouselSlide(${slide.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
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
    
    if (storeConfig.hours.length === 0) {
        showSaveStatus('Debes agregar al menos un horario', true);
        return;
    }
    
    if (storeConfig.paymentMethods.length === 0) {
        showSaveStatus('Debes agregar al menos un método de pago', true);
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
    const localImages = products.filter(p => p.image && p.image.startsWith('data:image')).length;
    document.getElementById('status-products').innerHTML = `
        <strong>${products.length}</strong> productos totales<br>
        <span class="status-good">${activeProducts} activos</span> | 
        <span class="status-error">${products.length - activeProducts} bloqueados</span><br>
        <span class="status-warning">${localImages} imágenes locales</span>
    `;
    
    // Carrusel
    const localCarousel = carouselImages.filter(s => s.image && s.image.startsWith('data:image')).length;
    document.getElementById('status-carousel').innerHTML = `
        <strong>${carouselImages.length}</strong> slides<br>
        <span class="${carouselImages.length >= 3 ? 'status-good' : 'status-warning'}">
            ${carouselImages.length >= 3 ? '✓ Carrusel completo' : '¡Agrega más slides!'}
        </span><br>
        <span class="status-warning">${localCarousel} imágenes locales</span>
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
    const usedPercentage = (sizeKB / 5000) * 100; // 5MB máximo aproximado
    document.getElementById('status-storage').innerHTML = `
        <strong>${sizeKB} KB</strong> usados<br>
        <span class="${usedPercentage > 80 ? 'status-error' : usedPercentage > 50 ? 'status-warning' : 'status-good'}">
            ${usedPercentage > 80 ? '⚠️ Espacio casi lleno' : usedPercentage > 50 ? '✓ Bueno' : '✓ Excelente'}
        </span>
    `;
}

function exportData() {
    const data = {
        products,
        carousel: carouselImages,
        config: storeConfig,
        exportDate: new Date().toISOString(),
        version: '2.0',
        note: 'Este archivo contiene imágenes en formato Base64'
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

function clearImageCache() {
    if (!confirm('¿Limpiar cache de imágenes? Esto convertirá las imágenes locales a URLs de placeholder.')) {
        return;
    }
    
    let convertedCount = 0;
    
    // Convertir imágenes de productos
    products.forEach(product => {
        if (product.image && product.image.startsWith('data:image')) {
            product.image = 'https://via.placeholder.com/600x400?text=Floristería+Santa+Bárbara';
            convertedCount++;
        }
    });
    
    // Convertir imágenes del carrusel
    carouselImages.forEach(slide => {
        if (slide.image && slide.image.startsWith('data:image')) {
            slide.image = 'https://via.placeholder.com/1200x400?text=Floristería+Santa+Bárbara';
            convertedCount++;
        }
    });
    
    // Guardar cambios
    localStorage.setItem('floristeria_products', JSON.stringify(products));
    localStorage.setItem('floristeria_carousel', JSON.stringify(carouselImages));
    
    // Recargar
    renderAdminProducts();
    renderAdminCarousel();
    updateSystemStatus();
    
    showSaveStatus(`${convertedCount} imágenes convertidas a placeholders`);
}

// ============================================
// UTILIDADES
// ============================================

function showSaveStatus(message, isError = false) {
    const status = document.getElementById('saveStatus');
    const icon = status.querySelector('i');
    const text = document.getElementById('saveStatusText');
    
    text.textContent = message;
    status.className = 'save-status';
    
    if (isError) {
        icon.className = 'fas fa-exclamation-circle';
        status.classList.add('error');
    } else {
        icon.className = 'fas fa-check-circle';
        status.classList.remove('error');
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
window.handleProductImageUpload = handleProductImageUpload;
window.removeProductImage = removeProductImage;
window.saveCarouselSlide = saveCarouselSlide;
window.handleCarouselImageUpload = handleCarouselImageUpload;
window.removeCarouselImage = removeCarouselImage;
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
window.clearImageCache = clearImageCache;
