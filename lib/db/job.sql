CREATE TABLE job(
    id int primary key,
    description text,
    frequency int not null,
    startdate text not null,
    script text not null,
    pid int references process(id)
)
