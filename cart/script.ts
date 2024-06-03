import { Product, buildNav, getCart, removeCart } from "../container.js"

let buildCart = (productList: Product[], mainDiv: HTMLElement) => {

  let addedPrices = 0
  for (let i = 0; i < productList.length; i++) {
    addedPrices += productList[i].price
  }
  

  function createCartCard(product: Product) {
    let cardDiv = document.createElement('div')

    let productImg = document.createElement('img')
    productImg.style.width = '20%'
    productImg.src = product.image

    let productName = document.createElement('p')
    productName.textContent = product.title

    let productPrice = document.createElement('p')
    productPrice.textContent = `${product.price}`

    let removeButton = document.createElement('button')
    removeButton.textContent = 'X'
    removeButton.onclick = () => {
      removeCart(product)
      alert('Elemento borrado exitosamente')
      location.reload()
    }

    cardDiv.appendChild(productImg)
    cardDiv.appendChild(productName)
    cardDiv.appendChild(productPrice)
    cardDiv.appendChild(removeButton)

    mainDiv.appendChild(cardDiv)
  }

  productList.forEach(createCartCard)
  let totalPrice = document.createElement('p')
  totalPrice.textContent = `Precio Total: ${addedPrices}`
  mainDiv.appendChild(totalPrice)
}

let main = async () => {
  try {
    let cartItems = await getCart()
    let mainDiv = document.getElementById('main')
    let navDiv = document.getElementById('nav')
    if (navDiv) {
      buildNav(navDiv)
    }
    if (cartItems && mainDiv) {
      buildCart(cartItems, mainDiv)
    } else {
      throw new Error('Fallo de fetch de carrito')
    }
  } catch (error) {
    console.error(error)
  }
}

main()