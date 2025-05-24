// Données simulées des produits (remplacer par un appel API réel)
const products = [
    {
        id: 'esp32-1',
        name: 'ESP32 DevKit V1',
        category: 'microcontroller',
        price: 12.99,
        originalPrice: 15.99,
        description: 'Carte de développement ESP32 avec WiFi et Bluetooth intégrés',
        shortDescription: 'Carte ESP32 avec WiFi/Bluetooth',
        image: 'assets/images/esp32.jpg',
        images: [
            'assets/images/esp32.jpg',
            'assets/images/esp32-2.jpg',
            'assets/images/esp32-3.jpg'
        ],
        stock: 15,
        rating: 4.5,
        reviewCount: 24,
        specs: {
            'Processeur': 'Dual-core 32-bit LX6',
            'Fréquence': '240 MHz',
            'WiFi': '802.11 b/g/n',
            'Bluetooth': '4.2 BR/EDR et BLE',
            'GPIO': '38 pins',
            'Flash': '4 MB',
            'Tension': '3.3V'
        },
        fullDescription: 'La carte de développement ESP32 DevKit V1 est une plateforme idéale pour prototyper vos projets IoT. Avec son processeur dual-core, sa connectivité WiFi et Bluetooth intégrée, et ses nombreuses entrées/sorties, cette carte est parfaite pour les applications de smart farming.'
    },
    {
        id: 'dht22-1',
        name: 'Capteur DHT22',
        category: 'sensor',
        price: 8.50,
        description: 'Capteur de température et humidité haute précision',
        shortDescription: 'Capteur Temp/Humidité précision',
        image: 'assets/images/dht22.jpg',
        images: [
            'assets/images/dht22.jpg',
            'assets/images/dht22-2.jpg'
        ],
        stock: 42,
        rating: 4.2,
        reviewCount: 18,
        specs: {
            'Plage température': '-40°C à 80°C',
            'Précision température': '±0.5°C',
            'Plage humidité': '0-100% RH',
            'Précision humidité': '±2% RH',
            'Tension': '3.3V - 6V',
            'Interface': 'Numérique'
        },
        fullDescription: 'Le capteur DHT22 est un capteur numérique de température et d\'humidité relative de haute précision. Il est parfait pour le monitoring des conditions environnementales dans votre ferme intelligente.'
    },
    {
        id: 'soil-moisture-1',
        name: 'Capteur d\'humidité du sol',
        category: 'sensor',
        price: 6.99,
        description: 'Capteur d\'humidité du sol avec sortie analogique',
        shortDescription: 'Capteur humidité sol analogique',
        image: 'assets/images/soil-moisture.jpg',
        images: [
            'assets/images/soil-moisture.jpg',
            'assets/images/soil-moisture-2.jpg'
        ],
        stock: 0,
        rating: 3.9,
        reviewCount: 12,
        specs: {
            'Type': 'Résistif',
            'Tension': '3.3V - 5V',
            'Sortie': 'Analogique',
            'Plage de détection': '0-100% (relative)',
            'Longueur sonde': '5cm'
        },
        fullDescription: 'Ce capteur d\'humidité du sol permet de mesurer la teneur en eau du sol. Il est idéal pour automatiser l\'irrigation dans votre ferme intelligente.'
    },
    {
        id: 'starter-kit-1',
        name: 'Kit Smart Farm Starter',
        category: 'kit',
        price: 89.99,
        originalPrice: 99.99,
        description: 'Kit complet pour démarrer votre projet de ferme intelligente',
        shortDescription: 'Kit complet smart farming',
        image: 'assets/images/starter-kit.jpg',
        images: [
            'assets/images/starter-kit.jpg',
            'assets/images/starter-kit-2.jpg',
            'assets/images/starter-kit-3.jpg'
        ],
        stock: 8,
        rating: 4.8,
        reviewCount: 7,
        specs: {
            'Contenu': 'ESP32, 5 capteurs, câbles, alimentation',
            'Capteurs inclus': 'DHT22, humidité sol, luminosité, pluie, pH',
            'Documentation': 'Guide de démarrage inclus',
            'Compatibilité': 'Arduino IDE'
        },
        fullDescription: 'Ce kit starter contient tout ce dont vous avez besoin pour démarrer votre projet de ferme intelligente. Il inclut une carte ESP32, plusieurs capteurs environnementaux, et toute la documentation nécessaire pour commencer.'
    }
];

// Afficher les produits sur la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    if (featuredProductsContainer) {
        // Afficher 4 produits aléatoires
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        selected.forEach(product => {
            featuredProductsContainer.appendChild(createProductCard(product));
        });
    }
    
    // Afficher tous les produits sur la page produits.html
    const productsGrid = document.getElementById('products-grid');
    
    if (productsGrid) {
        displayProducts(products);
        setupFilters();
    }
    
    // Gestion de la page de détail du produit
    if (document.querySelector('.product-detail-page')) {
        loadProductDetail();
    }
});

// Créer une carte produit
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    const stockStatus = product.stock > 0 ? 
        (product.stock < 5 ? 'low-stock' : 'in-stock') : 
        'out-of-stock';
    const stockText = product.stock > 0 ? 
        (product.stock < 5 ? 'Stock faible' : 'En stock') : 
        'Rupture de stock';
    
    card.innerHTML = `
        <div class="product-badge ${stockStatus}">${stockText}</div>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.shortDescription}</p>
            <div class="product-meta">
                <div class="product-price">
                    ${product.originalPrice ? 
                        `<span class="original-price">${product.originalPrice.toFixed(2)} €</span>` : 
                        ''}
                    <span>${product.price.toFixed(2)} €</span>
                </div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)} (${product.reviewCount})
                </div>
            </div>
            <button class="btn btn-add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'Rupture' : 'Ajouter'}
            </button>
        </div>
    `;
    
    return card;
}

