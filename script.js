
document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((songs) => {
      const songList = document.getElementById("song-list");

      songs.forEach((song, index) => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.dataset.index = index;

        const jacket = document.createElement("div");
        jacket.className = "song-jacket";
        jacket.style.backgroundImage = `url(images/${song.image})`;

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

        const states = song.states || {};
        const icons = [];

        progressTypes.forEach((type) => {
          const img = document.createElement("img");
          img.className = "progress-icon";
          img.dataset.type = type;

          // おにむず未実装の場合、該当画像は無効（非表示）
          if (!song.hasOni && (type === "fulloni" || type === "perfectoni")) {
            img.style.visibility = "hidden";
            img.src = "images/empty.png";
          } else {
            const hasProgress = states[type];
            img.src = hasProgress ? `images/${progressImages[type]}` : "images/empty.png";
            img.addEventListener("click", (e) => {
              e.stopPropagation();
              const currentState = img.src.includes(progressImages[type]);
              states[type] = !currentState;
              img.src = states[type] ? `images/${progressImages[type]}` : "images/empty.png";
              updateRainbow(card, states, song.hasOni);
              song.states = states;
              localStorage.setItem("aipriProgress", JSON.stringify(songs));
            });
          }

          icons.push(img);
          progressBox.appendChild(img);
        });

        const info = document.createElement("div");
        info.className = "song-info";
        info.innerText = song.shortTitle;

        card.appendChild(jacket);
        card.appendChild(progressBox);
        card.appendChild(info);

        if (shouldBeRainbow(states, song.hasOni)) {
          card.classList.add("rainbow");
        }

        songList.appendChild(card);
      });

      function shouldBeRainbow(states, hasOni) {
        const required = hasOni
          ? ["full1", "perfect1", "full2", "perfect2", "fulloni", "perfectoni"]
          : ["full1", "perfect1", "full2", "perfect2"];
        return required.every((type) => states[type]);
      }

      function updateRainbow(card, states, hasOni) {
        if (shouldBeRainbow(states, hasOni)) {
          card.classList.add("rainbow");
        } else {
          card.classList.remove("rainbow");
        }
      }

      // ローカルストレージから進捗復元
      const saved = JSON.parse(localStorage.getItem("aipriProgress"));
      if (saved) {
        saved.forEach((savedSong, i) => {
          if (songs[i]) songs[i].states = savedSong.states || {};
        });
      }
    });
});
