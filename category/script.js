import { appendCart, getProductsByCategory } from "../container.js";
const queryString = window.location.search, urlParams = new URLSearchParams(queryString), category = urlParams.get('category');
let productList;
let ls = localStorage.getItem('productList');
let c = localStorage.getItem('category');
if (ls && c == category) {
    productList = JSON.parse(ls);
}
const closeDropdowns = () => {
    let dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].classList.contains('show')) {
            dropdowns[i].classList.remove('show');
        }
    }
};
const buildCategory = async (productList, mainDiv) => {
    function createProductCard(product) {
        let cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        let productImg = document.createElement('img');
        productImg.style.width = '40%';
        productImg.src = product.image;
        let productName = document.createElement('p');
        productName.classList.add('card-title');
        productName.textContent = product.title;
        let ratingBar = document.createElement('div');
        let ratingStars = document.createElement('p');
        ratingStars.textContent = `${product.rating.rate}`;
        let ratingCount = document.createElement('p');
        ratingCount.textContent = `${product.rating.count}`;
        ratingBar.appendChild(ratingStars);
        ratingBar.appendChild(ratingCount);
        let descBlock = document.createElement('div');
        descBlock.classList.add('dropdown');
        descBlock.onclick = (e) => {
            e.stopPropagation();
        };
        let descDropdown = document.createElement('div');
        descDropdown.classList.add('dropdown-content');
        let descToggle = document.createElement('button');
        descToggle.classList.add('dropbtn');
        descToggle.textContent = `Ver más...`;
        descToggle.onclick = () => {
            if (!descDropdown.classList.contains('show')) {
                closeDropdowns();
                descDropdown.classList.add('show');
            }
            else {
                descDropdown.classList.remove('show');
            }
        };
        let descBox = document.createElement('p');
        descBox.textContent = `${product.description}`;
        let productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;
        let addToCart = document.createElement('button');
        addToCart.textContent = 'Añadir a carrito';
        addToCart.onclick = () => {
            appendCart(product);
            alert('Producto añadido al carrito!');
        };
        descDropdown.appendChild(descBox);
        descDropdown.appendChild(addToCart);
        descBlock.appendChild(descToggle);
        descBlock.appendChild(descDropdown);
        cardDiv.appendChild(productImg);
        cardDiv.appendChild(productName);
        cardDiv.appendChild(productPrice);
        cardDiv.appendChild(ratingBar);
        cardDiv.appendChild(descBlock);
        mainDiv.append(cardDiv);
    }
    productList.forEach(createProductCard);
};
const main = async () => {
    try {
        if (category && !productList) {
            productList = await getProductsByCategory(category);
        }
        let mainDiv = document.getElementById('main');
        if (productList && category && mainDiv) {
            buildCategory(productList, mainDiv);
            localStorage.setItem('productList', JSON.stringify(productList));
            localStorage.setItem('category', category);
        }
        else {
            throw new Error('Fallo de fetch de productos');
        }
        window.onclick = closeDropdowns;
    }
    catch (error) {
        console.error(error);
    }
};
main();
