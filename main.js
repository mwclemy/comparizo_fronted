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
const campgroundInfo = document.querySelector('.campgroundInfo')
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

const getUser = async () => {
    const userId = localStorage.getItem('userId')
    const response = await axios.get(`${API_URL}/users/${userId}`)
    return response.data.user
}

const removeAllChildren = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const createComment = (comment) => {
    const commentDiv = document.createElement('div')
    commentDiv.classList.add('comment')
    const userComment = document.createElement('h3')
    userComment.innerText = `${comment.submittedBy}`
    const commentText = document.createElement('p')
    commentText.innerText = comment.text
    commentDiv.append(userComment)
    commentDiv.append(commentText)

    return commentDiv
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

    button.addEventListener('click', async (event) => {
        hideElements(allCampgroundScreen)
        removeAllChildren(campgroundInfo)

        if (isLoggedIn()) {
            const campgroundId = event.target.getAttribute('data-campground-id')
            const response = await axios.get(`${API_URL}/campgrounds/${campgroundId}/comments`)
            const comments = response.data.comments

            const campgroundName = document.createElement('h2')
            campgroundName.innerText = campground.name
            const description = document.createElement('p')
            description.innerText = campground.description
            const submittedBy = document.createElement('p')
            submittedBy.innerHTML = `-Submitted by <b>${campground.user.name}</b>`

            const commentArea = document.createElement('div')
            commentArea.classList.add('commentArea')

            const addCommentBtn = document.createElement('button')
            addCommentBtn.innerText = 'Add Comment'
            addCommentBtn.classList.add('addCommentBtn')

            const commentForm = document.createElement('form')
            const divComment = document.createElement('div')
            const labelComment = document.createElement('label')
            labelComment.setAttribute("for", "commentText")
            labelComment.innerText = "Type your comment"
            const inputComment = document.createElement('input')
            inputComment.setAttribute("type", "text")
            inputComment.setAttribute("name", "commentText")
            inputComment.setAttribute("id", "commentText")
            const submitComment = document.createElement('input')
            submitComment.setAttribute("type", "submit")

            divComment.append(labelComment)
            divComment.append(inputComment)
            divComment.append(submitComment)

            commentForm.append(divComment)
            commentForm.addEventListener('submit', async (event) => {
                event.preventDefault()
                const commentText = event.target.commentText.value
                const currentUser = await getUser()
                const response = await axios.post(`${API_URL}/comments`, {
                    text: commentText,
                    userId: currentUser.id,
                    campgroundId: campgroundId,
                    submittedBy: currentUser.name
                })

                const newComment = createComment(response.data.comment)
                commentArea.append(newComment)
                hideElements(commentForm)

            })
            hideElements(commentForm)

            commentArea.append(addCommentBtn)
            commentArea.append(commentForm)


            addCommentBtn.addEventListener('click', () => {
                showElements(commentForm)
            })

            for (let comment of comments) {
                const newCommentDiv = createComment(comment)
                commentArea.append(newCommentDiv)
            }

            campgroundInfo.append(image)
            campgroundInfo.append(campgroundName)
            campgroundInfo.append(description)
            campgroundInfo.append(submittedBy)
            campgroundInfo.append(commentArea)
        }
        else {
            showElements(message, loginScreen)
            hideElements(allCampgroundScreen)
            addActive(loginLink)
        }

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
    if (isLoggedIn()) {
        hideElements(loginLink, signUpLink, message)
        showElements(logoutLink)
    }
    else {
        hideElements(logoutLink)
        showElements(loginLink, signUpLink)
    }
    hideElements(homeScreen)
})

signUpLink.addEventListener('click', () => {
    hideElements(loginScreen, homeScreen, allCampgroundScreen, message)
    showElements(signUpScreen)
    addActive(signUpLink)
    removeActive(loginLink)
})

loginLink.addEventListener('click', () => {
    hideElements(signUpScreen, homeScreen, allCampgroundScreen, message)
    removeAllChildren(campgroundInfo)
    showElements(loginScreen)
    addActive(loginLink)
    removeActive(signUpLink)
})

logoutLink.addEventListener('click', () => {
    localStorage.removeItem('userId')
    hideElements(logoutLink, allCampgroundScreen, navLinks, createCampgroundArea, campgroundInfo)
    showElements(signUpLink, loginLink, homeScreen)
    location.reload();
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
        showElements(allCampgroundScreen, logoutLink, showCampgroundArea)
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
        showElements(allCampgroundScreen, logoutLink, showCampgroundArea)
        hideElements(signUpLink, loginLink, loginScreen, message)
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
        hideElements(showCampgroundArea, message)
        showElements(createCampgroundArea)
    }
    else {
        showElements(message, loginScreen)
        hideElements(allCampgroundScreen)
        addActive(loginLink)
    }
})