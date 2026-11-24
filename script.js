
/* =========================================================
   SMART CONNECT — LÓGICA DA LOJA
   ---------------------------------------------------------
   Funcionalidades:
   01. Configurações e armazenamento
   02. Utilitários e mensagens
   03. Produtos e catálogo
   04. Pesquisa, filtros e ordenação
   05. Favoritos
   06. Detalhes dos produtos
   07. Modais
   08. Carrinho de compras
   09. Navegação entre telas
   10. Login, cadastro e sessão
   11. Painel do vendedor
   12. Perfil do cliente
   13. Finalização da compra
   14. Preferências de cookies
   15. Carrossel principal
   16. Tela de boas-vindas
   17. Inicialização

   Os dados são armazenados no localStorage.
   Para produção, utilize backend e banco de dados.
   ========================================================= */


/* =========================================================
   01. CONFIGURAÇÕES E ARMAZENAMENTO
   ========================================================= */

// Identificadores utilizados para salvar os dados no navegador.
const STORAGE = {
    products: 'smartconnect-products-v2',
    cart: 'smartconnect-cart-v2',
    users: 'smartconnect-users-v2',
    session: 'smartconnect-session-v2',
    cookies: 'smartconnect-cookie-choice-v2',
    orders: 'smartconnect-orders-v2'
};


// Produtos que aparecem na loja na primeira utilização.
const initialProducts = [
    {
        id: 'iphone-15',
        name: 'iPhone 15',
        category: 'smartphones',
        price: 4499.99,
        image: 'https://meuimportadors.com/wp-content/uploads/2023/10/iPhone-15-Azul-768x768-1.png',
        description: 'Smartphone Apple com excelente desempenho, câmera avançada e design moderno.'
    },
    {
        id: 'fone',
        name: 'Fone JBL Bluetooth',
        category: 'acessorios',
        price: 199.99,
        image: 'https://www.jbl.com.br/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwf461e98d/LS_JBL_Tune_530BT_Product_Image_Right_Black.png?sw=140&sh=140',
        description: 'Fone de ouvido Bluetooth com qualidade sonora JBL.'
    },
    {
        id: 'relogio',
        name: 'Smart Watch',
        category: 'acessorios',
        price: 299.99,
        image: 'https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-the-smartwatch-banner-png-image_11919210.png',
        description: 'Relógio inteligente para acompanhar atividades e notificações.'
    },
    {
        id: 'mouse',
        name: 'Mouse Gamer RGB',
        category: 'acessorios',
        price: 149.99,
        image: 'https://static.vecteezy.com/system/resources/previews/070/969/699/non_2x/rgb-gaming-mouse-on-transparent-background-free-png.png',
        description: 'Mouse gamer com iluminação RGB e precisão para jogos.'
    },
    {
        id: 'ps5',
        name: 'Console PS5',
        category: 'games',
        price: 3799.99,
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png',
        description: 'Console de videogame de última geração.'
    },
    {
        id: 'iphone-16',
        name: 'iPhone 16',
        category: 'smartphones',
        price: 5499.99,
        image: 'https://freepngimg.com/thumb/iphone_16/136631-iphone-16.png',
        description: 'Smartphone Apple com alto desempenho, câmera avançada e recursos modernos.'
    },
    {
        id: 'macbook-air',
        name: 'MacBook Air',
        category: 'computadores',
        price: 8999.99,
        image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mba-13inch-15inch.png',
        description: 'Notebook Apple leve, moderno e eficiente para trabalho e estudos.'
    },
    {
        id: 'teclado',
        name: 'Teclado Mecânico RGB',
        category: 'acessorios',
        price: 249.99,
        image: 'https://static.vecteezy.com/system/resources/previews/052/855/199/non_2x/white-rgb-mechanical-gaming-keyboard-with-cable-free-png.png',
        description: 'Teclado mecânico com iluminação RGB.'
    },
    {
        id: 'macbook-pro',
        name: 'MacBook Pro',
        category: 'computadores',
        price: 14999.99,
        image: 'https://png.pngtree.com/png-clipart/20250105/original/pngtree-sleek-apple-macbook-pro-with-silver-finish-png-image_19257678.png',
        description: 'Notebook profissional Apple com alto desempenho.'
    }
];


// Lê os dados do localStorage e trata possíveis erros.
function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        return value !== null
            ? JSON.parse(value)
            : fallback;

    } catch (error) {
        console.warn(`Não foi possível ler ${key}:`, error);
        return fallback;
    }
}


// Salva os dados no localStorage.
function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;

    } catch (error) {
        console.error(`Não foi possível salvar ${key}:`, error);
        showToast('Não foi possível salvar os dados.');
        return false;
    }
}


// Recupera os produtos ou utiliza os produtos iniciais.
let products = readStorage(STORAGE.products, null);

if (!Array.isArray(products)) {
    products = [...initialProducts];
    writeStorage(STORAGE.products, products);
}


// Recupera os demais dados e verifica se possuem o formato esperado.
let cart = readStorage(STORAGE.cart, []);
let users = readStorage(STORAGE.users, []);
let currentUser = readStorage(STORAGE.session, null);
let orders = readStorage(STORAGE.orders, []);

if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(users)) users = [];
if (!Array.isArray(orders)) orders = [];


// Atualiza a imagem do iPhone 16 caso ainda esteja salva a versão antiga.
const iphone16 = products.find(product => product.id === 'iphone-16');

