CREATE TABLE process(
    id int primary key,
    port int not null,
    rss int,
    cpu_utilization int,
    rss_to_cpu int,
    assigned_jobs_count int
)
