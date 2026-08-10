-- ============================================
-- CloudNote 数据库初始化脚本
-- 容器首次启动时自动执行
--
-- 变更说明：user.id / note.id 等主键由数据库自增 INT 改为
-- 业务层（雪花算法）生成的 BIGINT，避免对外 URL 暴露连续自增 ID。
-- 因此所有表去掉 AUTO_INCREMENT，外键/引用字段统一改为 BIGINT。
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint NOT NULL COMMENT '编号（雪花ID）',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `head_pic` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `level` int NOT NULL DEFAULT 0 COMMENT '用户等级【0：普通用户，1：Vip用户】',
  `time` datetime NOT NULL COMMENT '注册时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态【0：锁定，1：正常】',
  `sex` int(1) DEFAULT 1 COMMENT '0 女 1 男',
  `birthday` date NOT NULL DEFAULT '1949-10-01' COMMENT '出生日期',
  `role` int NOT NULL DEFAULT 0 COMMENT '用户角色【0：普通用户，1：网站管理员】',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE COMMENT '唯一不重复'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for note
-- ----------------------------
CREATE TABLE IF NOT EXISTS `note` (
  `id` bigint NOT NULL COMMENT '编号（雪花ID）',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '笔记整个内容',
  `time` datetime NOT NULL COMMENT '创建时间',
  `create_time` datetime NOT NULL COMMENT '笔记初次创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `notebook_id` bigint NOT NULL COMMENT '所属笔记本编号（雪花ID）',
  `top` int NULL DEFAULT 0 COMMENT '置顶（1：置顶，0：不置顶）',
  `status` int NULL DEFAULT 1 COMMENT '状态【0：被删除，1：正常/私有 2:公开】',
  `type` int NULL DEFAULT 2 COMMENT '类型',
  UNIQUE INDEX `note_pk`(`id`) USING BTREE,
  INDEX `note_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `note_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '文章表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for notebook
-- ----------------------------
CREATE TABLE IF NOT EXISTS `notebook` (
  `id` bigint NOT NULL COMMENT '笔记本编号（雪花ID）',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '笔记本名称',
  `time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `level` int NOT NULL DEFAULT 1 COMMENT '笔记本层级',
  `index_in_notebook` int  COMMENT '笔记本在当前级别内的排序序号',
  `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '上一级笔记本编号（雪花ID）',
  `status` int NULL DEFAULT NULL COMMENT '状态【0：被删除，1：正常/私有】',
  UNIQUE INDEX `note_pk`(`id`) USING BTREE,
  INDEX `notebook_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `notebook_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '笔记本表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for memo
-- ----------------------------
CREATE TABLE IF NOT EXISTS `memo` (
  `id` bigint NOT NULL COMMENT '编号（雪花ID）',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '内容',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `finished` int NOT NULL DEFAULT 0 COMMENT '是否已完成【0:未完成、1:已完成】',
  `time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最近修改的时间',
  `top` int NULL DEFAULT 0 COMMENT '置顶(0:不置顶,1:置顶）',
  `status` int NULL DEFAULT 1 COMMENT '状态【0:删除、-1:彻底删除、1:正常】',
  `type` int NULL DEFAULT 2,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `memo_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `memo_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '小记' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for oper_log
-- ----------------------------
CREATE TABLE IF NOT EXISTS `oper_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `time` datetime NOT NULL COMMENT '时间',
  `event` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '事件',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `o_id` bigint NULL DEFAULT NULL COMMENT '操作对象编号（雪花ID）',
  `type` int NULL DEFAULT NULL COMMENT '对象类型 1:笔记 2:文件夹',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `oper_log_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `oper_log_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '笔记日志表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for user_log
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `time` datetime NOT NULL COMMENT '时间',
  `event` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '事件',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_log_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `user_log_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户日志表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for dumpster
-- ----------------------------
CREATE TABLE IF NOT EXISTS `dumpster` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `object_id` bigint NOT NULL COMMENT '目标编号（雪花ID）',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '目标名称',
  `type` int NOT NULL COMMENT '类型 1-文件 2-文件夹',
  `related` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '关联内容',
  `time` datetime NOT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dumpster_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `dumpster_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '回收站' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for favorite
-- ----------------------------
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '用户编号（雪花ID）',
  `object_id` bigint NOT NULL COMMENT '收藏对象编号（雪花ID）',
  `type` int NOT NULL DEFAULT 1 COMMENT '对象类型【1：笔记，2：便签】',
  `time` datetime NOT NULL COMMENT '收藏时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态【0：已取消，1：正常】',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_object_type`(`u_id`, `object_id`, `type`) USING BTREE COMMENT '同一用户同一对象同一类型只能收藏一次',
  INDEX `idx_favorite_user_time`(`u_id`, `time`) USING BTREE,
  INDEX `idx_favorite_object`(`object_id`, `type`) USING BTREE,
  CONSTRAINT `favorite_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '收藏表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
CREATE TABLE IF NOT EXISTS `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '谁评论了（雪花ID）',
  `object_id` bigint NOT NULL COMMENT '对什么做了评论（雪花ID）',
  `type` int NOT NULL DEFAULT 1 COMMENT '对象类型【1：笔记，2：便签】',
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `time` datetime NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_comment_object_time`(`object_id`, `type`, `time`) USING BTREE COMMENT '按对象查询评论',
  INDEX `idx_comment_user_time`(`u_id`, `time`) USING BTREE COMMENT '按用户查询评论',
  CONSTRAINT `comment_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '评论表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for blacklist
-- ----------------------------
CREATE TABLE IF NOT EXISTS `blacklist` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '拉黑发起人用户编号（雪花ID）',
  `target_u_id` bigint NOT NULL COMMENT '被拉黑用户编号（雪花ID）',
  `reason` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '拉黑原因',
  `time` datetime NOT NULL COMMENT '拉黑时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态【0：已解除，1：正常】',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_blacklist_user_target`(`u_id`, `target_u_id`) USING BTREE COMMENT '同一用户不能重复拉黑同一人',
  INDEX `idx_blacklist_target`(`target_u_id`) USING BTREE COMMENT '查询某用户被谁拉黑',
  CONSTRAINT `blacklist_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blacklist_target_user_id_fk` FOREIGN KEY (`target_u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '黑名单表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for `like`
-- ----------------------------
CREATE TABLE IF NOT EXISTS `like` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '点赞用户编号（雪花ID）',
  `object_id` bigint NOT NULL COMMENT '点赞对象编号（雪花ID）',
  `type` int NOT NULL DEFAULT 1 COMMENT '对象类型【1：笔记，2：便签】',
  `time` datetime NOT NULL COMMENT '点赞时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态【0：已取消，1：正常】',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_like_user_object_type`(`u_id`, `object_id`, `type`) USING BTREE COMMENT '同一用户同一对象同一类型只能点赞一次',
  INDEX `idx_like_object`(`object_id`, `type`) USING BTREE,
  INDEX `idx_like_user_time`(`u_id`, `time`) USING BTREE,
  CONSTRAINT `like_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '点赞表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for subscribe
-- ----------------------------
CREATE TABLE IF NOT EXISTS `subscribe` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '编号（自增）',
  `u_id` bigint NOT NULL COMMENT '订阅者用户编号（雪花ID）',
  `object_id` bigint NOT NULL COMMENT '被关注作者(用户)编号（雪花ID）',
  `type` int NOT NULL DEFAULT 1 COMMENT '订阅类型【1：关注作者】',
  `time` datetime NOT NULL COMMENT '订阅时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '状态【0：已取消，1：订阅中】',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_subscribe_user_object_type`(`u_id`, `object_id`, `type`) USING BTREE COMMENT '同一用户不能重复关注同一作者',
  INDEX `idx_subscribe_object`(`object_id`, `type`) USING BTREE COMMENT '查询某作者的粉丝数',
  INDEX `idx_subscribe_user_time`(`u_id`, `time`) USING BTREE,
  CONSTRAINT `subscribe_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subscribe_object_user_id_fk` FOREIGN KEY (`object_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '订阅（关注）表' ROW_FORMAT = COMPACT;

-- ----------------------------
-- Views
-- ----------------------------
CREATE OR REPLACE VIEW file_dumpster AS
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM memo WHERE `status`=0
UNION ALL
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM note WHERE `status`=0;

CREATE OR REPLACE VIEW recent_access_file AS
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM memo WHERE `status`=1
UNION ALL
SELECT `id`,`title`,`update_time`,`type`,`u_id` FROM note WHERE `STATUS` = 1;

-- ----------------------------
-- Test user data
-- 注意：id 改为雪花ID，需与后续业务生成规则一致；此处示例值仅用于本地初始化
-- 若通过注册接口创建用户，则无需手填 id（由后端 snowflake 生成）
-- ----------------------------
-- 密码为 123456 的 md5 值
INSERT IGNORE INTO `user` (`id`,`email`, `password`, `nickname`, `head_pic`, `level`, `time`, `status`, `sex`, `birthday`, `role`) VALUES (1718348349012345678, 'test@163.com', 'e10adc3949ba59abbe56e057f20f883e', '测试', 'https://cdn.vuetifyjs.com/images/john.jpg', 0, '2023-05-05 15:03:33', 1, 1, '1949-10-01', 0);

-- ----------------------------
-- 创建业务用户，仅授予 CRUD 权限
-- ----------------------------
CREATE USER IF NOT EXISTS 'cloudnote'@'%' IDENTIFIED BY 'cloudnote123';
GRANT SELECT, INSERT, UPDATE, DELETE, ALTER, CREATE, DROP, INDEX, REFERENCES ON cloudnote.* TO 'cloudnote'@'%';
FLUSH PRIVILEGES;

SET FOREIGN_KEY_CHECKS = 1;
