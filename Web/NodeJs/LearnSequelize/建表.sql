CREATE TABLE employee (
    id int(10) unsigned NOT null AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) COMMENT '姓名',
    department_id int(10) unsigned COMMENT '部门编号'
)ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='员工表';