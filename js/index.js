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
    const imageName =
      +epId === NaN
        ? `${epId}_Logo.jpg`
        : `${String(epId).padStart(2, "0")}_Logo.jpg`;

    return {
      title: row["Title"] || "ללא כותרת",
      subtitle: row["Subtitle"] || "",
      url: `/?ep=${epId}`,
      logoUrl: `/images/episodes/${imageName}`,
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
    const container = document.querySelector("#recommended-carousel .relative");
    const indicators = document.getElementById("recommended-indicators");

    episodes.forEach((ep, index) => {
      // Item
      const item = document.createElement("div");
      item.className = `absolute inset-0 transition-opacity duration-700 ease-in-out ${
        index === 0 ? "" : "hidden"
      }`;
      item.setAttribute("data-carousel-item", index === 0 ? "active" : "");

      item.innerHTML = `
      <div class="flex justify-center items-center h-full">
        <a href="${ep.url}" class="bg-white text-black rounded-xl shadow-xl p-4 max-w-[270px] w-full flex flex-col items-center hover:bg-gray-100 transition">
          <img src="${ep.logoUrl}" alt="Logo" class="w-20 h-20 rounded-full mb-2 object-cover shadow" />
          <div class="text-center">
            <p class="font-bold text-base">${ep.title}</p>
            <p class="text-sm text-gray-600">${ep.subtitle}</p>
          </div>
        </a>
      </div>
    `;
      container.appendChild(item);

      // Indicator
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `w-3 h-3 rounded-full ${
        index === 0 ? "bg-white" : "bg-white/50"
      }`;
      dot.setAttribute("aria-label", `Slide ${index + 1}`);
      dot.setAttribute("data-carousel-slide-to", index);
      indicators.appendChild(dot);
    });

    setupCarouselAutoScroll(container);
  };

  function setupCarouselAutoScroll(container) {
    const items = container.querySelectorAll("[data-carousel-item]");
    let index = 0;

    setInterval(() => {
      items.forEach((el, i) => {
        if (i === index) {
          el.classList.remove("hidden");
          el.setAttribute("data-carousel-item", "active");
        } else {
          el.classList.add("hidden");
          el.removeAttribute("data-carousel-item");
        }
      });

      index = (index + 1) % items.length;
    }, 5000); // every 5 seconds
  }

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
      loaderEl.classList.add("hidden");
      contentEl.classList.remove("hidden");
    }
  };

  init();
});
