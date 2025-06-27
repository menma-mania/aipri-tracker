
const states = ['none', 'silver', 'gold', 'rainbow'];

function getNextState(current) {
  const index = states.indexOf(current);
  return states[(index + 1) % states.length];
}

function loadState(title) {
  return localStorage.getItem(`frame-${title}`) || 'none';
}

function saveState(title, state) {
  localStorage.setItem(`frame-${title}`, state);
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('song-list');
    data.forEach(song => {
      const state = loadState(song.title);
      const card = document.createElement('div');
      card.className = 'song-card';
      if (state !== 'none') card.classList.add(state);
      card.dataset.title = song.title;
      card.dataset.state = state;

      card.innerHTML = `
        <div class="song-jacket" style="background-image: url('${song.jacket}')"></div>
        <div class="song-info"><strong>${song.shortTitle}</strong></div>
      `;

      card.addEventListener('click', () => {
        const current = card.dataset.state;
        const next = getNextState(current);
        if (current !== 'none') card.classList.remove(current);
        if (next !== 'none') card.classList.add(next);
        card.dataset.state = next;
        saveState(song.title, next);
      });

      list.appendChild(card);
    });
  });
