const token = localStorage.getItem("authToken");
const banner = document.getElementById("edition-banner");
const loginLink = document.getElementById("login-link");
const editBtn = document.getElementById("edit-btn");
const filtersEdition = document.getElementById("filters");

if (token) {
    if (banner) banner.style.display = "flex";
    if (editBtn) editBtn.style.display = "flex";
    if (filtersEdition) filtersEdition.style.display = "none";

    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("authToken");
            window.location.reload();
        });

    } else {
        if (banner) banner.style.display = "none";
        if (editBtn) editBtn.style.display = "none";
        if (filtersEdition) filtersEdition.style.display = "flex";
    }
}

const dlg = document.getElementById("works-modal");
const btnOpen = document.getElementById("edit-btn");
const btnClose = document.getElementById("modal-close");
const btnBack = document.getElementById("modal-back");
const viewGal = document.getElementById("modal-view-gallery");
const viewForm = document.getElementById("modal-view-form");
const btnOpenAdd = document.getElementById("btn-open-add");
const title = document.getElementById("modal-title");
const uploadTrigger = document.getElementById("upload-trigger");
const uploadInput = document.getElementById("upload-input");
const uploadPreview = document.getElementById("upload-preview");
const modalGrid = document.getElementById("modal-grid");

function showGallery(){
    title.textContent = "Galerie photo";
    viewGal.hidden = false; 
    viewGal.setAttribute("aria-hidden","false");
    viewForm.hidden = true;
    viewForm.setAttribute("aria-hidden", "true");
    btnBack.hidden = true;
}

function renderModalGrid() {
    const grid = document.getElementById("modal-grid");
    if (!grid || !Array.isArray(allWorks)) return;

    grid.innerHTML = "";
    allWorks.forEach((work) => {
        const fig = document.createElement("figure");
        fig.className = "modal_thumb";
        fig.dataset.id = work.id;

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const delBtn = document.createElement("button");
        delBtn.className = "modal_trash";
        delBtn.setAttribute("aria-label", "Supprimer");
        delBtn.dataset.id = work.id;
        delBtn.innerHTML = "<i class='bx bxs-trash'></i>";

        fig.appendChild(img);
        fig.appendChild(delBtn);
        grid.appendChild(fig);
    });
}

function showForm() {
    title.textContent = "Ajout photo";
    viewGal.hidden = true; 
    viewGal.setAttribute("aria-hidden","true");
    viewForm.hidden = false;
    viewForm.setAttribute("aria-hidden", "false");
    btnBack.hidden = false;
}

editBtn.addEventListener ("click", () => {
    dlg.showModal();
    showGallery();
    renderModalGrid();
});

btnOpenAdd.addEventListener ("click", () => {
    showForm();
});

btnBack.addEventListener("click", () => {
    showGallery();
});

btnClose.addEventListener("click", () => {
    dlg.close();
});

dlg.addEventListener("click", (event) => {
    const panel = dlg.querySelector(".modal_panel");
    if (!panel) return;
    const clickInside = panel.contains(event.target);
    if (!clickInside) dlg.close();
});


modalGrid.addEventListener("click", onModalGridClick);

function onModalGridClick(e) {
    const delBtn = e.target.closest(".modal_trash");
    if (!delBtn) return;
    const id = parseInt(delBtn.dataset.id, 10);
    if (!id) return;


    deleteWork(id, delBtn);
}

async function deleteWork(workId, sourceBtn) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Vous devez être connecté pour supprimer un projet.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                alert("Session expirée ou non autorisée. Veuillez vous reconnecter.");
            } else {
                alert("La suppression a échoué. Réessayez.");
            }
            return;
        }

        allWorks = allWorks.filter(w => w.id !== workId);

        const figModal = sourceBtn.closest("figure.modal_thumb");
        if (figModal) figModal.remove();

        const mainGallery = document.querySelector(".gallery");
        if (mainGallery) {
            const toRemove = mainGallery.querySelectorAll("figure");
            toRemove.forEach(fig => {
                const img = fig.querySelector("img");
                const title = fig.querySelector("figcaption");
                if (img && img.src && title && img.src.includes(String(workId))) {
                    fig.remove();
                }
            });
        }

    } catch (err) {
        console.error("Erreur suppression :", err);
        alert("Erreur réseau lors de la suppression.");
    }
}