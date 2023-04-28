const searchButton = document.querySelector('.search-button')
const searchBarContainer = document.querySelector('.search-bar-container')
const dishNameInput = document.querySelector('#dish-name-input')
const recipeTitleDiv = document.querySelector('.recipe-title')
const recipeImage = document.querySelector('.recipe-image')
const ingredientsDiv = document.querySelector('.ingredients-container')
const ingredientsList = document.querySelector('.ingredients')
const recipeDiv = document.querySelector('.recipe-container')
const recipeButton = document.querySelector('.recipe-button')
const returnButton = document.querySelector('.return-button')
const instructionsDiv = document.querySelector('.instructions')
const goBackToSearchButton = document.querySelector('.go-back-to-search')
const searchButtonTextDiv = document.querySelector('.search-button-text')
const loaderCenterDiv = document.querySelector('.center')
const errorText = document.querySelector('.error-text')
const URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`

searchButton.addEventListener('click', async () => {
  searchButton.disabled = true
  loaderCenterDiv.classList.add('active')
  searchButtonTextDiv.classList.remove('active')
  const mealData = await searchForRecipe(dishNameInput.value)
  dishNameInput.value = ''
  addRecipeToPage(mealData)
})

recipeButton.addEventListener('click', () => {
  ingredientsDiv.classList.remove('active')
  recipeDiv.classList.add('active')
})

returnButton.addEventListener('click', () => {
  ingredientsDiv.classList.add('active')
  recipeDiv.classList.remove('active')
})

goBackToSearchButton.addEventListener('click', () => {
  ingredientsDiv.classList.remove('active')
  recipeDiv.classList.remove('active')
  searchBarContainer.classList.add('active')
  searchButtonTextDiv.classList.add('active')
  loaderCenterDiv.classList.remove('active')
  searchButton.disabled = false
  resetPage()
})

async function searchForRecipe(dishName) {
  try {
    errorText.classList.remove('active')
    const mealData = await getMealInfo(dishName)
    return mealData.meals[0]
  } catch (Exception) {
    console.log(Exception)
    errorText.classList.add('active')
  }
}

async function getMealInfo(dishName) {
  const FULL_URL = `${URL}${dishName}`
  const dishPromise = await fetch(FULL_URL)
  const response = await dishPromise.json()
  const data = await response
  return data
}

function addRecipeToPage(mealData) {
  const recipeTitle = document.createElement('h3')
  const recipeArea = document.createElement('p')
  recipeTitle.textContent = mealData.strMeal
  recipeArea.textContent = mealData.strArea
  recipeTitleDiv.append(recipeTitle)
  recipeTitleDiv.append(recipeArea)
  const recipeImg = document.createElement('img')
  recipeImg.src = mealData.strMealThumb
  recipeImage.append(recipeImg)
  const ingredientsUl = document.createElement('ul')
  const allProperties = Object.entries(mealData)
  let allIngredients = []
  let allMeasures = []
  allProperties.forEach((property) => {
    if (property[0].includes('strIngredient') && property[1] !== '') {
      allIngredients.push(property[1])
    } else if (property[0].includes('strMeasure') && property[1] !== '') {
      allMeasures.push(property[1])
    }
  })
  allIngredients.forEach((ingredient, index) => {
    const measure = allMeasures[index]
    const ingredientLi = document.createElement('li')
    ingredientLi.textContent = `${measure} ${ingredient}`
    ingredientsUl.append(ingredientLi)
  })
  ingredientsList.append(ingredientsUl)
  const recipeParagraph = document.createElement('p')
  recipeParagraph.innerText = mealData.strInstructions
  instructionsDiv.append(recipeParagraph)
  searchBarContainer.classList.remove('active')
  ingredientsDiv.classList.add('active')
}

function resetPage() {
  recipeTitleDiv.innerText = ''
  recipeImage.innerText = ''
  ingredientsList.innerText = ''
  instructionsDiv.innerText = ''
}