if (iphone16 && iphone16.image !== 'https://freepngimg.com/thumb/iphone_16/136631-iphone-16.png') {
    iphone16.image = 'https://freepngimg.com/thumb/iphone_16/136631-iphone-16.png';
    writeStorage(STORAGE.products, products);
}


// Garante que a sessão recuperada corresponde a uma conta existente.
if (currentUser && !users.some(user => user.id === currentUser.id)) {
    currentUser = null;
    localStorage.removeItem(STORAGE.session);
}


// Variáveis utilizadas durante a execução.
let activeCategory = 'todos';
let selectedRole = 'cliente';
let selectedProduct = null;
let toastTimer = null;


// Atalho para selecionar elementos HTML.
const $ = selector => document.querySelector(selector);


// Imagem utilizada quando uma imagem de produto não carrega.
const fallbackImage = 'https://placehold.co/500x400/f2f4f1/526052?text=Imagem+indisponivel';


// Formata números como valores em reais.
const money = value => Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});


// Protege textos antes de inseri-los em HTML.
function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}


// Aceita somente endereços HTTP e HTTPS para imagens.
function safeImageUrl(value) {
    try {
        const url = new URL(value);

        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return url.href;
        }

    } catch (error) {
        // Retorna a imagem padrão quando o endereço é inválido.
    }

    return fallbackImage;
}


/* =========================================================
   02. UTILITÁRIOS E MENSAGENS
   ========================================================= */

// Exibe mensagens temporárias na tela.
function showToast(message) {
    const toast = $('#toast');

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}


// Retorna o nome legível de uma categoria.
function categoryName(category) {
    const categories = {
        smartphones: 'Smartphone',
        computadores: 'Computador',
        games: 'Games',
        acessorios: 'Acessório'
    };

    return categories[category] || 'Produto';
}


// Procura um produto pelo identificador.
function findProduct(productId) {
    return products.find(product => product.id === productId);
}


// Recupera os favoritos do usuário conectado.
function getFavorites() {
    if (!currentUser) return [];

    const user = users.find(item => item.id === currentUser.id);

    return user && Array.isArray(user.favorites)
        ? user.favorites
        : [];
}


// Salva os favoritos na conta do usuário.
function saveFavorites(favorites) {
    if (!currentUser) return;

    const user = users.find(item => item.id === currentUser.id);

    if (!user) return;

    user.favorites = favorites;

    writeStorage(STORAGE.users, users);
}


// Verifica se determinado produto está favoritado.
function isFavorite(productId) {
    return getFavorites().includes(productId);
}


/* =========================================================
   03. EXIBIÇÃO DOS PRODUTOS
   ========================================================= */

// Cria os cartões de produtos na página principal.
function renderProducts() {
    const productGrid = $('#productGrid');

    if (!productGrid) return;

    const searchInput = $('#searchInput');
    const sortSelect = $('#sortSelect');

    const query = searchInput
        ? searchInput.value.trim().toLocaleLowerCase('pt-BR')
        : '';

    // Aplica pesquisa e filtro de categoria.
    let visibleProducts = products.filter(product => {
        const searchableText = `
            ${product.name}
            ${product.category}
            ${product.description || ''}
        `.toLocaleLowerCase('pt-BR');

        const matchesSearch = searchableText.includes(query);

        const matchesCategory =
            activeCategory === 'todos' ||
            product.category === activeCategory;

        return matchesSearch && matchesCategory;
    });


    // Ordena os produtos conforme a opção selecionada.
    const order = sortSelect?.value || '';

    if (order === 'low') {
        visibleProducts.sort((a, b) => a.price - b.price);
    } else if (order === 'high') {
        visibleProducts.sort((a, b) => b.price - a.price);
    } else if (order === 'name') {
        visibleProducts.sort((a, b) => {
            return a.name.localeCompare(b.name, 'pt-BR');
        });
    }


    // Monta os cartões utilizando os dados dos produtos.
    productGrid.innerHTML = visibleProducts.map(product => {
        const favorite = isFavorite(product.id);

        return `
            <article
                class="product-card"
                data-product-id="${safeText(product.id)}"
                tabindex="0"
                role="button"
                aria-label="Ver detalhes de ${safeText(product.name)}"
            >

                <button
                    class="favorite ${favorite ? 'selected' : ''}"
                    type="button"
                    data-favorite="${safeText(product.id)}"
                    aria-label="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                >
                    ${favorite ? '♥' : '♡'}
                </button>

                <div class="product-image">
                    <img
                        src="${safeText(safeImageUrl(product.image))}"
                        alt="${safeText(product.name)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${fallbackImage}'"
                    >
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${safeText(categoryName(product.category))}
                    </span>

                    <h3>${safeText(product.name)}</h3>

                    <p class="price">
                        ${money(product.price)}
                    </p>

                    <button
                        class="buy-btn"
                        type="button"
                        data-add="${safeText(product.id)}"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            </article>
        `;
    }).join('');


    // Exibe ou oculta a mensagem de catálogo vazio.
    const emptyState = $('#emptyState');

    if (emptyState) {
        emptyState.hidden = visibleProducts.length > 0;
    }
}


/* =========================================================
   04. PESQUISA, FILTROS E ORDENAÇÃO
   ========================================================= */

// Atualiza os produtos enquanto o usuário digita.
$('#searchInput')?.addEventListener('input', renderProducts);


// Atualiza os produtos quando a ordenação muda.
$('#sortSelect')?.addEventListener('change', renderProducts);


