import Queue from "bee-queue";
import { JobData } from "./types";
import moment from "moment";

const queue_id = "test_q";

const redisConfig = {
  host: "localhost",
  port: 6379,
};

const q = new Queue(queue_id, {
  redis: redisConfig,
  activateDelayedJobs: true,
});

q.createJob<JobData>({
  msg: "First Job, Deleted after been procees, you will not recieve this on the worker",
  createdAt: new Date(),
})
  .timeout(100000)
  .delayUntil(moment(new Date()).add(3.5, "seconds").toDate())
  .retries(3)
  .save()
  .then((v) => {
    console.log("Job enqueued", v.data);
    setTimeout(() => {
      v.remove()
        .then((v) => console.log("Removed", v.id, v.data))
        .catch((e) => console.log("Failed to remove", v));
    }, 2000);
  })
  .catch((e) => console.log(e));

/**
 * Watchout, this function will still remove the job
 * eventhough it's not been proceesed
 */
q.createJob<JobData>({
  msg: "Second Job, Processed, you will recieve this on the worker",
  createdAt: new Date(),
})
  .timeout(100000)
  .delayUntil(moment(new Date()).add(3.5, "seconds").toDate())
  .retries(3)
  .save()
  .then((v) => {
    console.log("Job enqueued", v.data);
    setTimeout(() => {
      v.remove()
        .then((v) => console.log("Removed", v.id, v.data))
        .catch((e) => console.log("Failed to remove", v));
    }, 5000);
  })
  .catch((e) => console.log(e));
