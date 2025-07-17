"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";
  const recommendedEl = document.getElementById("recommended-episodes");
  const contentEl = document.getElementById("content");
  const loaderEl = document.getElementById("loader");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const logoImageEl = document.querySelector("#episode-logo img");
  const servicesListLinksEls = document.querySelectorAll("#services-list a");

  const getEpisodeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ep") || "Lobby";
  };

  const fetchJsonData = async () => {
    try {
      const response = await fetch(FILE_PATH);
      if (!response.ok) throw new Error("שגיאה בטעינת JSON");
      return await response.json();
    } catch (error) {
      console.error(error);
      recommendedEl.innerHTML =
        "<p class='text-red-400'>בעיה בטעינת הפרקים.</p>";
      return null;
    }
  };

  const formatDataForRender = (row) => {
    const epId = row["מספר פרק"];
    const imageName = isNaN(+epId)
      ? `${epId}_Logo.jpg`
      : `${String(epId).padStart(2, "0")}_Logo.jpg`;

    return {
      title: row["Title"] || "ללא כותרת",
      subtitle: row["Subtitle"] || "",
      url: `/?ep=${epId}`,
      logoUrl: `images/episodes/${imageName}`,
      links: [
        {
          name: "Spotify",
          url: row["SpotifyLink"],
          logo: "images/logo_spotify_onlight.svg",
        },
        {
          name: "Apple",
          url: row["AppleLink"],
          logo: "images/applepodcastlogo.svg",
        },
        {
          name: "YouTube",
          url: row["YoutubeLink"],
          logo: "images/logo_youtube_onlight.svg",
        },
      ],
    };
  };

  const renderRecommended = (episodes) => {
    const slideContents = episodes.map((ep) => {
      return `
      <div class="flex justify-center items-center h-full">
        <a href="${ep.url}" class="bg-white text-black rounded-xl shadow-xl p-4 max-w-[270px] w-full flex flex-col items-center hover:bg-gray-100 transition justify-between" style="min-height:210px">
          <img src="${ep.logoUrl}" alt="Logo" class="w-20 h-20 rounded-full mb-2 object-cover shadow" />
          <div class="text-center flex flex-col justify-center flex-1">
            <p class="font-bold text-base">${ep.title}</p>
            <p class="text-sm text-gray-600">${ep.subtitle}</p>
          </div>
        </a>
      </div>
    `;
    });
    injectCarouselSlides(slideContents);
  };

  const renderEpisode = (episode) => {
    titleEl.textContent = episode.title;
    subtitleEl.textContent = episode.subtitle;
    logoImageEl.setAttribute("src", episode.logoUrl);

    [...servicesListLinksEls].forEach((linkEl, index) => {
      const currLink = episode.links[index];
      linkEl.setAttribute("href", currLink.url);
      const imgEl = linkEl.querySelector("img");
      imgEl.setAttribute("src", currLink.logo);
    });
  };

  const pickRandomEpisodes = (all, count = 3) => {
    const shuffled = all.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(formatDataForRender);
  };

  const init = async () => {
    const epId = getEpisodeFromUrl();
    const jsonData = await fetchJsonData();
    if (jsonData) {
      const row = jsonData.find((entry) => String(entry["מספר פרק"]) === epId);
      if (row) {
        renderEpisode(formatDataForRender(row));
      }

      //Render Recommendations:

      const selectedRandomEpisodes = pickRandomEpisodes(jsonData);
      renderRecommended(selectedRandomEpisodes);

      let interval = setInterval(() => nextSlide(), 5000);
      const carouselEl = document.querySelector(".carousel");
      carouselEl.addEventListener("mouseenter", () => {
        clearInterval(interval);
      });
      carouselEl.addEventListener("mouseleave", () => {
        interval = setInterval(() => nextSlide(), 5000);
      });

      loaderEl.classList.add("hidden");
      contentEl.classList.remove("hidden");
    }
  };

  init();
});