// Pesquisa: leva o usuário à área dos produtos.
$('#searchForm')?.addEventListener('submit', event => {
    event.preventDefault();

    showPage('home');

    $('#produtos')?.scrollIntoView({
        behavior: 'smooth'
    });

    renderProducts();
});


// Atualiza visualmente o botão de categoria selecionado.
function updateCategoryButtons() {
    document.querySelectorAll('[data-category]').forEach(button => {
        button.classList.toggle(
            'active',
            button.dataset.category === activeCategory
        );
    });
}


// Botões de filtro das categorias.
document.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => {
        activeCategory = button.dataset.category;

        updateCategoryButtons();
        renderProducts();
    });
});


// Links que levam a uma categoria específica.
document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
        activeCategory = link.dataset.filterLink;

        updateCategoryButtons();

        // Garante que a seção de produtos esteja visível.
        showPage('home');

        renderProducts();

        $('#produtos')?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


/* =========================================================
   05. FAVORITOS
   ========================================================= */

// Adiciona ou remove um produto dos favoritos.
function toggleFavorite(productId) {
    if (!currentUser) {
        showToast('Entre na sua conta para salvar favoritos.');
        openModal('authModal');
        return;
    }

    if (currentUser.role !== 'cliente') {
        showToast('Os favoritos estão disponíveis para clientes.');
        return;
    }

    let favorites = getFavorites();

    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        showToast('Produto removido dos favoritos.');
    } else {
        favorites.push(productId);
        showToast('Produto adicionado aos favoritos.');
    }

    saveFavorites(favorites);

    renderProducts();
    renderProfile();

    // Mantém o botão da janela de detalhes atualizado.
    if (selectedProduct?.id === productId) {
        updateProductModalFavorite();
    }
}


// Detecta os cliques nos botões de favoritos.
document.addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-favorite]');

    if (!favoriteButton) return;

    event.preventDefault();
    event.stopPropagation();

    toggleFavorite(favoriteButton.dataset.favorite);
});


/* =========================================================
   06. DETALHES DOS PRODUTOS
   ========================================================= */

// Abre a janela com as informações de um produto.
function openProductModal(productId) {
    const product = findProduct(productId);
    const modal = $('#productModal');

    if (!product || !modal) return;

    selectedProduct = product;

    const image = $('#productModalImage');

    if (image) {
        image.src = safeImageUrl(product.image);
        image.alt = product.name;

        image.onerror = () => {
            image.onerror = null;
            image.src = fallbackImage;
        };
    }

    $('#productModalCategory').textContent = categoryName(product.category);
    $('#productModalName').textContent = product.name;

    $('#productModalDescription').textContent =
        product.description || 'Sem descrição disponível.';

    $('#productModalPrice').textContent = money(product.price);

    updateProductModalFavorite();

    modal.hidden = false;

    updateBodyModalState();
}


// Atualiza o botão de favorito da janela de detalhes.
function updateProductModalFavorite() {
    const button = $('#productModalFavorite');

    if (!button || !selectedProduct) return;

    const favorite = isFavorite(selectedProduct.id);

    button.textContent = favorite ? 'Favoritado' : 'Favoritar';
    button.classList.toggle('selected', favorite);
}


// Fecha a janela de detalhes.
function closeProductModal() {
    const modal = $('#productModal');

    if (modal) {
        modal.hidden = true;
    }

    selectedProduct = null;

    updateBodyModalState();
}


// Clique em um cartão abre os detalhes do produto.
$('#productGrid')?.addEventListener('click', event => {
    // Não abre os detalhes quando o clique é em um botão interno.
    if (
        event.target.closest('[data-favorite]') ||
        event.target.closest('[data-add]')
    ) {
        return;
    }

    const card = event.target.closest('[data-product-id]');

    if (card) {
        openProductModal(card.dataset.productId);
    }
});


// Permite abrir os detalhes com Enter ou Espaço.
$('#productGrid')?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    if (event.target.closest('button')) return;

    const card = event.target.closest('[data-product-id]');

    if (!card) return;

    event.preventDefault();

    openProductModal(card.dataset.productId);
});


// Favoritar pela janela de detalhes.
$('#productModalFavorite')?.addEventListener('click', () => {
    if (selectedProduct) {
        toggleFavorite(selectedProduct.id);
    }
});


// Adicionar ao carrinho pela janela de detalhes.
$('#productModalAdd')?.addEventListener('click', () => {
    if (!selectedProduct) return;

    addToCart(selectedProduct.id);
    closeProductModal();
});


/* =========================================================
   07. MODAIS
   ========================================================= */

// Abre um modal pelo identificador.
function openModal(id) {
    const modal = $(`#${id}`);

    if (!modal) return;

    modal.hidden = false;

    updateBodyModalState();
}


// Verifica se algum modal está aberto e atualiza a rolagem.
function updateBodyModalState() {
    const authOpen = $('#authModal') && !$('#authModal').hidden;
    const productOpen = $('#productModal') && !$('#productModal').hidden;

    document.body.classList.toggle(
        'modal-open',
        Boolean(authOpen || productOpen)
    );
}


// Fecha um modal.
function closeModal(id) {
    const modal = $(`#${id}`);

    if (modal) {
        modal.hidden = true;
    }

    updateBodyModalState();
}


// Botões que possuem o atributo data-close.
document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.dataset.close;

        if (modalId === 'productModal') {
            closeProductModal();
        } else {
            closeModal(modalId);
        }
    });
});


