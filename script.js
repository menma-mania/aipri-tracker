
const progressKeys = [
  'full1', 'perfect1', 'full2', 'perfect2', 'fulloni', 'perfectoni'
];

function loadProgress(title) {
  const data = localStorage.getItem(`progress-${title}`);
  return data ? JSON.parse(data) : {};
}

function saveProgress(title, progress) {
  localStorage.setItem(`progress-${title}`, JSON.stringify(progress));
}

function isAllCleared(progress, hasOni) {
  const keys = hasOni ? progressKeys : progressKeys.slice(0, 4);
  return keys.every(k => progress[k]);
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('song-list');
    data.forEach(song => {
      const progress = loadProgress(song.title);
      const hasOni = !!song.hasOni;
      const wrapper = document.createElement('div');
      wrapper.className = 'song-card';
      if (isAllCleared(progress, hasOni)) wrapper.classList.add('rainbow');

      wrapper.innerHTML = `
        <div class="song-jacket" style="background-image: url('${song.jacket}')"></div>
        <div class="progress-box">
          ${progressKeys.map(key => {
            if (!hasOni && (key === 'fulloni' || key === 'perfectoni')) return '';
            const src = progress[key] ? `images/${key}.jpeg` : 'images/empty.jpeg';
            return `<img class="progress-icon" data-key="${key}" src="${src}" />`;
          }).join('')}
        </div>
        <div class="song-info"><strong>${song.shortTitle}</strong></div>
      `;

      wrapper.querySelectorAll('.progress-icon').forEach(img => {
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = img.dataset.key;
          progress[key] = !progress[key];
          const src = progress[key] ? `images/${key}.jpeg` : 'images/empty.jpeg';
          img.src = src;
          saveProgress(song.title, progress);
          if (isAllCleared(progress, hasOni)) {
            wrapper.classList.add('rainbow');
          } else {
            wrapper.classList.remove('rainbow');
          }
        });
      });

      list.appendChild(wrapper);
    });
  });
