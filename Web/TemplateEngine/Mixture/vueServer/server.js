const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3002;

// Vue Vite 开发服务器地址
const VITE_SERVER = 'http://localhost:3001';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ==========================================
// 首页 - EJS 服务端渲染（零白屏）
// ==========================================
app.get('/', (req, res) => {
  const data = {
    title: 'Vue3 Demo',
    currentPage: 'home',
    features: [
      { icon: '⚡', name: '首屏 EJS 服务端渲染', desc: 'HTML 直接返回，即时可见' },
      { icon: '🎨', name: 'Vue 3 交互增强', desc: '其他页面 CSR 动态渲染' },
      { icon: '🚦', name: '路由混合架构', desc: '后端路由 + 前端路由协同' },
      { icon: '📦', name: '同构体验', desc: '导航栏样式统一，无缝切换' },
      { icon: '⚖️', name: '按需 SSR', desc: '仅首页 SSR，其他保持 CSR' },
      { icon: '🔧', name: '代理转发', desc: 'EJS 未命中 → 透明代理至 Vite' },
    ],
    renderTime: new Date().toISOString(),
  };

  res.render('home', data);
});

// ==========================================
// 404 页面 - EJS 服务端渲染
// ==========================================
app.get('/404', (req, res) => {
  const notFoundPath = req.query.path || '/未知路径';
  const timestamp = new Date().toLocaleString('zh-CN');
  const suggestions = getSuggestions(notFoundPath);

  res.render('404', { notFoundPath, timestamp, suggestions });
});

function getSuggestions(requestPath) {
  const lower = requestPath.toLowerCase();
  if (lower.includes('about')) {
    return [
      { text: '前往关于页面', url: '/about' },
      { text: '返回首页', url: '/' },
    ];
  }
  return [
    { text: '返回首页', url: '/' },
    { text: '访问关于页面', url: '/about' },
  ];
}

// ==========================================
// 其余所有请求 → 代理到 Vite 开发服务器
// （/about、静态资源、Vite HMR WebSocket 等）
// ==========================================
app.use(
  '/',
  createProxyMiddleware({
    target: VITE_SERVER,
    changeOrigin: true,
    // 不代理 EJS 已处理的路径
    pathFilter: (pathname) => {
      return pathname !== '/' && pathname !== '/404';
    },
  })
);

// ==========================================
// 启动服务器
// ==========================================
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  EJS + Vue 混合渲染服务器已启动');
  console.log('========================================');
  console.log(`  主入口:     http://localhost:${PORT}/        ← EJS SSR（零白屏）`);
  console.log(`  关于页:     http://localhost:${PORT}/about   ← 代理 → Vite → Vue`);
  console.log(`  其他页面:   任意路径 → 代理 → Vite → Vue SPA`);
  console.log(`  Vite 开发服务器: ${VITE_SERVER}`);
  console.log('========================================\n');
});
