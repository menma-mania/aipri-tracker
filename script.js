// 移行済みかどうか確認
if (!localStorage.getItem("aipriProgress")) {
  try {
    // 旧形式のprogress-〇〇をすべて取得
    const oldKeys = Object.keys(localStorage).filter(k => k.startsWith("progress-"));
    const newProgress = {};

    // 現在のdata.jsonのデータを取得
    fetch("data.json")
      .then(res => res.json())
      .then(songs => {
        // タイトル→IDのマップを作成
        const titleToIdMap = {};
        songs.forEach(song => {
          if (song.id && song.title) {
            titleToIdMap[song.title] = song.id;
          }
        });

        // 各旧キーを新形式に変換
        oldKeys.forEach(oldKey => {
          const title = oldKey.replace("progress-", "");
          const id = titleToIdMap[title];
          if (id) {
            try {
              const value = JSON.parse(localStorage.getItem(oldKey));
              newProgress[id] = value;
            } catch (e) {
              console.warn(Failed to parse localStorage for ${oldKey});
            }
          }
        });

        // 保存
        localStorage.setItem("aipriProgress", JSON.stringify(newProgress));

        // ✅ 旧形式のデータは不要なら削除（任意・コメント解除で有効化）
        // oldKeys.forEach(key => localStorage.removeItem(key));

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
      const saved = JSON.parse(localStorage.getItem("aipriProgress")) || {};
      const songList = document.getElementById("song-list");

      songs.forEach((song) => {
        const card = document.createElement("div");
        card.className = "song-card";
        card.dataset.id = song.id;

        const jacket = document.createElement("div");
        jacket.className = "song-jacket";
        jacket.style.backgroundImage = url(${song.jacket});

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
            img.src = active ? images/${progressImages[type]} : "images/empty.png";

            img.addEventListener("click", (e) => {
              e.stopPropagation();
              song.states[type] = !song.states[type];
              img.src = song.states[type] ? images/${progressImages[type]} : "images/empty.png";
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
