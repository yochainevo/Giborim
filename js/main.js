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
    return urlParams.get("ep") || urlParams.get("episodeNumber") || "10";
  };

  const fetchJsonData = async () => {
    try {
      const response = await fetch(FILE_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON file:", error);
      loader.classList.add("hidden");
      errorMessage.classList.remove("hidden");
      errorMessage.querySelector("p").textContent =
        "לא ניתן לטעון את קובץ הנתונים. בדוק את הנתיב.";
      return null;
    }
  };

  const formatDataForRender = (episodeRow) => {
    return {
      title: episodeRow["שם הפרק"] || "Unknown Title",
      subtitle: episodeRow["שם הדמות"] || "Choose a service",
      links: [
        {
          name: "להאזנה ב-Spotify",
          url: episodeRow["SpotifyLink"],
          logo: "images/logo_spotify_onlight.svg",
        },
        {
          name: "להאזנה ב-Apple Podcasts",
          url: episodeRow["AppleLink"],
          logo: "images/applepodcastlogo.svg",
        },
        {
          name: "להאזנה ב-YouTube",
          url: episodeRow["YoutubeLink"],
          logo: "images/logo_youtube_onlight.svg",
        },
      ],
    logoUrl: `./images/episodes/${String(episodeRow["מספר פרק"]).padStart(2, "0")}_Logo.jpg`,
    };
  };

  const renderServices = (data) => {
    if (!data || !data.links) {
      loader.classList.add("hidden");
      errorMessage.classList.remove("hidden");
      return;
    }

    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;

    logoEl.setAttribute("src", data.logoUrl);

    // הוספת מחלקות Tailwind לעיצוב עם רווח
    servicesList.className = "flex flex-col space-y-4 p-4";

    servicesList.innerHTML = "";

    data.links.forEach((service) => {
      const serviceElement = `
            <a href="${service.url}" target="_blank" rel="noopener noreferrer"
              class="flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 bg-white shadow">
              <div class="flex items-center w-full">
                <div class="font-medium text-gray-800 w-full" style="padding-right:1em;">${service.name}</div>
                <img src="${service.logo}" alt="${service.name} Logo"
                  class="w-13 h-11 object-contain mr-4" onerror="this.style.display='none'">
              </div>
            </a>
          `;
      servicesList.innerHTML += serviceElement;
    });

    loader.classList.add("hidden");
    content.classList.remove("hidden");
  };

  const init = async () => {
    const episodeNumber = getEpisodeNumber();
    const jsonData = await fetchJsonData();

    if (jsonData) {
      const episodeRow = jsonData.find(
        (row) => row["מספר פרק"] == episodeNumber
      );
      if (episodeRow) {
        const formattedData = formatDataForRender(episodeRow);
        renderServices(formattedData);
      } else {
        loader.classList.add("hidden");
        errorMessage.classList.remove("hidden");
        errorMessage.querySelector(
          "p"
        ).textContent = `לא נמצאו נתונים עבור פרק ${episodeNumber}.`;
      }
    }
  };

  init();
});
