# Distributed Scheduler

Overview
---
Distributed Scheduler is an application to help the end users to schedule jobs and maintain the job frequency. The jobs will be evenly distributed among several processes based on job frequency, cached memory and CPU utilization.
The processes are highly available, that is if one of the process crashes or exits, the jobs assigned to that process will automatically failover to other processes.


![Architecture](image/architecture.jpg)



Prerequisites
---
1. Node.js >= 8.x.x and Npm >= 5.3.0
2. postgreSQL 9.6
3. Redis 4.0.1


Database Tables
---

[job](lib/api/db/job.sql)

|id    |name  |description|frequency|startdate|script|repeat|
|------|------|-----------|---------|---------|------|------|



`id          = generated by [sequence](lib/api/db/sequence.sql)`
`name        = name of the job provided by the end user`
`description = description of the job`
`frequency   = frequency in which the job will be scheduled`
`startdate   = timestamp at which the job is created`
`repeat      = true: the job will be rescheduled in an interval of the frequency, `
               `false: the job will run once`








