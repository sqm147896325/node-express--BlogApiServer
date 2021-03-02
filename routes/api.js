const express = require('express');
const router = express.Router();

// 导入功能对象
const user = require('./api/user');
const blog = require('./api/blog');

// 访问api
router.get('/', (req, res) => {
  res.send('GET request to the api page')
})

// 用户api
router.use('/user',user);
// 文章api
router.use('/blog',blog);

module.exports = router;