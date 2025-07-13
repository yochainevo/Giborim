"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const FILE_PATH = "./data/exported_data.json";
  const recommendedEl = document.getElementById("recommended-episodes");

  const fetchJsonData = async () => {
    try {
      const response = await fetch(FILE_PATH);
      if (!response.ok) throw new Error("שגיאה בטעינת JSON");
      return await response.json();
    } catch (error) {
      console.error(error);
      recommendedEl.innerHTML = "<p class='text-red-400'>בעיה בטעינת הפרקים.</p>";
      return null;
    }
  };

  const formatDataForRender = (episodeRow) => {
    const epNumber = episodeRow["מספר פרק"];
    const imageName = epNumber === "Bonus"
      ? "Bonus_Logo.jpg"
      : `${String(epNumber).padStart(2, "0")}_Logo.jpg`;

    return {
      title: episodeRow["Title"] || "ללא כותרת",
      subtitle: episodeRow["Subtitle"] || "",
      url: `episode.html?ep=${epNumber}`,
      logoUrl: `./images/episodes/${imageName}`,
    };
  };

  const renderRecommended = (episodes) => {
    episodes.forEach((ep) => {
      recommendedEl.innerHTML += `
        <a href="${ep.url}" class="bg-white text-black rounded-lg shadow p-3 w-full max-w-[270px] flex flex-col items-center hover:bg-gray-200 transition">
          <img src="${ep.logoUrl}" alt="Logo" class="w-20 h-20 rounded-full mb-2 object-cover" />
          <div class="text-center">
            <p class="font-bold">${ep.title}</p>
            <p class="text-sm text-gray-700">${ep.subtitle}</p>
          </div>
        </a>
      `;
    });
  };

  const pickRandomEpisodes = (all, count = 3) => {
    const shuffled = all.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(formatDataForRender);
  };

  const init = async () => {
    const jsonData = await fetchJsonData();
    if (jsonData) {
      const selected = pickRandomEpisodes(jsonData);
      renderRecommended(selected);
    }
  };

  init();
});
