const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")
let allWorks = []

// Fonction pour nettoyer la galerie
function clear() {
    gallery.innerHTML = ""
}

// Fonction pour afficher les travaux
function displayWorks(list) {
    clear()
    for (let work of list) {

        const figure = document.createElement("figure")
        const image = document.createElement("img")
        const figcaption = document.createElement("figcaption")

        image.src = work.imageUrl
        image.alt = work.title
        figcaption.textContent = work.title

        figure.appendChild(image)
        figure.appendChild(figcaption)

        gallery.appendChild(figure)
    }
}

// Fonction pour créer les boutons de filtres
function createButtons(categories) {
    // Création du bouton "Tous"
    const allBtn = document.createElement("button")
    allBtn.textContent = "Tous"
    allBtn.classList.add("active")
    filters.appendChild(allBtn)

    // Création des autres boutons
    for (let category of categories) {
        const button = document.createElement("button")
        button.textContent = category.name
        button.dataset.id = category.id
        filters.appendChild(button)
    }

    // Clic sur les boutons
    const buttons = document.querySelectorAll(".filters button")
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((btn) => btn.classList.remove("active"))
            button.classList.add("active")

            // Si bouton "Tous" est sélectionné, tout afficher
            if (button.textContent === "Tous") {
                clear()
                displayWorks(allWorks)
            } else { // Sinon, filtrer
                const categoryId = parseInt(button.dataset.id)
                const filtered = allWorks.filter(
                    (work) => work.categoryId === categoryId
                )
                clear()
                displayWorks(filtered)
            }
        })
    })
}

// Récupération des travaux depuis le serveur
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works
        displayWorks(allWorks)

        // Récupération des catégories depuis le serveur
        return fetch("http://localhost:5678/api/categories")
    })
    .then((response) => response.json())
    .then((categories) => {
        createButtons(categories)
    })
    .catch(error => {
        console.log("Erreur lors de la récupération :", error)
    })