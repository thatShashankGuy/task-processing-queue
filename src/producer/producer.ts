import logger from '../utils/logger';

interface Playload {
  type: string;
  payload: {
    to: string;
    subject: string;
    body: string;
  };
}

function generate_random_job(): Playload {
  const random_number = Math.floor(Math.random() * 1000);
  return {
    type: 'email',
    payload: {
      to: `user${random_number}@example.com`,
      subject: `Hello ${random_number}`,
      body: `Hi there! Your random number is ${random_number}.`,
    },
  };
}

async function send_job(): Promise<void> {
  const job = generate_random_job();

  try {
    const response = await fetch('http://localhost:8080/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Job created:`, data);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating job:`,
      (error as Error).message,
    );
  }
}

let job_count = 0;
const jobs_limit = 10;

const interval_id = setInterval(async () => {
  if (job_count >= jobs_limit) {
    logger.warn('Sent all jobs, stopping producer.');
    clearInterval(interval_id);
    return;
  }

  job_count++;
  logger.info(`Sending job ${job_count}...`);
  await send_job();
}, 1000);
