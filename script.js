
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('song-list');
    data.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card';

      const oni = song.result['おにむず'];
      if (oni === 'PFC') card.classList.add('rainbow');
      else if (oni === 'FC') card.classList.add('gold');

      card.innerHTML = `
        <div class="song-jacket" style="background-image: url('${song.jacket}')"></div>
        <div class="song-info">
          <strong>${song.title}</strong><br>
          1まい：${song.result['1まい'] || '❌'}<br>
          2まい：${song.result['2まい'] || '❌'}<br>
          おにむず：${song.result['おにむず'] || '❌'}
        </div>
      `;
      list.appendChild(card);
    });
  });
