import Queue from "bee-queue";
import { JobData } from "./types";

const queue_id = "test_q";

const redisConfig = {
  host: "localhost",
  port: 6379,
};

const q = new Queue(queue_id, {
  redis: redisConfig,
  activateDelayedJobs: true,
});

function processQueue(
  job: Queue.Job<JobData>,
  done: Queue.DoneCallback<JobData>
) {
  try {
    console.log(job.id, new Date(), { data: job.data });
    done(null);
  } catch (e) {
    console.log(e);
    done(new Error(`Error ${e}`));
  }
}

q.on("ready", () => {
  console.log("Queue ready");
  q.process<JobData>(10, processQueue);
});
