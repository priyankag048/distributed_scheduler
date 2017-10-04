# Distributed Scheduler

![read me](image/read.jpg)

Overview
---
Distributed Scheduler is an application to help the end users to schedule jobs and maintain the job frequency. The jobs will be evenly distributed among several processes based on job frequency, cached memory and CPU utilization.
The processes are highly available, that is if one of the process crashes or exits, the jobs assigned to that process will automatically failover to other processes.

![Architecture](image/architecture.jpg)


Prerequisite
---
1. Node.js >= 8.x.x and Npm >= 5.3.0
2. postgreSQL 9.6
3. Redis 4.0.1








