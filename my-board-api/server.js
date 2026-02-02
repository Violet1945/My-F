const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ข้อมูลกระทู้ (สมมติว่าเป็น Database ชั่วคราว)
let posts = [
  { id: 1, title: 'กระทู้แรกของบอร์ด', author: 'Admin' }
];

// API สำหรับดึงกระทู้ทั้งหมด
app.get('/posts', (req, res) => {
  res.json(posts);
});

// API สำหรับสร้างกระทู้ใหม่
app.post('/posts', (req, res) => {
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    author: req.body.author
  };
  posts.unshift(newPost); // เอาไปไว้บนสุด
  res.json(newPost);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));