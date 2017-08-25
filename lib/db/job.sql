CREATE TABLE job(
    id serial not null,
    name char(10) not null,                 
    description text,                   
    frequency int not null,
    startdate text not null,
    script text not null,
    pid int references process(id),
    primary key(id, name)
)


COMMENT ON COLUMN job.id IS "Unique job id created sequentially : Primary Key";
COMMENT ON COLUMN job.name IS "Unique job name given by the end user : Primary Key";
COMMENT ON COLUMN job.description IS "Description of the job created by the end user";
COMMENT ON COLUMN job.frequency IS "Frequency of job: the rate at which the job will run";
COMMENT ON COLUMN job.startdate IS "Time Stamp when the job is created";
COMMENT ON COLUMN job.script IS "The script that is supposed to run when the job is scheduled";
COMMENT ON COLUMN job.pid IS "The process to which the job will be assigned. This column has a foreign key relation with column process.id";