// Fecha o modal ao clicar diretamente no fundo escuro.
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', event => {
        if (event.target !== backdrop) return;

        if (backdrop.id === 'productModal') {
            closeProductModal();
        } else {
            closeModal(backdrop.id);
        }
    });
});


// Fecha as janelas abertas ao pressionar Escape.
document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    closeCart();
    closeModal('authModal');
    closeProductModal();
});


/* =========================================================
   08. CARRINHO DE COMPRAS
   ========================================================= */

// Salva o carrinho atual.
function saveCart() {
    writeStorage(STORAGE.cart, cart);
}


// Adiciona um produto ao carrinho.
function addToCart(productId) {
    const product = findProduct(productId);

    if (!product) {
        showToast('Produto não encontrado.');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    renderCart();

    showToast(`${product.name} adicionado ao carrinho.`);

    openCart();
}


// Calcula o valor total dos produtos no carrinho.
function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = findProduct(item.id);

        return total + (
            product
                ? product.price * item.quantity
                : 0
        );
    }, 0);
}


// Calcula a quantidade total de itens.
function getCartCount() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}


// Atualiza a exibição do carrinho.
function renderCart() {
    // Remove produtos que não existem mais e quantidades inválidas.
    const validCart = cart.filter(item => {
        return findProduct(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0;
    });

    if (validCart.length !== cart.length) {
        cart = validCart;
        saveCart();
    }

    const container = $('#cartItems');
    const countElement = $('#cartCount');
    const totalElement = $('#cartTotal');
    const checkoutButton = $('#checkoutBtn');

    // Atualiza a quantidade exibida no ícone do cabeçalho.
    if (countElement) {
        countElement.textContent = getCartCount();
    }

    // Atualiza o valor total.
    if (totalElement) {
        totalElement.textContent = money(getCartTotal());
    }

    // Impede a finalização de uma compra sem produtos.
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }

    if (!container) return;

    // Mensagem para carrinho vazio.
    if (!cart.length) {
        container.innerHTML = `
            <p class="cart-empty">
                Seu carrinho está vazio.
            </p>
        `;

        return;
    }

    // Monta os produtos do carrinho.
    container.innerHTML = cart.map(item => {
        const product = findProduct(item.id);

        return `
            <div class="cart-row">

                <img
                    src="${safeText(safeImageUrl(product.image))}"
                    alt="${safeText(product.name)}"
                    onerror="this.onerror=null;this.src='${fallbackImage}'"
                >

                <div>

                    <strong>${safeText(product.name)}</strong>

                    <small>${money(product.price)} cada</small>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            data-quantity="-1"
                            data-id="${safeText(item.id)}"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-quantity="1"
                            data-id="${safeText(item.id)}"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-item"
                    type="button"
                    data-remove="${safeText(item.id)}"
                >
                    Remover
                </button>

            </div>
        `;
    }).join('');
}


// Controla os botões internos do carrinho e de adicionar produtos.
document.addEventListener('click', event => {
    // Adicionar produto.
    const addButton = event.target.closest('[data-add]');

    if (addButton) {
        addToCart(addButton.dataset.add);
        return;
    }

    // Alterar quantidade.
    const quantityButton = event.target.closest('[data-quantity]');

    if (quantityButton) {
        const item = cart.find(row => {
            return row.id === quantityButton.dataset.id;
        });

        if (item) {
            item.quantity += Number(quantityButton.dataset.quantity);
        }

        // Remove o item caso sua quantidade chegue a zero.
        cart = cart.filter(row => row.quantity > 0);

        saveCart();
        renderCart();

        return;
    }

    // Remover produto.
    const removeButton = event.target.closest('[data-remove]');

    if (removeButton) {
        cart = cart.filter(item => {
            return item.id !== removeButton.dataset.remove;
        });

        saveCart();
        renderCart();

        showToast('Produto removido do carrinho.');
    }
});


// Abre o painel lateral do carrinho.
function openCart() {
    document.body.classList.add('cart-open');

    $('#cartDrawer')?.setAttribute('aria-hidden', 'false');
}


// Fecha o painel lateral do carrinho.
function closeCart() {
    document.body.classList.remove('cart-open');

    $('#cartDrawer')?.setAttribute('aria-hidden', 'true');
}


// Eventos dos controles do carrinho.
$('#cartOpen')?.addEventListener('click', openCart);
$('#cartClose')?.addEventListener('click', closeCart);
$('#cartOverlay')?.addEventListener('click', closeCart);


/* =========================================================
   09. NAVEGAÇÃO ENTRE TELAS
   ========================================================= */

