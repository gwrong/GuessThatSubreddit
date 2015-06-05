use reddit;

drop table if exists comments;

create table if not exists comments (id varchar(255) unique, subreddit varchar(255), created bigint, body text);
