const gallery = document.querySelector(".gallery")

// Récupération des travaux depuis le serveur
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        console.log(works)

        // Ajout des travaux à la galerie
        for (let work of works) {
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
    })
    .catch(error => {
        console.log("Erreur lors de la récupération des travaux :", error)
    })