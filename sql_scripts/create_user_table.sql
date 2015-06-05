
use reddit;

drop table if exists users;

create table if not exists users (id integer primary key auto_increment, username varchar(255) unique, password varchar(255));
