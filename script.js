$(document).ready(function() {

    const getProducts = async () => {
        const storedProducts = localStorage.getItem('carouselProducts');
        if (storedProducts) {
            return JSON.parse(storedProducts);
        }
        
        try {
            const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
            const products = await response.json();
            localStorage.setItem('carouselProducts', JSON.stringify(products));
            return products;
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            return [];
        }
    };

    const createCarousel = async () => {
        const products = await getProducts();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        const carouselHTML = `
            <div class="carousel-container">
                <h2 class="carousel-title">Bunları da Beğenebilirsiniz</h2>
                <button class="carousel-button prev-button">←</button>
                <div class="product-carousel">
                    ${products.map(product => `
                        <div class="product-item" data-product-id="${product.id}">
                            <img src="${product.img}" class="product-image" alt="${product.name}">
                            <div class="heart-icon ${favorites.includes(product.id) ? 'active' : ''}">❤</div>
                            <div class="product-info">
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">${product.price} TL</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-button next-button">→</button>
            </div>
        `;

        $('.product-detail').after(carouselHTML);

        const carousel = $('.product-carousel');
        
        const getScrollAmount = () => {
            const width = $(window).width();
            if (width <= 480) {
                return carousel.width() / 1.5; 
            } else if (width <= 768) {
                return carousel.width() / 2.5; 
            } else if (width <= 1024) {
                return carousel.width() / 4.5; 
            } else {
                return carousel.width() / 6.5;
            }
        };
        
        $('.next-button').on('click', function() {
            carousel.animate({
                scrollLeft: '+=' + getScrollAmount()
            }, 300);
        });

        $('.prev-button').on('click', function() {
            carousel.animate({
                scrollLeft: '-=' + getScrollAmount()
            }, 300);
        });

        $(window).on('resize', function() {
            carousel.scrollLeft = Math.floor(carousel.scrollLeft / getScrollAmount()) * getScrollAmount();
        });

        $('.product-item').on('click', function(e) {
            if (!$(e.target).hasClass('heart-icon')) {
                const productId = $(this).data('product-id');
                const product = products.find(p => p.id === productId);
                window.open(product.url, '_blank');
            }
        });

        $('.heart-icon').on('click', function(e) {
            e.stopPropagation();
            const productId = parseInt($(this).parent().data('product-id'));
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                const index = favorites.indexOf(productId);
                if (index > -1) favorites.splice(index, 1);
            } else {
                $(this).addClass('active');
                favorites.push(productId);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    };

    createCarousel();
}); 