// Générer le rating en étoiles
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Afficher les produits avec filtrage
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Aucun produit ne correspond à vos critères.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
    
    // Ajouter les écouteurs d'événements pour le panier
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            addToCart(productId);
        });
    });
}

// Configurer les filtres
function setupFilters() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const priceRange = document.getElementById('price-range');
    const searchInput = document.getElementById('product-search');
    const sortSelect = document.getElementById('sort-by');
    
    // Filtrage par catégorie
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterProducts(category);
            
            // Mettre à jour l'état actif
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Filtrage par prix
    if (priceRange) {
        const maxPriceDisplay = document.getElementById('max-price');
        priceRange.addEventListener('input', function() {
            maxPriceDisplay.textContent = `${this.value} €`;
            filterProducts();
        });
    }
    
    // Recherche
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts();
        });
    }
    
    // Tri
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filterProducts();
        });
    }
}

// Filtrer les produits
function filterProducts(category = null) {
    const activeCategory = category || document.querySelector('.category-list a.active')?.dataset.category || 'all';
    const priceRange = document.getElementById('price-range');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 500;
    const searchInput = document.getElementById('product-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const sortSelect = document.getElementById('sort-by');
    const sortOption = sortSelect ? sortSelect.value : 'default';
    
    let filteredProducts = [...products];
    
    // Filtrer par catégorie
    if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
    }
    
    // Filtrer par prix
    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    
    // Filtrer par recherche
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Trier
    switch (sortOption) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    displayProducts(filteredProducts);
}

// Charger les détails du produit
function loadProductDetail() {
    // Dans une vraie application, vous obtiendriez l'ID du produit à partir de l'URL
    // Pour cet exemple, nous prenons le premier produit
    const productId = new URLSearchParams(window.location.search).get('id') || products[0].id;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Mettre à jour les informations du produit
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-name-breadcrumb').textContent = product.name;
    document.getElementById('product-category-breadcrumb').textContent = getCategoryName(product.category);
    document.getElementById('product-description-text').textContent = product.description;
    document.getElementById('full-description').textContent = product.fullDescription;
    document.getElementById('current-price').textContent = `${product.price.toFixed(2)} €`;
    
    if (product.originalPrice) {
        document.getElementById('original-price').textContent = `${product.originalPrice.toFixed(2)} €`;
    }
    
    // Rating
    document.getElementById('product-stars').innerHTML = generateStarRating(product.rating);
    document.getElementById('review-count').textContent = `(${product.reviewCount} avis)`;
    
    // Stock
    const stockElement = document.getElementById('product-stock');
    stockElement.className = 'product-stock ' + (product.stock > 0 ? 'in-stock' : 'out-of-stock');
    stockElement.textContent = product.stock > 0 ? 
        (product.stock < 5 ? `Seulement ${product.stock} en stock!` : 'En stock') : 
        'Rupture de stock';
    
    // Images
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.name;
    
    const thumbnailsContainer = document.getElementById('thumbnail-images');
    thumbnailsContainer.innerHTML = '';
    
    product.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img}" alt="${product.name}">`;
        thumb.addEventListener('click', function() {
            mainImage.src = img;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        thumbnailsContainer.appendChild(thumb);
    });
    
    // Spécifications
    const specsTable = document.getElementById('product-specs-table');
    specsTable.innerHTML = '';
    
    for (const [key, value] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${key}</td>
            <td>${value}</td>
        `;
        specsTable.appendChild(row);
    }
    
    // Spécifications détaillées (même données pour cet exemple)
    const detailedSpecs = document.getElementById('detailed-specs');
    detailedSpecs.innerHTML = '';
    
    for (const [key, value] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${key}</td>
            <td>${value}</td>
        `;
        detailedSpecs.appendChild(row);
    }
    
    // Gestion de la quantité
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const qtyInput = document.getElementById('product-qty');
    
    decreaseBtn.addEventListener('click', function() {
        if (parseInt(qtyInput.value) > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    
    // Boutons d'achat
    const addToCartBtn = document.getElementById('add-to-cart');
    const buyNowBtn = document.getElementById('buy-now');
    
    if (product.stock === 0) {
        addToCartBtn.disabled = true;
        buyNowBtn.disabled = true;
        addToCartBtn.textContent = 'Rupture de stock';
    } else {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(qtyInput.value);
            addToCart(product.id, quantity);
            showToast('Produit ajouté au panier');
        });
        
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(qtyInput.value);
            addToCart(product.id, quantity);
            window.location.href = 'cart.html';
        });
    }
    
    // Charger les produits associés
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);
    const relatedContainer = document.getElementById('related-products');
    
    if (relatedContainer && relatedProducts.length > 0) {
        relatedProducts.slice(0, 4).forEach(p => {
            relatedContainer.appendChild(createProductCard(p));
        });
    } else if (relatedContainer) {
        relatedContainer.innerHTML = '<p>Aucun produit associé trouvé.</p>';
    }
}

function getCategoryName(category) {
    const categories = {
        'microcontroller': 'Microcontrôleurs',
        'sensor': 'Capteurs',
        'kit': 'Kits',
        'accessory': 'Accessoires'
    };
    return categories[category] || 'Catégorie';
}

// Ajouter au panier
// Fonction modifiée pour l'ajout au panier
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('smartfarm-cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Produit non trouvé :", productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('smartfarm-cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} ajouté au panier`);
    
    // Debug
    console.log("Panier actuel :", JSON.parse(localStorage.getItem('smartfarm-cart')));
}