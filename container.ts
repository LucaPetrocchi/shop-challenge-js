type Category = string

type Rating = {
  rate: number,
  count: number,
}

type Product = {
  id: number,
  title: string,
  price: number,
  category: Category,
  description: string,
  image: string
  rating: Rating,
}

type navUrl = {
  name: string,
  path: string,
}

const getCategories = async () => {
  try {
    let response = await fetch('https://fakestoreapi.com/products/categories')
    let json: Category[] = await response.json()
    return json
  } catch (error) {
    console.error('Error', error)
  }
}

const getProductsByCategory = async (
  cat: Category,
  limit?: number,
) => {
  try {
    let url = `https://fakestoreapi.com/products/category/${cat}${(limit) ? `?limit=${limit}` : ''}`
    let response = await fetch(url)
    let json: Product[] = await response.json()
    return json
  } catch (error) {
    console.error('Error', error)
  }
}

const getProductDetails = async (id: number) => {
  try {
    let response = await fetch(`https://fakestoreapi.com/products/${id}`)
    let json: Product = await response.json()
    return json
  } catch (error) {
    console.error('Error', error)
  }
}

const saveCart = async (items: Product[]) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const getCart = async () => {
  let c = localStorage.getItem('cart')
  if (c) {
    let cart: Product[] = JSON.parse(c)
    return cart
  } else {
    return null
  }
}

const appendCart = async (item: Product) => {
  let cart = await getCart()
  if (cart) {
    cart.unshift(item)
  } else {
    cart = [item]
  }

  saveCart(cart)
}

const removeCart = async (item: Product) => {
  try {
    let cart = await getCart()
    if (cart) {
      let index = cart.map(cartItem => cartItem.title).indexOf(item.title)
      console.log(index)
      if (index >= 0) {
        cart.splice(index, 1)
        saveCart(cart)
      } else {
        throw new Error('No existe ítem en el carrito')
      }
    } else {
      throw new Error('No hay carrito')
    }
  } catch (error) {
    console.error(error)
  }
}

const buildNav = async (element: HTMLElement, categories?: Category[]) => {
  let urls: navUrl[] = [
    {
      name: 'Página Principal',
      path: '/index/index.html'
    },
    {
      name: 'Carrito',
      path: '/cart/cart.html'
    }
  ]
  if (!categories) {
    categories = await getCategories()
  }

  let navList = document.createElement('ul')
  navList.classList.add('nav-list')

  function createNavItem(url: navUrl) {
    let navItem = document.createElement('li')
    navItem.classList.add('nav-item')
    
    let navText: HTMLParagraphElement | HTMLAnchorElement
    console.log(window.location.pathname)
    console.log(url.path)
    if (window.location.pathname === url.path) {
      navText = document.createElement('p')
    } else {
      navText = document.createElement('a')
    }

    navText.textContent = url.name
    if (navText instanceof HTMLAnchorElement) { 
      navText.href = `..${url.path}`
    } 
    // funky if clause because else TS complains about missing
    // "href" property. 
    // alternative: "navText: any" & assign navText.href
    // in above if block

    navItem.appendChild(navText)

    navList.appendChild(navItem)
  }

  urls.forEach(createNavItem)

  if (categories) {
    let categoryDropdown = document.createElement('li')
    categoryDropdown.classList.add('nav-dropdown', 'nav-item')

    let dropdownText = document.createElement('p')
    dropdownText.textContent = 'Categorías'

    let dropdownContent = document.createElement('div')
    dropdownContent.classList.add('nav-dropdown-content')

    categories.forEach((cat) => {
      let dropdownElement = document.createElement('a')
      let capitalized = cat.charAt(0).toUpperCase() + cat.slice(1)
      dropdownElement.textContent = capitalized
      dropdownElement.href = `../category/category.html?category=${cat}`
      
      dropdownContent.appendChild(dropdownElement)
    })
    
    categoryDropdown.appendChild(dropdownText)
    categoryDropdown.appendChild(dropdownContent)
    
    navList.append(categoryDropdown)
  }

  element.appendChild(navList)
}

export {
  Product,
  Category,
  Rating,
  getCategories,
  getProductsByCategory,
  getProductDetails,
  getCart,
  appendCart,
  removeCart,
  buildNav,
}