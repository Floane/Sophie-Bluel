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

function showGallery(){
    title.textContent = "Galerie photo";
    viewGal.hidden = false; 
    viewGal.setAttribute("aria-hidden","false");
    viewForm.hidden = true;
    viewForm.setAttribute("aria-hidden", "true");
    btnBack.hidden = true;
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