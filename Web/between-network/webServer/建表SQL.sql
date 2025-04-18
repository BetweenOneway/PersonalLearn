SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for z_user
-- ----------------------------
DROP TABLE IF EXISTS `z_user`;
CREATE TABLE `z_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `head_pic` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `level` int(11) NOT NULL DEFAULT 0 COMMENT '用户等级【0：普通用户，1：Vip用户】',
  `time` datetime NOT NULL COMMENT '注册时间',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态【0：锁定，1：正常】',
  `sex` int(1) DEFAULT 1 COMMENT '0 女 1 男',
  `birthday` date COMMENT '出生日期',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE COMMENT '唯一不重复'
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of z_user
-- ----------------------------
-- 31315105654@qq.com  eVF4TJ 1737895547@qq.com xdavd8
INSERT INTO `z_user` VALUES (8, '315105654@qq.com', 'd3424c2d0c11c6b6b13a5a620f8eb41b', '爱思考的飞飞', 'https://cdn.vuetifyjs.com/images/john.jpg', 0, '2023-05-05 15:03:33', 1,1,'');
INSERT INTO `z_user` VALUES (15, '1737895547@qq.com', 'a0098d3228a3a4f94ccda7670a8f2c4d', '斯科拉', 'https://avatars.githubusercontent.com/u/58872083?v=4', 0, '2023-06-12 17:15:22', 1,1,'');

-- ----------------------------
-- Table structure for z_note
-- ----------------------------
DROP TABLE IF EXISTS `z_note`;
CREATE TABLE `z_note`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '笔记整个内容',
  `time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  `noteboo_id` int(11) NOT NULL COMMENT '所属笔记本编号',
  `top` int(11) NULL DEFAULT 0 COMMENT '置顶（1：置顶，0：不置顶）',
  `status` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态【0：被删除，1：正常/私有 2:公开】',
  `type` int(11) NULL DEFAULT 1 COMMENT '类型',
  UNIQUE INDEX `z_note_pk`(`id`) USING BTREE,
  INDEX `z_note_z_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `z_note_z_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '文章表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of z_note
