const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
let allWorks = [];

function clear() {
    gallery.innerHTML = "";
}

function displayWorks(list) {
    clear();
    for (let work of list) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        figure.dataset.id = work.id;

        image.src = work.imageUrl;
        image.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    }
}

function createButtons(categories) {
    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.classList.add("active");
    filters.appendChild(allBtn);

    for (let category of categories) {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.id = category.id;
        filters.appendChild(button);
    }

    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            if (button.textContent === "Tous") {
                clear();
                displayWorks(allWorks);
            } else { 
                const categoryId = parseInt(button.dataset.id);
                const filtered = allWorks.filter(
                    (work) => work.categoryId === categoryId
                );
                clear();
                displayWorks(filtered);
            }
        })
    })
}

async function init() {
    const worksPromise = fetch("http://localhost:5678/api/works").then(r => r.json());
    const categoriesPromise = fetch("http://localhost:5678/api/categories").then(r => r.json());

    try {
        const works = await worksPromise;
        allWorks = works;
        displayWorks(allWorks);
    } catch (error) {
        console.log("Erreur lors de la récupération des travaux :", error);
    }

    try {
        const categories = await categoriesPromise;
        createButtons(categories);
        
    } catch (error) {
        console.log("Erreur lors de la récupération : ", error);
    }
}

init();