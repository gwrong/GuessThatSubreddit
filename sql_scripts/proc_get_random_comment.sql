delimiter $$
use reddit
drop procedure if exists proc_get_random_comment;
create procedure proc_get_random_comment()
BEGIN
    select * from comments ORDER BY RAND() LIMIT 1;
END


$$