-- ----------------------------
INSERT INTO `z_note` VALUES (22, 'Vue3 知识点整理', '<p>我是第一次学习这个课程的！</p><figure class=\"image image_resized image-style-align-left\" style=\"width:28.14%;\"><img src=\"http://127.0.0.1:18081/zhike-notes/image/1685852281107.png\"><figcaption>随便插入的图像</figcaption></figure><p>&nbsp;</p><figure class=\"table\" style=\"height:56px;width:123px;\"><table><tbody><tr><td>你好</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure><p>&nbsp;</p>', '<h1>Vue3 知识点整理</h1><p>我是第一次学习这个课程的！</p><figure class=\"image image_resized image-style-align-left\" style=\"width:28.14%;\"><img src=\"http://127.0.0.1:18081/zhike-notes/image/1685852281107.png\"><figcaption>随便插入的图像</figcaption></figure><p>&nbsp;</p><figure class=\"table\" style=\"height:56px;width:123px;\"><table><tbody><tr><td>你好</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure><p>&nbsp;</p>', '2023-06-04 12:17:28', '2023-06-05 16:38:07', 8, 0, '1', 1);
INSERT INTO `z_note` VALUES (23, '不知道的理由', '<ul class=\"todo-list\"><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\" checked=\"checked\"><span class=\"todo-list__label__description\"><strong>&nbsp;</strong>今天打卡失败</span></label></li><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\"><span class=\"todo-list__label__description\">未来买个房子</span></label></li><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\" checked=\"checked\"><span class=\"todo-list__label__description\">不知道什<strong>么</strong><i><strong>时</strong></i><strong>候结</strong><i>束车贷</i></span></label></li></ul>', '<h1>不知道的理由</h1><ul class=\"todo-list\"><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\" checked=\"checked\"><span class=\"todo-list__label__description\"><strong>&nbsp;</strong>今天打卡失败</span></label></li><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\"><span class=\"todo-list__label__description\">未来买个房子</span></label></li><li><label class=\"todo-list__label\"><input type=\"checkbox\" disabled=\"disabled\" checked=\"checked\"><span class=\"todo-list__label__description\">不知道什<strong>么</strong><i><strong>时</strong></i><strong>候结</strong><i>束车贷</i></span></label></li></ul>', '2023-06-04 19:28:09', '2023-06-05 16:38:33', 8, 0, '1', 1);
INSERT INTO `z_note` VALUES (25, 'JavaWeb 考试知识点2', '<ol><li><code>JDBC</code>进行执行修改、删除、新增语句得到的结果的返回值是<code>int</code>，执行查询语句得到的结果为<code>ResultSet</code></li><li>在默认情况下，<code>Session</code>的会话超时时间是<code>30</code>分钟</li><li><code>Maven</code>工程引入<code>Mysql</code>数据库驱动为<span style=\"font-size:16px;\"><code>mysql-connector-java</code></span></li><li><span style=\"font-size:16px;\"><code>axios</code>请求得到的<code>responsetype</code>的格式默认为<code>json</code></span></li><li><code>JDBC</code>加载<code>mysql</code>数据库驱动时，可采用<code>Class.forname(\"com.mysql.jdbc.Driver\")</code>方式</li><li>自定义<code>Servlet</code>类，需要<span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-size:16px;\">在</span><code>Maven</code><span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-size:16px;\">中引入</span><span style=\"font-size:16px;\"><code>javax.servlet-api</code></span></li><li><span style=\"font-size:16px;\"><code>vue</code>中选项含义</span></li><li><span style=\"font-size:16px;\"><code>watch</code>：侦听器</span></li><li><span style=\"font-size:16px;\"><code>data</code>：响应式数据</span></li><li><span style=\"font-size:16px;\"><code>methods</code>：函数</span></li><li><span style=\"font-size:16px;\"><code>components</code>：注册私有组件</span></li><li><span style=\"font-size:16px;\"><code>provide</code>：为后代组件提供数据</span></li><li><span style=\"font-size:16px;\"><code>inject</code>：注入祖先组件提供的数据</span></li></ol>', '<h1>JavaWeb 考试知识点2</h1><ol><li><code>JDBC</code>进行执行修改、删除、新增语句得到的结果的返回值是<code>int</code>，执行查询语句得到的结果为<code>ResultSet</code></li><li>在默认情况下，<code>Session</code>的会话超时时间是<code>30</code>分钟</li><li><code>Maven</code>工程引入<code>Mysql</code>数据库驱动为<span style=\"font-size:16px;\"><code>mysql-connector-java</code></span></li><li><span style=\"font-size:16px;\"><code>axios</code>请求得到的<code>responsetype</code>的格式默认为<code>json</code></span></li><li><code>JDBC</code>加载<code>mysql</code>数据库驱动时，可采用<code>Class.forname(\"com.mysql.jdbc.Driver\")</code>方式</li><li>自定义<code>Servlet</code>类，需要<span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-size:16px;\">在</span><code>Maven</code><span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-size:16px;\">中引入</span><span style=\"font-size:16px;\"><code>javax.servlet-api</code></span></li><li><span style=\"font-size:16px;\"><code>vue</code>中选项含义</span></li><li><span style=\"font-size:16px;\"><code>watch</code>：侦听器</span></li><li><span style=\"font-size:16px;\"><code>data</code>：响应式数据</span></li><li><span style=\"font-size:16px;\"><code>methods</code>：函数</span></li><li><span style=\"font-size:16px;\"><code>components</code>：注册私有组件</span></li><li><span style=\"font-size:16px;\"><code>provide</code>：为后代组件提供数据</span></li><li><span style=\"font-size:16px;\"><code>inject</code>：注入祖先组件提供的数据</span></li></ol>', '2023-06-04 22:21:28', '2023-06-05 16:34:16', 8, 0, '1', 1);
INSERT INTO `z_note` VALUES (26, '环保农场', '<h2 style=\"margin-left:0;\">1：项目准备</h2><p style=\"margin-left:0;\">项<strong>目使用</strong>以下开发工<i>具和服</i><strong>务：</strong><span style=\"color:#1890FF;\"><code>IDEA</code></span>、<span style=\"color:#1890FF;\"><code>MySQL</code></span>、<span style=\"color:#1890FF;\"><code>JDK</code></span>、<span style=\"color:#1890FF;\"><code>Maven</code></span>，<span style=\"color:#1890FF;\"><code>Tomcat</code></span>，<span style=\"color:#1890FF;\"><code>JQuery</code></span>，使用的技术包含：<span style=\"color:#1890FF;\"><code>Servlet</code></span>、<span style=\"color:#1890FF;\"><code>JDBC</code></span>、<span style=\"color:#1890FF;\"><code>JSP</code></span>、<span style=\"color:#1890FF;\"><code>Ajax</code></span></p><figure class=\"image image-style-align-left\"><img src=\"http://127.0.0.1:18081/zhike-notes/image/1685889044611.png\"></figure>', '<h1>环保农场</h1><h2 style=\"margin-left:0;\">1：项目准备</h2><p style=\"margin-left:0;\">项<strong>目使用</strong>以下开发工<i>具和服</i><strong>务：</strong><span style=\"color:#1890FF;\"><code>IDEA</code></span>、<span style=\"color:#1890FF;\"><code>MySQL</code></span>、<span style=\"color:#1890FF;\"><code>JDK</code></span>、<span style=\"color:#1890FF;\"><code>Maven</code></span>，<span style=\"color:#1890FF;\"><code>Tomcat</code></span>，<span style=\"color:#1890FF;\"><code>JQuery</code></span>，使用的技术包含：<span style=\"color:#1890FF;\"><code>Servlet</code></span>、<span style=\"color:#1890FF;\"><code>JDBC</code></span>、<span style=\"color:#1890FF;\"><code>JSP</code></span>、<span style=\"color:#1890FF;\"><code>Ajax</code></span></p><figure class=\"image image-style-align-left\"><img src=\"http://127.0.0.1:18081/zhike-notes/image/1685889044611.png\"></figure>', '2023-06-04 22:25:46', '2023-06-07 22:47:05', 8, 1, '1', 1);
INSERT INTO `z_note` VALUES (27, '做个云笔记App', '<p>今天<strong>第一次</strong>做项目</p>', '<h1>做个云笔记App</h1><p>今天<strong>第一次</strong>做项目</p>', '2023-06-05 16:34:25', '2023-06-05 16:38:33', 8, 0, '1', 1);

