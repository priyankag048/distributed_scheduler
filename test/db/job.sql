CREATE TABLE job_test(
    id serial not null,
    name char(10) not null,                 
    description text,                   
    frequency int not null,
    startdate text not null,
    script text not null,
    repeat boolean not null,
    primary key(id, name)
)