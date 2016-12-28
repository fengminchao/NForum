CREATE TABLE user (
  'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
  'mail' char(20) DEFAULT NULL,
  'pwd' char(30) DEFAULT NULL,
  'name' char(30) DEFAULT NULL,
  'gender' char(4) DEFAULT NULL,
  'age' int(4) DEFAULT NULL,
  'avator' text,
  'token' char(80) DEFAULT NULL,
  PRIMARY KEY ('id')
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;