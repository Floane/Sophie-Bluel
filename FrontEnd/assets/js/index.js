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

    loadCategoriesOnce();
    validateForm();
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

        const fig = document.getElementById("gallery-" + workId);
        fig.remove();

    } catch (err) {
        console.error("Erreur suppression :", err);
        alert("Erreur réseau lors de la suppression.");
    }
}


const addForm = document.getElementById("add-work-form");
const titleInput = document.getElementById("title-input");
const categorySel = document.getElementById("category-input");
const submitBtn = addForm.querySelector('button[type="submit"]');
let categoriesLoaded = false;

uploadTrigger.addEventListener("click", () => {
    uploadInput.click();
});

uploadInput.addEventListener("change", function () {
    const file = uploadInput.files[0];
    if (!file) { 
        validateForm(); 
        return; 
    }

    const okType = /image\/(png|jpg|jpeg)/i.test(file.type);
    const okSize = file.size <= 4 * 1024 * 1024;
    if (!okType || !okSize) {
        alert("Format accepté: JPG/PNG, 4 Mo max.");
        uploadInput.value = "";
        if (uploadPreview) uploadPreview.hidden = true;
        validateForm();
        return;
    }

    const url = URL.createObjectURL(file);
    if (uploadPreview) {
        uploadPreview.src = url;
        uploadPreview.hidden = false;
    }
    validateForm();
});

async function loadCategoriesOnce() {
    if (categoriesLoaded) return;
    try {
        const res = await fetch("http://localhost:5678/api/categories", {
            headers: { accept: "application/json" }
        });
        if (!res.ok) {
            console.error("Impossible de charger les catégories.");
            return;
        }
        const categories = await res.json();

        categorySel.innerHTML = '<option value="">Choisir une catégorie</option>';
        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = String(cat.id);
            opt.textContent = cat.name;
            categorySel.appendChild(opt);
        });

        categoriesLoaded = true;
    } catch (error) {
        console.error("Erreur chargement des catégories:", error);
    }
}

function setSubmitEnabled(enabled) {
    submitBtn.disabled = !enabled;
    submitBtn.classList.toggle("btn-disabled", !enabled);
}

function validateForm() {
    const hasImage = uploadInput.files[0];
    const hasTitle = titleInput.value.trim().length > 0;
    const hasCat = categorySel.value !== "";
    setSubmitEnabled(Boolean(hasImage && hasTitle && hasCat));
}

titleInput.addEventListener("input", validateForm);
categorySel.addEventListener("change", validateForm);
addForm.addEventListener("submit", submitNewWork);

async function submitNewWork(e) {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) { alert("Vous devez être connecté."); return; }

    validateForm();
    if (submitBtn.disabled) {
        alert("Veuillez remplir tous les champs (image, titre, catégorie).");
        return;
    }

    const fd = new FormData();
    fd.append("image", uploadInput.files[0]); 
    fd.append("title", titleInput.value.trim()); 
    fd.append("category", Number(categorySel.value)); 

    setSubmitEnabled(false);

    try {
        const res = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`  
            },
            body: fd
        });

        if (!res.ok) {
            if (res.status === 400) alert("Formulaire invalide.");
            else if (res.status === 401) alert("Non autorisé. Reconnectez-vous.");
            else alert("Erreur lors de l’envoi.");
            validateForm();
            return;
        }

        const newWork = await res.json();

        allWorks.push(newWork);
        displayWorks(allWorks);
        renderModalGrid();

        addForm.reset();
        uploadPreview.hidden = true;
        setSubmitEnabled(false);

        showGallery();

    } catch (err) {
        console.error("Erreur POST /works:", err);
        alert("Erreur réseau lors de l’envoi.");
    }
}