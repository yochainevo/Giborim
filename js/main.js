"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";

  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const errorMessage = document.getElementById("error-message");
  const servicesList = document.getElementById("services-list");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const logoEl = document.querySelector("#episode-logo img");

  const getEpisodeNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ep") || urlParams.get("episodeNumber") || "1";
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
        "לא ניתן לטעון את הנתונים. בדוק את הנתיב או את שם הקובץ.";
      return null;
    }
  };

  const formatDataForRender = (episodeRow) => {
    const epNumber = episodeRow["מספר פרק"];
    const imageName = epNumber === "Bonus"
      ? "Bonus_Logo.jpg"
      : `${String(epNumber).padStart(2, "0")}_Logo.jpg`;

    return {
      title: episodeRow["Title"] || "פרק ללא כותרת",
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
      logoUrl: `./images/episodes/${imageName}`,
    };
  };

  const renderServices = (data) => {
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    logoEl.setAttribute("src", data.logoUrl);

    // התאמה דינמית לגודל הפונט לפי אורך הטקסט
    const titleText = data.title || "";
    const baseSize = 1.6;
    let dynamicSize = baseSize;

    if (titleText.length > 40) {
      dynamicSize = 1.2;
    } else if (titleText.length > 30) {
      dynamicSize = 1.3;
    } else if (titleText.length > 22) {
      dynamicSize = 1.4;
    }

    titleEl.style.fontSize = `${dynamicSize}rem`;
    titleEl.style.lineHeight = "1";

    servicesList.className = "flex flex-col items-center gap-4";
    servicesList.innerHTML = "";

    data.links.forEach((service) => {
      servicesList.innerHTML += `
        <a href="${service.url}" target="_blank" rel="noopener noreferrer"
          class="service-button" aria-label="${service.name}">
          <img src="${service.logo}" alt="${service.name} Logo"
            class="service-logo" onerror="this.style.display='none'">
        </a>
      `;
    });

    loader.classList.add("hidden");
    content.classList.remove("hidden");
  };

  const init = async () => {
    const episodeNumber = getEpisodeNumber();
    const jsonData = await fetchJsonData();

    if (jsonData) {
      const episodeRow = jsonData.find(row => String(row["מספר פרק"]) === episodeNumber);
      if (episodeRow) {
        renderServices(formatDataForRender(episodeRow));
      } else {
        loader.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        errorMessage.querySelector("p").textContent =
          `הפרק "${episodeNumber}" לא נמצא. נסה מספר אחר או Bonus.`;
      }
    }
  };

  init();
});