-- ----------------------------
-- Table structure for notebook
-- ----------------------------
DROP TABLE IF EXISTS `notebook`;
CREATE TABLE `notebook`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '笔记本编号',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '笔记本名称',
  `time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  `level` int(11) NOT NULL DEFAULT 1 COMMENT '笔记本层级',
  `index_in_notebook` int(11)  COMMENT '笔记本在当前级别内的排序序号',
  `parent_id` int(11) NOT NULL DEFAULT 0 COMMENT '上一级笔记本编号',
  `status` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态【0：被删除，1：正常/私有】',
  UNIQUE INDEX `z_note_pk`(`id`) USING BTREE,
  INDEX `notebook_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `notebook_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '笔记本表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for z_memo
-- ----------------------------
DROP TABLE IF EXISTS `z_memo`;
CREATE TABLE `z_memo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '内容',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  `finished` int(11) NOT NULL DEFAULT 0 COMMENT '是否已完成【0:未完成、1:已完成】',
  `time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最近修改的时间',
  `top` int(11) NULL DEFAULT 0 COMMENT '置顶(0:不置顶,1:置顶）',
  `status` int(11) NULL DEFAULT 1 COMMENT '状态【0:删除、-1:彻底删除、1:正常】',
  `type` int(11) NULL DEFAULT 2,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `z_thing_z_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `z_thing_z_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '小记' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for z_oper_log
-- ----------------------------
DROP TABLE IF EXISTS `z_oper_log`;
CREATE TABLE `z_oper_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL COMMENT '时间',
  `event` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '事件',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  `o_id` int(11) NULL DEFAULT NULL COMMENT '操作对象编号',
  `type` int(11) NULL DEFAULT NULL COMMENT '对象类型 1:笔记 2:文件夹',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `z_oper_log_z_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `z_oper_log_z_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '笔记日志表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of z_oper_log
-- ----------------------------

-- ----------------------------
-- Table structure for z_user_log
-- ----------------------------
DROP TABLE IF EXISTS `z_user_log`;
CREATE TABLE `z_user_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `time` datetime NOT NULL COMMENT '时间',
  `event` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '事件',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `z_user_log_z_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `z_user_log_z_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户日志表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of z_user_log
-- ----------------------------

-- ----------------------------
-- Table structure for dumpster
-- ----------------------------
DROP TABLE IF EXISTS `dumpster`;
CREATE TABLE `dumpster`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `u_id` int(11) NOT NULL COMMENT '用户编号',
  `object_id` int(11) NOT NULL COMMENT '目标编号',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '目标名称',
  `type` int(11) NOT NULL COMMENT '类型 1-文件 2-文件夹',
  `related` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '关联内容',
  `time` datetime NOT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dumpster_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `dumpster_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '回收站' ROW_FORMAT = COMPACT;

-- ----------------------------
-- View Structure for file_dumpster
-- ----------------------------
CREATE VIEW file_dumpster AS
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM z_memo WHERE `status`=0
UNION ALL
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM z_note WHERE `status`=0;

CREATE VIEW recent_access_file AS
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM z_memo WHERE `status`=1
UNION ALL
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM z_note WHERE `STATUS` = 1;

SET FOREIGN_KEY_CHECKS = 1;
