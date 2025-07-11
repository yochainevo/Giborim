'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";

  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const errorMessage = document.getElementById("error-message");
  const servicesList = document.getElementById("services-list");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");

  const getEpisodeNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("episodeNumber") || "10";
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
        "Could not load the data file. Please check the file path.";
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
          url: episodeRow["קישור לספוטיפיי"],
          logo: "images/logo_spotify_onlight.svg",
        },

        {
          name: "להאזנה ב-Apple Podcast",
          url: episodeRow["קישור לאפל פודקסט"],
          logo: "images/applepodcastlogo.svg",
        },        

        {
          name: "להאזנה ב-YouTube",
          url: episodeRow["קישור ליוטיוב"],
          logo: "images/logo_youtube_onlight.svg",
        },     
        
      ],
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
    servicesList.innerHTML = "";

    data.links.forEach((service) => {
      const serviceElement = `
                    <a href="${service.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div class="flex items-center" style="width: 100%">
                            <div class="font-medium text-gray-800" style="flex: 100% 1 1;">${service.name}</div>
                            <img style="flex: 0" src="${service.logo}" alt="${service.name} Logo" class="w-13 h-11 object-contain mr-4" onerror="this.style.display='none'">
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
      // Match by episode number (assumes there's a column like "מספר פרק")
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
        ).textContent = `Could not find data for episode ${episodeNumber}.`;
      }
    }
  };

  init();
});
