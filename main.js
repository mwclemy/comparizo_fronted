let myIndex = 0;
const viewCampgroundBtn = document.querySelector('.btn')
const homeScreen = document.querySelector('.homeScreen');
const signUpScreen = document.querySelector('.signUpScreen')
const loginScreen = document.querySelector('.loginScreen')
const allCampgroundScreen = document.querySelector('.allCampgroundScreen')
const allCampgroundArea = document.querySelector('.allCampground')
const createCampgroundBtn = document.querySelector('.createCampgroundBtn')
const showCampgroundArea = document.querySelector('.showCampgroundArea')
const createCampgroundArea = document.querySelector('.createCampgroundArea')
const signUpLink = document.querySelector('#signup-link')
const loginLink = document.querySelector('#login-link')
const logoutLink = document.querySelector('#logout-link')
const navLinks = document.querySelector('.nav-links')
const signUpForm = document.querySelector('.signup-form')
const loginForm = document.querySelector('.login-form')
const createCampgroundForm = document.querySelector('.create-campground-form')
const message = document.querySelector('.message')
const API_URL = 'http://localhost:3001'
const carousel = () => {
    const x = document.getElementsByClassName("mySlides");
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) { myIndex = 1 }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 3000); // Change image every 2 seconds
}

const hideElements = (...elements) => {
    for (let element of elements) {
        element.classList.add('hide');
    }
}

const showElements = (...elements) => {
    for (let element of elements) {
        element.classList.remove('hide');
    }
}

const removeActive = (...elements) => {
    for (let element of elements) {
        element.classList.remove('active');
    }
}

const addActive = (...elements) => {
    for (let element of elements) {
        element.classList.add('active');
    }
}

const isLoggedIn = () => {
    return localStorage.getItem('userId') !== null
}

const addCampground = (campground) => {
    const campgroundDiv = document.createElement('div')
    campgroundDiv.classList.add('campground')
    const image = document.createElement('img')
    image.src = campground.imageUrl
    image.alt = campground.name
    const name = document.createElement('h3')
    name.innerText = campground.name
    const button = document.createElement('button')
    button.innerText = 'More info'
    button.setAttribute('data-campground-id', campground.id)
    button.classList.add('moreInfo')

    button.addEventListener('click', (event) => {
        hideElements(allCampgroundScreen)
    })

    campgroundDiv.append(image, name, button)
    allCampgroundArea.append(campgroundDiv)
}

// window.addEventListener("load", carousel);

viewCampgroundBtn.addEventListener('click', async () => {
    // Get all campgrounds
    const response = await axios.get(`${API_URL}/campgrounds`)
    const allCampgrounds = response.data.campgrounds
    for (let campground of allCampgrounds) {
        addCampground(campground)
    }
    showElements(allCampgroundScreen, navLinks)
    hideElements(homeScreen)
})

signUpLink.addEventListener('click', () => {
    hideElements(loginScreen, homeScreen, allCampgroundScreen)
    showElements(signUpScreen)
    addActive(signUpLink)
    removeActive(loginLink)
})

loginLink.addEventListener('click', () => {
    hideElements(signUpScreen, homeScreen, allCampgroundScreen)
    showElements(loginScreen)
    addActive(loginLink)
    removeActive(signUpLink)
})

logoutLink.addEventListener('click', () => {
    localStorage.removeItem('userId')
    hideElements(logoutLink, allCampgroundScreen)
    showElements(signUpLink, loginLink, homeScreen, message)
})

signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const name = event.target.name.value
    const email = event.target.email.value
    const password = event.target.password.value

    try {
        const user = await axios.post(`${API_URL}/users`, {
            name: name,
            email: email,
            password: password
        })

        const userId = user.data.user.id
        localStorage.setItem('userId', userId)
        showElements(allCampgroundScreen, logoutLink)
        hideElements(signUpLink, loginLink, signUpScreen, message)
    } catch (error) {
        alert(error.message)
    }

})


loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    try {
        const user = await axios.post(`${API_URL}/users/login`, {
            email: email,
            password: password
        })

        const userId = user.data.user.id
        localStorage.setItem('userId', userId)
        showElements(allCampgroundScreen, logoutLink)
        hideElements(signUpLink, loginLink, loginScreen)
    } catch (error) {
        alert(error.message)
    }

})

createCampgroundForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log(event.target);
    const name = event.target.campgroundName.value
    const price = event.target.campgroundPrice.value
    const imageUrl = event.target.campgroundUrl.value
    const description = event.target.campgroundDescription.value

    const userId = localStorage.getItem('userId')
    const response = await axios.post(`${API_URL}/users/${userId}/campgrounds`, {
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description
    })

    showElements(allCampgroundScreen, showCampgroundArea)
    hideElements(createCampgroundArea)
    addCampground(response.data.campground)
})

createCampgroundBtn.addEventListener('click', () => {
    if (isLoggedIn()) {
        // const userId = localStorage.getItem('userId')
        hideElements(showCampgroundArea)
        showElements(createCampgroundArea)
    }
    else {
        showElements(message, loginScreen)
        hideElements(allCampgroundScreen)
        addActive(loginLink)
    }
})