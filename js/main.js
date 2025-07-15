"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";

  // הסרת אלמנט מומלצים אם הוא נוסף איכשהו
  const unwanted = document.getElementById("recommended-episodes");
  if (unwanted) {
    unwanted.remove();
  }

  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const errorMessage = document.getElementById("error-message");
  const servicesList = document.getElementById("services-list");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const logoEl = document.querySelector("#episode-logo img");

  const getEpisodeNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ep") || urlParams.get("episodeNumber") || "Lobby";
  };

  const fetchJsonData = async () => {
    try {
      const response = await fetch(FILE_PATH);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      loader.classList.add("hidden");
      errorMessage.classList.remove("hidden");
      errorMessage.querySelector("p").textContent =
        "לא ניתן לטעון את הנתונים.";
      return null;
    }
  };

  const formatDataForRender = (episodeRow) => {
    const epNumber = episodeRow["מספר פרק"];
    const logoFilename = epNumber === "Bonus"
      ? "Bonus_Logo.jpg"
      : `${String(epNumber).padStart(2, "0")}_Logo.jpg`;

    return {
      title: episodeRow["Title"] || "ללא כותרת",
      subtitle: episodeRow["Subtitle"] || "",
      links: [
        {
          name: "Spotify",
          url: episodeRow["SpotifyLink"],
          logo: "images/logo_spotify_onlight.svg",
        },
        {
          name: "Apple",
          url: episodeRow["AppleLink"],
          logo: "images/applepodcastlogo.svg",
        },
        {
          name: "YouTube",
          url: episodeRow["YoutubeLink"],
          logo: "images/logo_youtube_onlight.svg",
        },
      ],
      logoUrl: `./images/episodes/${logoFilename}`,
    };
  };

  const renderServices = (data) => {
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    logoEl.setAttribute("src", data.logoUrl);

    servicesList.innerHTML = "";

    data.links.forEach((service) => {
      const button = document.createElement("a");
      button.href = service.url;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.className = "service-button";
      button.setAttribute("aria-label", service.name);

      const img = document.createElement("img");
      img.src = service.logo;
      img.alt = `${service.name} Logo`;
      img.className = "service-logo";
      img.onerror = () => img.style.display = "none";

      button.appendChild(img);
      servicesList.appendChild(button);
    });

    loader.classList.add("hidden");
    content.classList.remove("hidden");
  };

  const init = async () => {
    const episodeNumber = getEpisodeNumber();
    const jsonData = await fetchJsonData();

    if (jsonData) {
      const episodeRow = jsonData.find(row =>
        String(row["מספר פרק"]) === episodeNumber
      );
      if (episodeRow) {
        renderServices(formatDataForRender(episodeRow));
      } else {
        loader.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        errorMessage.querySelector("p").textContent =
          `הפרק "${episodeNumber}" לא נמצא.`;
      }
    }
  };

  init();
});
