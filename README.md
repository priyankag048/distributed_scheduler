# distributed_scheduler

![read me](image/read.jpg)

### Distributed Scheduler is an application to help the end users to schedule jobs and maintain the job frequency. The jobs will be evenly distributed among several processes based on job frequency, cached memory and CPU utilization.
### The processes are highly available, that is if one of the process crashes or exits, the jobs assigned to that process will automatically failover to other processes.

## Database : POSTgresSQL version 9.6
#### Table job : `scheduled jobs, database structure available in lib/db/job.sql`

## In-memory data structure store : REDIS version 4.0.1
#### Redis is used to create sets and hashes for processes, publish/subscribe job channel, currently processing jobs and scheduled jobs.




