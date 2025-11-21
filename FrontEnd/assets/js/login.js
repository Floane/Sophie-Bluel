const form = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error");
console.log(form);
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    errorMsg.textContent = "";

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method : "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            let msg = 
                response.status === 401 ? "Mot de passe incorrect" :
                response.status === 404 ? "Utilisateur introuvable" : 
                "Identifiants incorrects";
            console.log(msg);
            
            errorMsg.textContent = msg;
            errorMsg.style.display = "block";
            return;
        }

        const data = await response.json();
        const token = data.token;

        localStorage.setItem("authToken", token);
        window.location.href = "index.html";

    } catch {
        console.error(err);
        errorMsg.textContent = "Une erreur est survenue. Réessayez plus tard.";
    }
});