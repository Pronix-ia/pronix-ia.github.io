document.getElementById("loginButton").addEventListener("click", function() {
    document.getElementById("authModal").style.display = "block";
});

document.querySelector(".close-button").addEventListener("click", function() {
    document.getElementById("authModal").style.display = "none";
});

document.getElementById("submitAuthButton").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simuler l'authentification
    if (username && password) {
        localStorage.setItem("username", username);
        document.getElementById("authMessage").textContent = "";
        document.getElementById("authModal").style.display = "none";
        showMainContent();
    } else {
        document.getElementById("authMessage").textContent = "Veuillez remplir tous les champs.";
    }
});

document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("username");
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
    const userInput = document.getElementById("userInput").value;
    const responseContainer = document.getElementById("responseContainer");

    if (!userInput.trim()) {
        responseContainer.innerHTML = "<p style='color:red;'>Veuillez poser une question !</p>";
        return;
    }

    const response = getAIResponse(userInput);
    responseContainer.innerHTML = `<p><strong>IA :</strong> ${response.response}</p>`;
    
    // Si la réponse est une invitation à fournir une nouvelle réponse
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

    // Vérifier si la réponse a déjà été apprise
    if (learnedResponses[lowerCaseInput]) {
        return { response: learnedResponses[lowerCaseInput], learn: false };
    }

    const defaultResponses = {
        "comment coder en javascript ?": "Pour coder en JavaScript, commencez par apprendre la syntaxe de base, puis explorez des concepts comme les fonctions, les objets et les tableaux.",
        "qui est le président de la france ?": "Actuellement, le président de la France est Emmanuel Macron.",
        "quelle est la capitale de l'australie ?": "La capitale de l'Australie est Canberra.",
        "donne-moi un exemple de fonction en python.": "Voici un exemple : `def ma_fonction(): print('Bonjour !')`."
    };

    // Si aucune réponse n'est trouvée, on signale que l'IA doit apprendre
    return { response: "Désolé, je ne connais pas la réponse à cela.", learn: true };
}

function storeLearnedResponse(question, answer) {
    const learnedResponses = JSON.parse(localStorage.getItem("learnedResponses")) || {};
    learnedResponses[question.toLowerCase()] = answer;
    localStorage.setItem("learnedResponses", JSON.stringify(learnedResponses));
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
window.onload = function() {
    showMainContent();
};
