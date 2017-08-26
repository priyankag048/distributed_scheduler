CREATE TABLE process(
    id int primary key,
    port int not null,
    rss int,
    cpu_utilization int,
    rss_to_cpu int,
    assigned_jobs_count int
)


COMMENT ON COLUMN process.id IS "Unique process id created when the process starts: Primary Key";
COMMENT ON COLUMN process.port IS "Port on which the process runs";
COMMENT ON COLUMN process.rss IS "Memory Usage : RSS( Resident Set Size ) by the process";
COMMENT ON COLUMN process.cpu_utilization IS "CPU utilization of the process";
COMMENT ON COLUMN process.rss_to_cpu IS "RSS to CPU utilization ratio, used to determine how many jobs can be assigned";
COMMENT ON COLUMN process.assigned_jobs_count IS "Number of jobs assigned to the process";