// Exibe somente a tela solicitada.
// O cabeçalho permanece disponível em todas as telas.
function showPage(page) {
    const home = $('#inicio');
    const footer = $('.footer');
    const checkout = $('#checkoutPage');
    const profile = $('#profilePage');
    const seller = $('#sellerPanel');

    if (home) {
        home.hidden = page !== 'home';
    }

    if (footer) {
        footer.hidden = page !== 'home';
    }

    if (checkout) {
        checkout.hidden = page !== 'checkout';
    }

    if (profile) {
        profile.hidden = page !== 'profile';
    }

    if (seller) {
        seller.hidden = !(
            page === 'seller' &&
            currentUser &&
            currentUser.role === 'vendedor'
        );
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// Retorna à loja a partir do checkout.
$('#checkoutBack')?.addEventListener('click', () => {
    showPage('home');
});


// Retorna à loja a partir do perfil.
$('#profileBack')?.addEventListener('click', () => {
    showPage('home');
});


// Corrige a navegação do cabeçalho quando outra tela está aberta.
// Links externos, como sobre.html, continuam funcionando normalmente.
document.querySelectorAll('.main-nav a[href^="#"], .brand[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        const target = $(targetId);

        if (!target) return;

        event.preventDefault();

        showPage('home');

        // Aguarda a tela inicial ficar visível antes de rolar.
        requestAnimationFrame(() => {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});


/* =========================================================
   10. LOGIN, CADASTRO E SESSÃO
   ========================================================= */

// Botão de acesso à conta.
$('#accountBtn')?.addEventListener('click', () => {
    if (!currentUser) {
        openModal('authModal');
        return;
    }

    if (currentUser.role === 'vendedor') {
        showPage('seller');
        renderSellerProducts();
        return;
    }

    renderProfile();
    showPage('profile');
});


// Seleção do tipo de conta.
document.querySelectorAll('[data-role]').forEach(button => {
    button.addEventListener('click', () => {
        selectedRole = button.dataset.role;

        document.querySelectorAll('[data-role]').forEach(item => {
            item.classList.toggle('active', item === button);
        });
    });
});


// Processa o login ou o cadastro.
$('#authForm')?.addEventListener('submit', event => {
    event.preventDefault();

    const name = $('#authName')?.value.trim() || '';
    const email = $('#authEmail')?.value.trim().toLowerCase() || '';
    const password = $('#authPassword')?.value || '';

    if (!email) {
        showToast('Informe seu e-mail.');
        return;
    }

    if (password.length < 4) {
        showToast('A senha precisa ter pelo menos 4 caracteres.');
        return;
    }

    // Verifica se já existe uma conta com esse e-mail.
    const existingEmail = users.find(user => user.email === email);

    if (existingEmail && existingEmail.role !== selectedRole) {
        showToast('Este e-mail já está cadastrado em outro tipo de conta.');
        return;
    }

    let user = existingEmail;

    // Login de uma conta existente.
    if (user) {
        if (user.password !== password) {
            showToast('Senha incorreta.');
            return;
        }

    } else {
        // Cadastro de uma nova conta.
        if (!name) {
            showToast('Informe seu nome para criar uma conta.');
            return;
        }

        user = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            role: selectedRole,
            favorites: []
        };

        users.push(user);

        writeStorage(STORAGE.users, users);
    }

    // Cria a sessão sem incluir a senha.
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    writeStorage(STORAGE.session, currentUser);

    updateAccountUI();

    closeModal('authModal');

    $('#authForm').reset();

    showToast(`Acesso realizado como ${selectedRole}.`);

    // Direciona cada tipo de conta para sua área.
    if (currentUser.role === 'vendedor') {
        renderSellerProducts();
        showPage('seller');
    } else {
        renderProfile();
        showPage('profile');
    }
});


// Atualiza o nome e o estado do botão de conta.
function updateAccountUI() {
    const accountLabel = $('#accountLabel');

    if (accountLabel) {
        accountLabel.textContent = currentUser
            ? currentUser.name.split(' ')[0]
            : 'Entrar';
    }

    // Atualiza a disponibilidade do painel de vendedor.
    const sellerPanel = $('#sellerPanel');

    if (sellerPanel) {
        sellerPanel.hidden = !(
            currentUser &&
            currentUser.role === 'vendedor'
        );
    }

    if (currentUser?.role === 'vendedor') {
        renderSellerProducts();
    }
}


// Encerra a sessão atual.
function logout() {
    currentUser = null;

    localStorage.removeItem(STORAGE.session);

    updateAccountUI();

    showPage('home');

    renderProducts();

    showToast('Você saiu da sua conta.');
}


// Eventos de saída da conta.
$('#sellerLogout')?.addEventListener('click', logout);
$('#profileLogout')?.addEventListener('click', logout);


/* =========================================================
   11. PAINEL DO VENDEDOR
   ========================================================= */

// Limpa o formulário e retorna ao modo de cadastro.
function resetProductForm() {
    $('#productForm')?.reset();

    if ($('#editProductId')) {
        $('#editProductId').value = '';
    }

    if ($('#saveProductBtn')) {
        $('#saveProductBtn').textContent = 'Cadastrar produto';
    }

    if ($('#cancelEditBtn')) {
        $('#cancelEditBtn').hidden = true;
    }
}


// Cancela uma edição em andamento.
$('#cancelEditBtn')?.addEventListener('click', resetProductForm);


// Cadastra um novo produto ou atualiza um produto existente.
$('#productForm')?.addEventListener('submit', event => {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'vendedor') {
        showToast('Entre com uma conta de vendedor.');
        return;
    }

    const idBeingEdited = $('#editProductId')?.value || '';

    const productData = {
        id: idBeingEdited || `seller-${Date.now()}`,
        name: $('#newProductName')?.value.trim() || '',
        category: $('#newProductCategory')?.value || '',
        price: Number($('#newProductPrice')?.value),
        image: $('#newProductImage')?.value.trim() || '',
        description: $('#newProductDescription')?.value.trim() || '',
        sellerId: currentUser.id
    };

    // Verifica os dados antes de salvar.
    if (
        !productData.name ||
        !productData.category ||
        !Number.isFinite(productData.price) ||
        productData.price <= 0 ||
        !productData.image
    ) {
        showToast('Confira os dados do produto.');
        return;
    }

    // Verifica se o endereço da imagem é válido.
    if (safeImageUrl(productData.image) === fallbackImage) {
        showToast('Informe um endereço de imagem válido.');
        return;
    }

    if (idBeingEdited) {
        // Localiza o produto que será atualizado.
        const index = products.findIndex(product => {
            return product.id === idBeingEdited &&
                product.sellerId === currentUser.id;
        });

        if (index === -1) {
            showToast('Não foi possível encontrar o produto para edição.');
            return;
        }

        products[index] = {
            ...products[index],
            ...productData
        };

        showToast('Produto atualizado.');

    } else {
        // Insere o novo produto no início da lista.
        products.unshift(productData);

        showToast('Produto cadastrado com sucesso.');
    }

    writeStorage(STORAGE.products, products);

    resetProductForm();

    renderProducts();
    renderSellerProducts();
    renderCart();
});


// Exibe os produtos cadastrados pelo vendedor conectado.
function renderSellerProducts() {
    const container = $('#sellerProducts');

    if (!container || !currentUser) return;

    const ownedProducts = products.filter(product => {
        return product.sellerId === currentUser.id;
    });

    if (!ownedProducts.length) {
        container.innerHTML = `
            <p class="empty-state">
                Você ainda não cadastrou produtos.
            </p>
        `;

        return;
    }

    container.innerHTML = ownedProducts.map(product => `
        <article class="seller-product">

            <img
                src="${safeText(safeImageUrl(product.image))}"
                alt="${safeText(product.name)}"
                onerror="this.onerror=null;this.src='${fallbackImage}'"
            >

            <div>

                <strong>${safeText(product.name)}</strong>

                <small>
                    ${money(product.price)}
                    •
                    ${safeText(categoryName(product.category))}
                </small>

            </div>

            <div class="seller-product-actions">

                <button
                    type="button"
                    data-edit-product="${safeText(product.id)}"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="delete-product"
                    data-delete-product="${safeText(product.id)}"
                >
                    Excluir
                </button>

            </div>

        </article>
    `).join('');
}


// Controla as ações de edição e exclusão.
document.addEventListener('click', event => {
    // Edição de produtos.
    const editButton = event.target.closest('[data-edit-product]');

    if (editButton) {
        if (!currentUser || currentUser.role !== 'vendedor') return;

        const product = findProduct(editButton.dataset.editProduct);

        // Impede que um vendedor altere produtos de outra conta.
        if (!product || product.sellerId !== currentUser.id) return;

        $('#editProductId').value = product.id;
        $('#newProductName').value = product.name;
        $('#newProductCategory').value = product.category;
        $('#newProductPrice').value = product.price;
        $('#newProductImage').value = product.image;
        $('#newProductDescription').value = product.description || '';

        $('#saveProductBtn').textContent = 'Salvar alterações';
        $('#cancelEditBtn').hidden = false;

        $('#productForm')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        return;
    }

    // Exclusão de produtos.
    const deleteButton = event.target.closest('[data-delete-product]');

    if (deleteButton) {
        if (!currentUser || currentUser.role !== 'vendedor') return;

        const product = findProduct(deleteButton.dataset.deleteProduct);

        if (!product || product.sellerId !== currentUser.id) return;

        if (!confirm(`Excluir o produto "${product.name}"?`)) return;

        // Remove o produto da loja.
        products = products.filter(item => item.id !== product.id);

        // Remove o produto do carrinho.
        cart = cart.filter(item => item.id !== product.id);

        // Remove o produto dos favoritos de todos os usuários.
        users.forEach(user => {
            if (!Array.isArray(user.favorites)) {
                user.favorites = [];
            }

            user.favorites = user.favorites.filter(id => {
                return id !== product.id;
            });
        });

        writeStorage(STORAGE.products, products);
        writeStorage(STORAGE.users, users);

        saveCart();

        renderProducts();
        renderSellerProducts();
        renderCart();
        renderProfile();

        showToast('Produto excluído.');
    }
});


/* =========================================================
   12. PERFIL DO CLIENTE
   ========================================================= */

// Atualiza os dados e o histórico do cliente.
function renderProfile() {
    if (!currentUser || currentUser.role !== 'cliente') return;

    const profileName = $('#profileName');
    const profileEmail = $('#profileEmail');
    const profileAvatar = $('#profileAvatar');

    if (profileName) {
        profileName.textContent = currentUser.name;
    }

    if (profileEmail) {
        profileEmail.textContent = currentUser.email;
    }

    // Exibe a primeira letra do nome no avatar, quando aplicável.
    if (profileAvatar) {
        profileAvatar.textContent = currentUser.name
            .trim()
            .charAt(0)
            .toUpperCase();
    }

    // Recupera os pedidos do cliente.
    const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    // Atualiza os contadores do perfil.
    if ($('#profileOrderCount')) {
        $('#profileOrderCount').textContent = userOrders.length;
    }

    const favorites = getFavorites();

    if ($('#profileFavoriteCount')) {
        $('#profileFavoriteCount').textContent = favorites.length;
    }

    // Renderiza o histórico de pedidos.
    const ordersContainer = $('#profileOrders');

    if (ordersContainer) {
        if (!userOrders.length) {
            ordersContainer.innerHTML = `
                <p class="empty-state">
                    Você ainda não realizou nenhuma compra.
                </p>
            `;
        } else {
            ordersContainer.innerHTML = userOrders.map(order => {
                // Utiliza os dados registrados no pedido.
                // Assim, o histórico continua correto mesmo que um produto seja excluído.
                const orderProducts = (order.items || []).map(item => {
                    const name = item.name || findProduct(item.id)?.name || 'Produto indisponível';

                    return `${safeText(name)} (${item.quantity}x)`;
                }).join(', ');

                return `
                    <article class="profile-order">

                        <div>

                            <strong>Pedido ${safeText(order.id)}</strong>

                            <small>
                                ${new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </small>

                            <p>${orderProducts}</p>

                        </div>

                        <div>
                            <strong>${money(order.total)}</strong>
                            <small>Compra registrada</small>
                        </div>

                    </article>
                `;
            }).join('');
        }
    }

    // Recupera os produtos que continuam disponíveis e favoritados.
    const favoriteProducts = products.filter(product => {
        return favorites.includes(product.id);
    });

    const favoritesContainer = $('#profileFavorites');

    if (favoritesContainer) {
        if (!favoriteProducts.length) {
            favoritesContainer.innerHTML = `
                <p class="empty-state">
                    Você ainda não favoritou nenhum produto.
                </p>
            `;
        } else {
            favoritesContainer.innerHTML = favoriteProducts.map(product => `
                <article
                    class="profile-favorite"
                    data-profile-product="${safeText(product.id)}"
                >

                    <img
                        src="${safeText(safeImageUrl(product.image))}"
                        alt="${safeText(product.name)}"
                        onerror="this.onerror=null;this.src='${fallbackImage}'"
                    >

                    <div>

                        <strong>${safeText(product.name)}</strong>

                        <p>${money(product.price)}</p>

                        <button
                            type="button"
                            data-remove-favorite="${safeText(product.id)}"
                        >
                            Remover dos favoritos
                        </button>

                    </div>

                </article>
            `).join('');
        }
    }
}


// Controla os cliques nos produtos favoritos do perfil.
$('#profileFavorites')?.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-favorite]');

    if (removeButton) {
        toggleFavorite(removeButton.dataset.removeFavorite);
        return;
    }

    const favoriteCard = event.target.closest('[data-profile-product]');

    if (favoriteCard) {
        const productId = favoriteCard.dataset.profileProduct;

        showPage('home');

        openProductModal(productId);
    }
});


