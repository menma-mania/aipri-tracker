// 旧形式からの復元（必要な場合）
if (!localStorage.getItem("aipriProgress")) {
  try {
    const oldKeys = Object.keys(localStorage).filter(k => k.startsWith("progress-"));
    const newProgress = {};

    fetch("data.json")
      .then(res => res.json())
      .then(songs => {
        const titleToIdMap = {};
        songs.forEach(song => {
          if (song.id && song.title) {
            titleToIdMap[song.title] = song.id;
          }
        });

        oldKeys.forEach(oldKey => {
          const title = oldKey.replace("progress-", "");
          const id = titleToIdMap[title];
          if (id) {
            try {
              const value = JSON.parse(localStorage.getItem(oldKey));
              newProgress[id] = value;
            } catch (e) {
              console.warn(`Failed to parse localStorage for ${oldKey}`);
            }
          }
        });

        localStorage.setItem("aipriProgress", JSON.stringify(newProgress));
        console.log("✅ 旧データをaipriProgressに移行完了");
      });
  } catch (e) {
    console.error("❌ データ移行中にエラーが発生しました", e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((songs) => {
      // ✅ 並び順をIDのprefixと番号で並べ替える
      const prefixOrder = ["op", "ed", "solo", "unit", "lets", "mysong", "birthday", "special"];

      songs.sort((a, b) => {
        const [prefixA, numA] = a.id.match(/^([a-z]+)(\d+)$/i).slice(1);
        const [prefixB, numB] = b.id.match(/^([a-z]+)(\d+)$/i).slice(1);
        const indexA = prefixOrder.indexOf(prefixA);
        const indexB = prefixOrder.indexOf(prefixB);
        if (indexA !== indexB) return indexA - indexB;
        return parseInt(numA) - parseInt(numB);
      });

      const saved = JSON.parse(localStorage.getItem("aipriProgress")) || {};
      const songList = document.getElementById("song-list");

      songs.forEach((song) => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.dataset.id = song.id;

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

        song.states = saved[song.id]?.states || {};

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
              img.src = song.states[type] ? `images/${progressImages[type]}` : "images/empty.png`;
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
          saved[song.id] = { states: song.states };
          localStorage.setItem("aipriProgress", JSON.stringify(saved));
        }

        updateRainbow();
      });
    });
});
