import { 
  buildNav,
  getCategories, 
  getProductsByCategory,
  Product,
} from "../container.js"


const buildIndex = async (exampleProducts: Product[], mainDiv: HTMLElement) => {

  function createExampleCard(product: Product) {
    let cardDiv = document.createElement('a')
    cardDiv.classList.add('card')
    cardDiv.href = `../category/category.html?category=${product.category}`
    let productImg = document.createElement('img')
    productImg.style.width = '40%'
    productImg.src = product.image
    
    let categoryTitle = document.createElement('h1')
    categoryTitle.textContent = product.category
    
    cardDiv.appendChild(productImg)
    cardDiv.appendChild(categoryTitle)
    
    mainDiv.appendChild(cardDiv)
  }
  
  exampleProducts.forEach(createExampleCard)
}

const main = async () => {
  let mainDiv = document.getElementById('main')
  let navDiv = document.getElementById('nav')
  
  if (navDiv) {
    buildNav(navDiv)
  }

  const categories = await getCategories()
  let examples: Product[] = []
  if (categories && mainDiv) {
    for (let i = 0; i < categories.length; i++) {
      let example = await getProductsByCategory(categories[i], 1)
      if (example)
        examples.unshift(example[0])
    }
    buildIndex(examples, mainDiv)
  }

}
main()