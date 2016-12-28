CREATE TABLE forum(
  'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
  'pid' int(8) DEFAULT NULL,
  'title' char(88) DEFAULT NULL,
  'name' char(20) DEFAULT NULL,
  'content' text,
  'time' bigint(40) DEFAULT NULL,
  'click' int(8) DEFAULT NULL,
  'reply' int(8) DEFAULT NULL,
  'avator' text,
  'mail' char(20) DEFAULT NULL,
  PRIMARY KEY ('id')
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;