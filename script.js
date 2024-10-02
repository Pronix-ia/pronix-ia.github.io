let verificationCode; // Variable pour stocker le code de vérification

document.getElementById("loginButton").addEventListener("click", function() {
    document.getElementById("authModal").style.display = "block";
});

document.querySelector(".close-button").addEventListener("click", function() {
    document.getElementById("authModal").style.display = "none";
});

document.getElementById("submitAuthButton").addEventListener("click", function() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username && email && password) {
        if (validateEmail(email)) {
            // Générer un code de vérification aléatoire
            verificationCode = Math.floor(100000 + Math.random() * 900000); // Code à 6 chiffres
            alert(`Un e-mail de vérification a été envoyé à ${email}. Votre code est : ${verificationCode}`); // Simuler l'envoi de l'e-mail
            
            // Afficher la section de vérification
            document.getElementById("verificationSection").style.display = "block";
            document.getElementById("authMessage").textContent = "";
        } else {
            document.getElementById("authMessage").textContent = "Veuillez entrer un e-mail valide.";
        }
    } else {
        document.getElementById("authMessage").textContent = "Veuillez remplir tous les champs.";
    }
});

document.getElementById("verifyButton").addEventListener("click", function() {
    const enteredCode = document.getElementById("verificationCode").value.trim();
    const verificationMessage = document.getElementById("verificationMessage");

    if (enteredCode === verificationCode.toString()) {
        localStorage.setItem("username", document.getElementById("username").value.trim());
        localStorage.setItem("email", document.getElementById("email").value.trim());
        verificationMessage.textContent = "";
        document.getElementById("verificationSection").style.display = "none";
        document.getElementById("authModal").style.display = "none";
        showMainContent();
    } else {
        verificationMessage.textContent = "Le code de vérification est incorrect. Veuillez réessayer.";
    }
});

document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    hideMainContent();
});

function showMainContent() {
    const username = localStorage.getItem("username");
    if (username) {
        document.querySelector("header p").textContent = `Connecté en tant que ${username}`;
        document.getElementById("mainContent").style.display = "block";
    }
}

function hideMainContent() {
    document.getElementById("mainContent").style.display = "none";
    document.querySelector("header p").textContent = "Posez-moi n'importe quelle question après vous être connecté !";
}

document.getElementById("askButton").addEventListener("click", function() {
    const userInput = document.getElementById("userInput").value.trim();
    const responseContainer = document.getElementById("responseContainer");

    if (!userInput) {
        responseContainer.innerHTML = "<p style='color:red;'>Veuillez poser une question !</p>";
        return;
    }

    const response = getAIResponse(userInput);
    responseContainer.innerHTML = `<p><strong>IA :</strong> ${response.response}</p>`;
    
    if (response.learn) {
        const newAnswer = prompt("Je ne connais pas la réponse à cela. Comment devrais-je répondre ?");
        if (newAnswer) {
            storeLearnedResponse(userInput, newAnswer);
            responseContainer.innerHTML += `<p><strong>IA :</strong> Merci, j'ai appris quelque chose de nouveau !</p>`;
        }
    }

    document.getElementById("userInput").value = "";
});

function getAIResponse(input) {
    const learnedResponses = JSON.parse(localStorage.getItem("learnedResponses")) || {};
    const lowerCaseInput = input.toLowerCase();

    // Réponses préenregistrées
    const predefinedResponses = {
        "comment coder en javascript ?": "Pour coder en JavaScript, commencez par apprendre la syntaxe de base.",
        "qui est le président de la france ?": "Le président de la France est Emmanuel Macron.",
        "quelle est la capitale de l'australie ?": "La capitale de l'Australie est Canberra."
    };

    // Vérification des réponses apprises
    if (learnedResponses[lowerCaseInput]) {
        return { response: learnedResponses[lowerCaseInput], learn: false };
    }

    // Si aucune réponse n'est trouvée, proposer d'apprendre
    return { response: "Désolé, je ne connais pas la réponse à cela.", learn: true };
}

function storeLearnedResponse(question, answer) {
    const learnedResponses = JSON.parse(localStorage.getItem("learnedResponses")) || {};
    learnedResponses[question.toLowerCase()] = answer;
    localStorage.setItem("learnedResponses", JSON.stringify(learnedResponses));
}

// Fonction de validation d'e-mail
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
window.onload = function() {
    showMainContent();
};
