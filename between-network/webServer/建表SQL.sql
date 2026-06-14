SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 删除关联外键
ALTER TABLE `z_note` DROP FOREIGN KEY `z_note_z_user_id_fk`;
ALTER TABLE `notebook` DROP FOREIGN KEY `notebook_user_id_fk`;
ALTER TABLE `z_memo` DROP FOREIGN KEY `z_thing_z_user_id_fk`;
ALTER TABLE `z_oper_log` DROP FOREIGN KEY `z_oper_log_z_user_id_fk`;
ALTER TABLE `z_user_log` DROP FOREIGN KEY `z_user_log_z_user_id_fk`;
ALTER TABLE `dumpster` DROP FOREIGN KEY `dumpster_user_id_fk`;

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
INSERT INTO `z_user` VALUES (0, 'test@163.com', 'e10adc3949ba59abbe56e057f20f883e', '测试', 'https://cdn.vuetifyjs.com/images/john.jpg', 0, '2023-05-05 15:03:33', 1,1,'');

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
  `notebook_id` int(11) NOT NULL COMMENT '所属笔记本编号',
  `top` int(11) NULL DEFAULT 0 COMMENT '置顶（1：置顶，0：不置顶）',
  `status` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态【0：被删除，1：正常/私有 2:公开】',
  `type` int(11) NULL DEFAULT 1 COMMENT '类型',
  UNIQUE INDEX `z_note_pk`(`id`) USING BTREE,
  INDEX `z_note_z_user_id_fk`(`u_id`) USING BTREE,
  CONSTRAINT `z_note_z_user_id_fk` FOREIGN KEY (`u_id`) REFERENCES `z_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '文章表' ROW_FORMAT = COMPACT;

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

DROP VIEW IF EXISTS file_dumpster, recent_access_file;

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
