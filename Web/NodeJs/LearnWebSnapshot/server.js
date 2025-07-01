const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const port = 3000;

// 启用CORS
app.use(cors());

// 静态文件服务
app.use(express.static('public'));

// 网页代理API
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }
  
  try {
    // 发送请求获取网页内容
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    // 处理HTML内容
    let html = response.data;
    
    // 使用cheerio解析HTML
    const $ = cheerio.load(html);
    
    // 移除X-Frame-Options相关的meta标签
    $('meta[http-equiv="X-Frame-Options"]').remove();
    $('meta[http-equiv="frame-ancestors"]').remove();
    
    // 修改相对URL为绝对URL
    $('link[href]').each((index, element) => {
      const href = $(element).attr('href');
      if (href && !href.startsWith('http')) {
        $(element).attr('href', new URL(href, url).toString());
      }
    });
    
    $('script[src]').each((index, element) => {
      const src = $(element).attr('src');
      if (src && !src.startsWith('http')) {
        $(element).attr('src', new URL(src, url).toString());
      }
    });
    
    $('img[src]').each((index, element) => {
      const src = $(element).attr('src');
      if (src && !src.startsWith('http')) {
        $(element).attr('src', new URL(src, url).toString());
      }
    });
    
    // 移除JavaScript中的window.onload和类似事件，避免冲突
    $('script').each((index, element) => {
      const script = $(element).html();
      if (script) {
        // 简单处理，移除window.onload
        const modifiedScript = script
          .replace(/window\.onload\s*=\s*function\s*\([^)]*\)\s*{/g, '// window.onload = function() {')
          .replace(/\$(document)\.ready\s*\([^)]*\)\s*{/g, '// $(document).ready(function() {');
        
        $(element).html(modifiedScript);
      }
    });
    
    // 添加脚本以捕获页面高度
    $('body').append(`
      <script>
        // 监听消息，发送页面高度
        window.addEventListener('message', function(event) {
          if (event.data.type === 'captureFullPage') {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'pageHeight', height }, '*');
          }
        });
        
        // 页面加载完成后通知父窗口
        window.addEventListener('load', function() {
          const height = document.body.scrollHeight;
          window.parent.postMessage({ type: 'pageHeight', height }, '*');
        });
      </script>
    `);
    
    // 返回处理后的HTML
    res.send(html);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(`无法获取网页内容: ${error.message}`);
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});