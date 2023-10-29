# 学子商城 mintui版本

USE xz;
CREATE TABLE xz_login(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uname VARCHAR(50),
    upwd VARCHAR(32)
);

# 添加测试数据
INSERT INTO xz_login VALUES(NULL,"tom",md5('123'));

INSERT INTO xz_login VALUES(NULL,'jerry',md5('123'));