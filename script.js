
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('song-list');
    data.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card rainbow'; // 常に虹枠を適用

      card.innerHTML = `
        <div class="song-jacket" style="background-image: url('${song.jacket}')"></div>
        <div class="song-info">
          <strong>${song.shortTitle}</strong>
        </div>
      `;
      list.appendChild(card);
    });
  });
