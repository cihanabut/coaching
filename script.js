document.addEventListener("DOMContentLoaded", () => {
  const coachingForm = document.getElementById("coachingForm");
  const topicInput = document.getElementById("topic");
  const languageSelect = document.getElementById("language");
  const additionalInfoTextarea = document.getElementById("additionalInfo");
  const generateButton = document.getElementById("generateButton");
  const resultSection = document.getElementById("resultSection");
  const coachingResult = document.getElementById("coachingResult");
  const generateAudioButton = document.getElementById("generateAudioButton");
  const sendEmailButton = document.getElementById("sendEmailButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const audioElement = document.getElementById("audioElement");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const currentYearElement = document.getElementById("currentYear");

  // S'assure que le loadingOverlay est bien caché au chargement de la page
  loadingOverlay.classList.add("hidden");

  // Affiche l'année actuelle
  currentYearElement.textContent = new Date().getFullYear();

  // Formulaire
  coachingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const topic = topicInput.value.trim();
    const language = languageSelect.value;
    const additionalInfo = additionalInfoTextarea.value.trim();

    if (!topic) {
      showToast("Veuillez entrer un sujet pour votre pause tranquillité");
      return;
    }

    showLoading(true);

    const coachingResponse = await fetchCoachingResponse(
      topic,
      language,
      additionalInfo
    );

    coachingResult.textContent = coachingResponse;
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });

    showToast("Votre pause tranquillité a été générée avec succès");
    showLoading(false);
  });

  // Boutons non activés
  generateAudioButton.addEventListener("click", () => {
    showToast("La fonctionnalité audio sera disponible prochainement");
  });

  sendEmailButton.addEventListener("click", () => {
    showToast(
      "La fonctionnalité d'envoi par email sera disponible prochainement"
    );
  });

  // Audio player
  audioElement.addEventListener("ended", () => {
    audioPlayer.classList.add("hidden");
  });
  audioElement.addEventListener("play", () => {
    audioPlayer.classList.remove("hidden");
  });

  // Fonctions audio (optionnel)
  window.playAudio = () => {
    audioElement.play();
  };

  window.pauseAudio = () => {
    audioElement.pause();
  };

  // API OpenRouter
  async function fetchCoachingResponse(topic, language, additionalInfo) {
    const apiKey =
      "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";

    const messages = [
      {
        role: "system",
        content:
          "Tu es un coach spécialisé en santé mentale, bienveillant et apaisant. Tu donnes des conseils pour aider à gérer le stress et retrouver la paix intérieure.",
      },
      {
  role: "user",
  content: `Donne-moi une minute de conseils en ${language} sur le sujet suivant lié à la santé mentale : "${topic}". Infos supplémentaires : ${additionalInfo}`,
},

    ];

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost",
            "X-Title": "La minute tranquillité",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: messages,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erreur API OpenRouter :", errorData);
        showLoading(false); // Assurez-vous que le spinner est masqué en cas d'erreur
        return "Une erreur est survenue. Veuillez réessayer.";
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erreur JS :", error);
      showLoading(false); // Assurez-vous que le spinner est masqué en cas d'erreur
      return "Une erreur est survenue. Veuillez réessayer.";
    }
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  function showLoading(show) {
    if (show) {
      loadingOverlay.classList.remove("hidden");
      generateButton.disabled = true;
    } else {
      loadingOverlay.classList.add("hidden");
      generateButton.disabled = false;
    }
  }
});
