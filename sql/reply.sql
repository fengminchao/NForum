CREATE TABLE reply (
  'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
  'pid' int(10) DEFAULT NULL,
  'name' char(20) DEFAULT NULL,
  'avator' text,
  'content' text,
  'time' bigint(20) DEFAULT NULL,
  'mail' char(20) NOT NULL DEFAULT '',
  PRIMARY KEY ('id')
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;