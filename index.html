"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";

  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const errorMessage = document.getElementById("error-message");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const logoImage = document.getElementById("logo-image");
  const servicesList = document.getElementById("services-list");

  const getEpisodeNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ep") || "Lobby";
  };

  const fetchJsonData = async () => {
    try {
      const response = await fetch(FILE_PATH);
      if (!response.ok) throw new Error(`שגיאה בטעינת JSON`);
      return await response.json();
    } catch (error) {
      console.error(error);
      showError("בעיה בטעינת הנתונים.");
      return null;
    }
  };

  const formatData = (row) => {
    const epNumber = row["מספר פרק"];
    let logoFilename;

    if (epNumber === "Bonus") {
      logoFilename = "Bonus_Logo.jpg";
    } else if (epNumber === "Lobby") {
      logoFilename = "Main_Logo.jpg";
    } else {
      logoFilename = `${String(epNumber).padStart(2, "0")}_Logo.jpg`;
    }

    return {
      title: row["Title"] || "ללא כותרת",
      subtitle: row["Subtitle"] || "",
      logoUrl: `images/episodes/${logoFilename}`,
      links: [
        { name: "Spotify", url: row["SpotifyLink"], logo: "images/logo_spotify_onlight.svg" },
        { name: "Apple",   url: row["AppleLink"],   logo: "images/applepodcastlogo.svg" },
        { name: "YouTube", url: row["YoutubeLink"], logo: "images/logo_youtube_onlight.svg" }
      ]
    };
  };

  const renderEpisode = (data) => {
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    logoImage.setAttribute("src", data.logoUrl);

    servicesList.innerHTML = "";
    data.links.forEach(service => {
      if (service.url) {
        servicesList.innerHTML += `
          <a href="${service.url}" target="_blank" class="service-button" aria-label="${service.name}">
            <img src="${service.logo}" alt="${service.name} Logo" class="service-logo" />
          </a>
        `;
      }
    });

    loader.classList.add("hidden");
    content.classList.remove("hidden");
  };

  const showError = (msg) => {
    loader.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    errorMessage.querySelector("p").textContent = msg;
  };

  const init = async () => {
    const ep = getEpisodeNumber();
    const jsonData = await fetchJsonData();
    if (jsonData) {
      const row = jsonData.find(entry => String(entry["מספר פרק"]) === ep);
      if (row) {
        renderEpisode(formatData(row));
      } else {
        showError(`הפרק "${ep}" לא נמצא.`);
      }
    }
  };

  init();
});
