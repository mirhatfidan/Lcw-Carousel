$(document).ready(function () {
  const styles = `
        .carousel-container {
            max-width: 100%;
            margin: 20px auto;
            position: relative;
            padding: 0 20px;
        }
        .carousel-title {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        .product-carousel {
            display: flex;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }
        .product-item {
            flex: 0 0 calc(100% / 6.5);
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .product-item:hover {
            transform: translateY(-5px);
        }
        .product-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        }
        .product-info {
            text-align: center;
            margin-top: 10px;
        }
        .product-name {
            font-size: 14px;
            margin: 5px 0;
            color: #333;
        }
        .product-price {
            font-weight: bold;
            color: #0066cc;
        }
        .heart-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
            font-size: 20px;
            color: #ccc;
            transition: color 0.3s ease;
            z-index: 2;
            background-color: rgba(255, 255, 255, 0.8);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .heart-icon.active {
            color: #0066cc;
        }
        .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 2;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background 0.3s ease;
        }
        .carousel-button:hover {
            background: rgba(255,255,255,1);
        }
        .prev-button { 
            left: 10px; 
        }
        .next-button { 
            right: 0; 
        }
        @media (max-width: 1024px) {
            .product-item {
                flex: 0 0 calc(100% / 4.5);
            }
        }
        @media (max-width: 768px) {
            .product-item {
                flex: 0 0 calc(100% / 2.5);
            }
            .carousel-title {
                font-size: 20px;
            }
        }
        @media (max-width: 480px) {
            .product-item {
                flex: 0 0 calc(100% / 1.5);
            }
            .carousel-button {
                width: 30px;
                height: 30px;
            }
        }
    `;

  $('<style>').text(styles).appendTo('head');

  async function init() {
    try {
      const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
      const products = await response.json();

      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      const carouselHTML = `
                <div class="carousel-container">
                    <h2 class="carousel-title">You Might Also Like</h2>
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

      function getScrollAmount() {
        const width = $(window).width();
        if (width <= 480) return carousel.width() / 1.5;
        if (width <= 768) return carousel.width() / 2.5;
        if (width <= 1024) return carousel.width() / 4.5;
        return carousel.width() / 6.5;
      }

      $('.next-button').on('click', () => {
        carousel.animate({ scrollLeft: '+=' + getScrollAmount() }, 300);
      });

      $('.prev-button').on('click', () => {
        carousel.animate({ scrollLeft: '-=' + getScrollAmount() }, 300);
      });

      $('.product-item').on('click', function (e) {
        if (!$(e.target).hasClass('heart-icon')) {
          const productId = $(this).data('product-id');
          const product = products.find(p => p.id === productId);
          window.open(product.url, '_blank');
        }
      });

      $('.heart-icon').on('click', function (e) {
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
    } catch (error) {
      console.error('Hata:', error);
    }
  }

  init();
});
