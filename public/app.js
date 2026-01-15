const genreGrid = document.getElementById('genreGrid');
const rankingRows = document.getElementById('rankingRows');
const totalViews = document.getElementById('totalViews');
const ctaButton = document.getElementById('ctaButton');
const videoList = document.getElementById('videoList');
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');

const formatNumber = (value) => new Intl.NumberFormat('zh-Hant').format(value);

const renderGenres = (genres) => {
  genreGrid.innerHTML = '';

  genres.forEach((genre) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${genre.name}</h3>
      <p>${genre.description}</p>
      <div class="tags">
        ${genre.tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}
      </div>
    `;

    genreGrid.appendChild(card);
  });
};

const trendLabel = (trend) => {
  switch (trend) {
    case 'up':
      return '上升';
    case 'down':
      return '下降';
    default:
      return '持平';
  }
};

const renderRankings = (rankings) => {
  rankingRows.innerHTML = '';

  rankings.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'ranking-row';
    row.innerHTML = `
      <span class="badge">#${index + 1}</span>
      <span>${item.title}</span>
      <span>${item.heat}</span>
      <span>${formatNumber(item.views)}</span>
      <span class="trend ${item.trend}">${trendLabel(item.trend)}</span>
    `;

    rankingRows.appendChild(row);
  });
};

const renderVideos = (videos) => {
  videoList.innerHTML = '';

  videos.forEach((video, index) => {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.innerHTML = `
      <img class="video-thumb" src="${video.thumbnail}" alt="${video.title}" />
      <div class="video-info">
        <h4>${video.title}</h4>
        <p>${video.description}</p>
      </div>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.video-item').forEach((node) => node.classList.remove('active'));
      item.classList.add('active');
      videoPlayer.src = video.videoUrl;
      videoPlayer.poster = video.thumbnail;
      videoTitle.textContent = video.title;
      videoDescription.textContent = video.description;
      videoPlayer.play();
      recordView(video.id);
    });

    if (index === 0) {
      item.classList.add('active');
      videoPlayer.src = video.videoUrl;
      videoPlayer.poster = video.thumbnail;
      videoTitle.textContent = video.title;
      videoDescription.textContent = video.description;
    }

    videoList.appendChild(item);
  });
};

const fetchData = async () => {
  const [genreResponse, rankingResponse, videoResponse, viewResponse] = await Promise.all([
    fetch('/api/shorts'),
    fetch('/api/rankings'),
    fetch('/api/videos'),
    fetch('/api/views')
  ]);

  const genresData = await genreResponse.json();
  const rankingData = await rankingResponse.json();
  const videoData = await videoResponse.json();
  const viewData = await viewResponse.json();

  renderGenres(genresData.genres);
  renderRankings(rankingData.rankings);
  renderVideos(videoData.videos);
  totalViews.textContent = formatNumber(viewData.total || 0);
};

const recordView = async (dramaId) => {
  await fetch('/api/views', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dramaId })
  });

  fetchData();
};

ctaButton.addEventListener('click', () => {
  recordView('homepage');
});

fetchData();
