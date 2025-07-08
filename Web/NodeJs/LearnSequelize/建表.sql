DROP TABLE IF EXISTS `department`;
CREATE TABLE department (
    id int(10) unsigned NOT null AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) COMMENT '部门名称',
    location varchar(50) COMMENT '部门位置'
)ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='部门表';

INSERT INTO `department` VALUES(1,'Produce','BeiJing');
INSERT INTO `department` VALUES(2,'Finance','ShangHai');
INSERT INTO `department` VALUES(3,'IT','ShenZhen');

DROP TABLE IF EXISTS `employee`;
CREATE TABLE employee (
    id int(10) unsigned NOT null AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) COMMENT '姓名',
    department_id int(10) unsigned COMMENT '部门编号'
)ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='员工表';

INSERT INTO `employee` VALUES(1,'jack',1);
INSERT INTO `employee` VALUES(2,'lucy',1);
INSERT INTO `employee` VALUES(3,'frank',2);
INSERT INTO `employee` VALUES(4,'Hank',3);