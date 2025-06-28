
document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((songs) => {
      const saved = JSON.parse(localStorage.getItem("aipriProgress")) || {};
      const songList = document.getElementById("song-list");

      songs.forEach((song, index) => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.dataset.index = index;

        const jacket = document.createElement("div");
        jacket.className = "song-jacket";
        jacket.style.backgroundImage = `url(${song.jacket})`;

        const progressBox = document.createElement("div");
        progressBox.className = "progress-box";

        const progressTypes = ["full1", "perfect1", "full2", "perfect2", "fulloni", "perfectoni"];
        const progressImages = {
          full1: "full1.png",
          perfect1: "perfect1.png",
          full2: "full2.png",
          perfect2: "perfect2.png",
          fulloni: "fulloni.png",
          perfectoni: "perfectoni.png"
        };

        song.states = saved[index]?.states || {};
        const icons = [];

        progressTypes.forEach((type) => {
          const img = document.createElement("img");
          img.className = "progress-icon";
          img.dataset.type = type;

          const isOniType = (type === "fulloni" || type === "perfectoni");
          const hasOni = song.hasOni;

          if (isOniType && !hasOni) {
            img.style.visibility = "hidden";
            img.src = "images/empty.png";
          } else {
            const active = song.states[type];
            img.src = active ? `images/${progressImages[type]}` : "images/empty.png";

            img.addEventListener("click", (e) => {
              e.stopPropagation();
              song.states[type] = !song.states[type];
              img.src = song.states[type] ? `images/${progressImages[type]}` : "images/empty.png";
              updateRainbow();
              saveProgress();
            });
          }

          progressBox.appendChild(img);
        });

        const info = document.createElement("div");
        info.className = "song-info";
        info.innerText = song.shortTitle;

        card.appendChild(jacket);
        card.appendChild(progressBox);
        card.appendChild(info);
        songList.appendChild(card);

        function updateRainbow() {
          const typesToCheck = song.hasOni
            ? progressTypes
            : progressTypes.slice(0, 4);
          const allChecked = typesToCheck.every((t) => song.states[t]);
          card.classList.toggle("rainbow", allChecked);
        }

        function saveProgress() {
          saved[index] = { states: song.states };
          localStorage.setItem("aipriProgress", JSON.stringify(saved));
        }

        updateRainbow();
      });
    });
});