/* =========================================================
   13. FINALIZAÇÃO DA COMPRA
   ========================================================= */

// Monta o resumo dos produtos na tela de checkout.
function renderCheckoutSummary() {
    const summary = $('#checkoutSummary');

    if (!summary) return;

    if (!cart.length) {
        summary.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    const count = getCartCount();

    const rows = cart.map(item => {
        const product = findProduct(item.id);

        if (!product) return '';

        return `
            <div class="checkout-product">

                <span>
                    ${safeText(product.name)}
                    <small> × ${item.quantity}</small>
                </span>

                <strong>
                    ${money(product.price * item.quantity)}
                </strong>

            </div>
        `;
    }).join('');

    summary.innerHTML = `
        <div class="checkout-summary-header">
            <strong>Resumo do pedido</strong>
            <span>${count} item(ns)</span>
        </div>

        ${rows}

        <div class="checkout-total">
            <strong>Total</strong>
            <strong>${money(getCartTotal())}</strong>
        </div>
    `;
}


// Abre a tela de finalização da compra.
function openCheckoutPage() {
    if (!cart.length) {
        showToast('Adicione produtos antes de finalizar.');
        return;
    }

    closeCart();

    renderCheckoutSummary();

    // Preenche os dados caso exista um cliente conectado.
    if (currentUser?.role === 'cliente') {
        if ($('#checkoutName')) {
            $('#checkoutName').value = currentUser.name;
        }

        if ($('#checkoutEmail')) {
            $('#checkoutEmail').value = currentUser.email;
        }
    }

    showPage('checkout');
}


// Botão de finalização do carrinho.
$('#checkoutBtn')?.addEventListener('click', openCheckoutPage);


// Aplica a máscara de CPF.
$('#checkoutCpf')?.addEventListener('input', event => {
    const digits = event.target.value
        .replace(/\D/g, '')
        .slice(0, 11);

    event.target.value = digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});


// Aplica a máscara de CEP.
$('#checkoutCep')?.addEventListener('input', event => {
    const digits = event.target.value
        .replace(/\D/g, '')
        .slice(0, 8);

    event.target.value = digits.replace(/(\d{5})(\d)/, '$1-$2');
});


// Registra o pedido após o envio do formulário.
$('#checkoutForm')?.addEventListener('submit', event => {
    event.preventDefault();

    if (!cart.length) {
        showToast('Seu carrinho está vazio.');
        return;
    }

    // Calcula o total antes de limpar o carrinho.
    const total = getCartTotal();

    // Salva uma cópia dos dados dos produtos no pedido.
    const orderItems = cart.map(item => {
        const product = findProduct(item.id);

        return {
            id: item.id,
            name: product ? product.name : 'Produto',
            price: product ? product.price : 0,
            quantity: item.quantity
        };
    });

    // Cria o registro completo da compra.
    const order = {
        id: `SC-${Date.now()}`,

        // Pedidos feitos sem login ficam sem usuário associado.
        userId: currentUser?.role === 'cliente'
            ? currentUser.id
            : null,

        customer: $('#checkoutName')?.value.trim() || '',
        email: $('#checkoutEmail')?.value.trim() || '',
        cpf: $('#checkoutCpf')?.value.trim() || '',
        cep: $('#checkoutCep')?.value.trim() || '',
        address: $('#checkoutAddress')?.value.trim() || '',
        payment: $('#checkoutPayment')?.value || '',

        items: orderItems,
        total,
        createdAt: new Date().toISOString()
    };

    // Salva o pedido no histórico.
    orders.push(order);
    writeStorage(STORAGE.orders, orders);

    // Limpa o carrinho depois do registro.
    cart = [];

    saveCart();
    renderCart();

    // Limpa os campos do formulário.
    $('#checkoutForm').reset();

    // Atualiza a tela conforme o tipo de usuário.
    if (currentUser?.role === 'cliente') {
        renderProfile();
        showPage('profile');
    } else {
        showPage('home');
    }

    showToast(`Pedido ${order.id} registrado com sucesso!`);
});


/* =========================================================
   14. PREFERÊNCIAS DE COOKIES
   ========================================================= */

// Verifica se o usuário já escolheu uma preferência.
function setupCookies() {
    const choice = readStorage(STORAGE.cookies, null);

    if (!choice && $('#cookieBanner')) {
        $('#cookieBanner').hidden = false;
    }
}


// Salva a escolha do usuário.
function chooseCookies(choice) {
    writeStorage(STORAGE.cookies, {
        choice,
        date: new Date().toISOString()
    });

    if ($('#cookieBanner')) {
        $('#cookieBanner').hidden = true;
    }

    showToast(
        choice === 'accepted'
            ? 'Preferência de cookies aceita.'
            : 'Cookies não essenciais recusados.'
    );
}


// Botões de escolha das preferências.
$('#acceptCookies')?.addEventListener('click', () => {
    chooseCookies('accepted');
});

$('#rejectCookies')?.addEventListener('click', () => {
    chooseCookies('rejected');
});


/* =========================================================
   15. CARROSSEL PRINCIPAL
   ========================================================= */

// Elemento que recebe as imagens do banner.
const heroSlide = $('#heroSlide');

if (heroSlide) {
    const heroImages = [
        {
            src: 'https://static.vecteezy.com/system/resources/previews/051/338/557/non_2x/various-colorful-smartphones-in-a-row-isolated-on-a-transparent-background-free-png.png',
            alt: 'Smartphones coloridos'
        },
        {
            src: 'https://www.pngall.com/wp-content/uploads/2/Console-PNG-Picture.png',
            alt: 'Console de videogame'
        },
        {
            src: 'https://www.pngall.com/wp-content/uploads/9/Gadget-PNG-Pic.png',
            alt: 'Dispositivos tecnológicos'
        }
    ];

    let currentImage = 0;

    // Pré-carrega as imagens para melhorar a transição.
    heroImages.forEach(image => {
        const preload = new Image();
        preload.src = image.src;
    });

    // Troca a imagem automaticamente.
    setInterval(() => {
        heroSlide.classList.add('is-changing');

        setTimeout(() => {
            currentImage = (currentImage + 1) % heroImages.length;

            const nextImage = heroImages[currentImage];

            // Define o evento antes de alterar o endereço da imagem.
            heroSlide.onload = () => {
                heroSlide.classList.remove('is-changing');
            };

            heroSlide.onerror = () => {
                heroSlide.classList.remove('is-changing');
            };

            heroSlide.src = nextImage.src;
            heroSlide.alt = nextImage.alt;

            // Trata imagens que já estão carregadas em cache.
            if (heroSlide.complete && heroSlide.naturalWidth > 0) {
                heroSlide.classList.remove('is-changing');
            }

        }, 450);

    }, 4500);
}


/* =========================================================
   16. TELA DE BOAS-VINDAS
   ========================================================= */

// Elementos da apresentação inicial.
const welcomeScreen = $('#welcomeScreen');
const btnComecar = $('#btnComecar');


// Ao clicar, a apresentação desaparece e a loja é exibida.
if (btnComecar && welcomeScreen) {
    btnComecar.addEventListener('click', () => {
        // Evita vários cliques durante a transição.
        btnComecar.disabled = true;

        btnComecar.innerHTML = `
            Abrindo loja...
            <span class="welcome-arrow">→</span>
        `;

        // Aplica a animação de saída.
        welcomeScreen.style.transition = 'opacity .5s ease';
        welcomeScreen.style.opacity = '0';

        setTimeout(() => {
            welcomeScreen.hidden = true;

            // Exibe a página inicial.
            showPage('home');

            btnComecar.disabled = false;
        }, 500);
    });
}


/* =========================================================
   17. INICIALIZAÇÃO
   ========================================================= */

// Executa as funções necessárias ao carregar a página.
function initializeStore() {
    // Desenha os produtos no catálogo.
    renderProducts();

    // Recupera e atualiza o carrinho.
    renderCart();

    // Atualiza o cabeçalho de acordo com a sessão.
    updateAccountUI();

    // Exibe o banner de cookies caso ainda não exista uma escolha.
    setupCookies();

    // Atualiza o perfil quando há um cliente conectado.
    if (currentUser?.role === 'cliente') {
        renderProfile();
    }

    // Atualiza a área do vendedor quando há um vendedor conectado.
    if (currentUser?.role === 'vendedor') {
        renderSellerProducts();
    }

    // Atualiza o estado visual das categorias.
    updateCategoryButtons();
}


// Inicia a loja.
initializeStore();
