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
            localStorage.removeItem("isLoggedIn");
            window.location.reload();
        });
    } else {
        if (banner) banner.style.display = "none";
        if (editBtn) editBtn.style.display = "none";
        if (filtersEdition) filtersEdition.style.display = "flex";

        if(loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }
    }
}