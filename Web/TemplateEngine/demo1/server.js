const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// ==========================================
// 1. 设置模板引擎为 EJS
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 解析请求体（表单提交用）
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 2. 模拟数据
// ==========================================
const users = [
  { id: 1, name: '张三', age: 28, role: 'admin', active: true },
  { id: 2, name: '李四', age: 24, role: 'editor', active: true },
  { id: 3, name: '王五', age: 32, role: 'viewer', active: false },
  { id: 4, name: '赵六', age: 21, role: 'editor', active: true },
  { id: 5, name: '孙七', age: 35, role: 'admin', active: false },
];

const articles = [
  { title: 'EJS 入门指南', author: '张三', date: '2026-07-10', tags: ['Node.js', 'EJS', '前端'] },
  { title: 'Express 框架详解', author: '李四', date: '2026-07-12', tags: ['Express', '后端'] },
  { title: '模板引擎对比', author: '王五', date: '2026-07-15', tags: ['模板引擎', '前端', '性能'] },
];

// ==========================================
// 3. 路由 - 首页：演示变量输出
// ==========================================
app.get('/', (req, res) => {
  res.render('index', {
    title: 'EJS 模板引擎示例',
    subtitle: 'Node.js 服务端渲染演示',
    description: 'EJS (Embedded JavaScript) 是一个简洁的 JavaScript 模板引擎，<br/>在 HTML 中嵌入 JS 代码，实现动态页面渲染。',
    features: [
      { icon: '📝', title: '变量插值', desc: '使用 &lt;%= %&gt; 输出转义后的变量，使用 &lt;%- %&gt; 输出原始 HTML' },
      { icon: '🔄', title: '条件与循环', desc: '使用 &lt;% %&gt; 编写任意 JavaScript 逻辑' },
      { icon: '🧩', title: '模板复用', desc: '使用 &lt;%- include() %&gt; 引入公共组件，避免重复代码' },
      { icon: '⚡', title: '高性能', desc: '编译为 JS 函数，渲染速度极快' },
    ],
    articleCount: articles.length,
    userCount: users.length,
    showWelcome: true,
  });
});

// ==========================================
// 4. 路由 - 用户列表：演示循环
// ==========================================
app.get('/users', (req, res) => {
  const roleFilter = req.query.role || 'all';
  let filteredUsers = users;

  if (roleFilter !== 'all') {
    filteredUsers = users.filter(u => u.role === roleFilter);
  }

  res.render('users', {
    title: '用户列表 - 循环与条件渲染',
    users: filteredUsers,
    totalUsers: users.length,
    roleFilter,
  });
});

// ==========================================
// 5. 路由 - 文章：演示复杂数据渲染
// ==========================================
app.get('/articles', (req, res) => {
  res.render('articles', {
    title: '文章列表 - 复杂数据结构',
    articles,
  });
});

// ==========================================
// 6. 路由 - 表单：演示表单与回显
// ==========================================
app.get('/form', (req, res) => {
  res.render('form', {
    title: '用户注册 - 表单渲染',
    errors: null,
    formData: {},
  });
});

app.post('/form', (req, res) => {
  const { username, email, age, role } = req.body;
  const errors = {};

  if (!username || username.trim().length < 2) {
    errors.username = '用户名至少需要 2 个字符';
  }
  if (!email || !email.includes('@')) {
    errors.email = '请输入有效的邮箱地址';
  }
  if (!age || isNaN(age) || Number(age) < 18) {
    errors.age = '年龄必须 ≥ 18 岁';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('form', {
      title: '用户注册 - 表单渲染',
      errors,
      formData: req.body,
    });
  }

  res.render('form-success', {
    title: '注册成功',
    user: req.body,
  });
});

// ==========================================
// 7. 路由 - 关于页：演示模板嵌套
// ==========================================
app.get('/about', (req, res) => {
  const techStack = [
    { name: 'Node.js', version: 'v20+', url: 'https://nodejs.org' },
    { name: 'Express', version: 'v4.21', url: 'https://expressjs.com' },
    { name: 'EJS', version: 'v3.1', url: 'https://ejs.co' },
  ];

  res.render('about', {
    title: '关于本项目',
    techStack,
    serverTime: new Date().toLocaleString('zh-CN'),
  });
});

// ==========================================
// 8. 邮件模板演示 - 使用 ejs.renderFile() 独立渲染
// ==========================================
app.get('/email-demo', (req, res) => {
  const username = req.query.username || '张三';
  const company = req.query.company || '示例科技有限公司';
  const role = req.query.role || '普通用户';
  const email = req.query.email || 'zhangsan@example.com';

  const data = {
    username,
    companyName: company,
    year: new Date().getFullYear(),
    activateUrl: `https://www.example.com/activate/${Date.now()}`,
    accountInfo: [
      { label: '用户名', value: username },
      { label: '邮箱', value: email },
      { label: '角色', value: role },
      { label: '注册时间', value: new Date().toLocaleString('zh-CN') },
    ],
  };

  const templatePath = path.join(__dirname, 'views', 'emails', 'welcome.ejs');

  // ejs.renderFile 读取模板文件并渲染为字符串
  ejs.renderFile(templatePath, data, (err, emailHtml) => {
    if (err) {
      return res.status(500).send('模板渲染失败: ' + err.message);
    }

    // 实际场景中这里可以发送邮件:
    // transporter.sendMail({ html: emailHtml });

    res.render('email-demo', {
      title: '邮件模板渲染演示',
      emailHtml,
      emailSource: emailHtml.substring(0, 800),
      username, company, role, email,
    });
  });
});

// ==========================================
// 9. 启动服务器
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
  console.log('  试试以下页面：');
  console.log(`  - 首页:          http://localhost:${PORT}/`);
  console.log(`  - 用户列表:      http://localhost:${PORT}/users`);
  console.log(`  - 文章列表:      http://localhost:${PORT}/articles`);
  console.log(`  - 用户注册:      http://localhost:${PORT}/form`);
  console.log(`  - 邮件模板:      http://localhost:${PORT}/email-demo`);
  console.log(`  - 关于项目:      http://localhost:${PORT}/about`);
});
