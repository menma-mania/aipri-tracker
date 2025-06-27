
const states_all = ['none', 'silver', 'gold', 'rainbow'];
const states_no_oni = ['none', 'silver', 'gold'];

function getNextState(current, allowedStates) {
  const index = allowedStates.indexOf(current);
  return allowedStates[(index + 1) % allowedStates.length];
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
      const supportsRainbow = !!song.hasOni;  // true if hasOni: true
      const allowedStates = supportsRainbow ? states_all : states_no_oni;

      let state = loadState(song.title);
      if (!allowedStates.includes(state)) {
        state = 'none'; // 無効な状態だった場合リセット
        saveState(song.title, state);
      }

      const card = document.createElement('div');
      card.className = 'song-card';
      if (state !== 'none') card.classList.add(state);
      card.dataset.title = song.title;
      card.dataset.state = state;
      card.dataset.hasOni = supportsRainbow;

      card.innerHTML = `
        <div class="song-jacket" style="background-image: url('${song.jacket}')"></div>
        <div class="song-info"><strong>${song.shortTitle}</strong></div>
      `;

      card.addEventListener('click', () => {
        const current = card.dataset.state;
        const hasOni = card.dataset.hasOni === 'true';
        const allowed = hasOni ? states_all : states_no_oni;
        const next = getNextState(current, allowed);
        if (current !== 'none') card.classList.remove(current);
        if (next !== 'none') card.classList.add(next);
        card.dataset.state = next;
        saveState(song.title, next);
      });

      list.appendChild(card);
    });
  });
