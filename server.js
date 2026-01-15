const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let shortDramaGenres = [
  {
    id: 'romance',
    name: '都會愛情',
    description: '快節奏都會裡的心動與抉擇。',
    tags: ['甜寵', '成長', '職場']
  },
  {
    id: 'mystery',
    name: '懸疑推理',
    description: '每一集都有新線索，真相翻轉不斷。',
    tags: ['反轉', '高能', '燒腦']
  },
  {
    id: 'fantasy',
    name: '奇幻穿越',
    description: '時空交錯的冒險，命運由你改寫。',
    tags: ['古今', '異能', '命運']
  },
  {
    id: 'family',
    name: '家庭溫情',
    description: '微光暖劇，用細節療癒生活。',
    tags: ['親情', '日常', '治癒']
  }
];

let rankingList = [
  {
    id: 's1',
    title: '晨曦下的約定',
    heat: 98,
    views: 128000,
    trend: 'up'
  },
  {
    id: 's2',
    title: '午夜倒影',
    heat: 95,
    views: 113400,
    trend: 'up'
  },
  {
    id: 's3',
    title: '逆光追蹤',
    heat: 92,
    views: 101300,
    trend: 'steady'
  },
  {
    id: 's4',
    title: '回到夏天的門',
    heat: 89,
    views: 98200,
    trend: 'down'
  },
  {
    id: 's5',
    title: '心動速寫',
    heat: 87,
    views: 94100,
    trend: 'up'
  }
];

let shortDramaVideos = [
  {
    id: 'v1',
    title: '晨曦下的約定｜預告',
    description: '都會戀愛劇的甜蜜開場。',
    genre: 'romance',
    thumbnail: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'v2',
    title: '午夜倒影｜懸疑片段',
    description: '線索交錯的夜晚。',
    genre: 'mystery',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  },
  {
    id: 'v3',
    title: '逆光追蹤｜追逐場面',
    description: '高能節奏的動作瞬間。',
    genre: 'fantasy',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
  }
];

const viewStats = {
  total: 0,
  byDrama: {}
};

app.get('/api/shorts', (req, res) => {
  res.json({ genres: shortDramaGenres });
});

app.get('/api/rankings', (req, res) => {
  res.json({ rankings: rankingList });
});

app.get('/api/videos', (req, res) => {
  res.json({ videos: shortDramaVideos });
});

app.post('/api/views', (req, res) => {
  const { dramaId } = req.body;

  viewStats.total += 1;

  if (dramaId) {
    viewStats.byDrama[dramaId] = (viewStats.byDrama[dramaId] || 0) + 1;
  }

  res.json({ message: 'view recorded', stats: viewStats });
});

app.get('/api/views', (req, res) => {
  res.json(viewStats);
});

app.post('/api/admin/shorts', (req, res) => {
  const { genres, rankings, videos } = req.body;

  if (Array.isArray(genres)) {
    shortDramaGenres = genres;
  }

  if (Array.isArray(rankings)) {
    rankingList = rankings;
  }

  if (Array.isArray(videos)) {
    shortDramaVideos = videos;
  }

  res.json({
    message: 'data updated',
    genres: shortDramaGenres,
    rankings: rankingList,
    videos: shortDramaVideos
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
