# Task Processing Queue

## Scope

This project is designed to handle task processing using a queue system. It ensures tasks are processed efficiently and in order, providing a scalable solution for managing background jobs.

## Architecture

The architecture of the project is based on a producer-consumer model:

- **Producer**: Adds tasks to the queue.
- **Queue**: Stores tasks until they are processed.
- **Consumer**: Processes tasks from the queue.

The system is designed to be scalable, allowing multiple producers and consumers to work concurrently.

## Folder Structure

```
task-processing-queue/
.
├── README.md
├── docker-compose.yml
├── drizzle
│   ├── 0000_sloppy_phil_sheldon.sql
│   └── meta
│       ├── 0000_snapshot.json
│       └── _journal.json
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── src
│   ├── api
│   │   ├── controller
│   │   │   └── job.controller.ts
│   │   └── routes
│   │       └── job.routes.ts
│   ├── config
│   │   ├── db.ts
│   │   └── rabbitmq.ts
│   ├── constants
│   │   └── queues.ts
│   ├── consumers
│   │   ├── db.consumer.ts
│   │   └── file.consumer.ts
│   ├── migrations
│   │   └── schema.ts
│   ├── producer
│   │   └── producer.ts
│   ├── server.ts
│   ├── services
│   │   └── job.service.ts
│   ├── types
│   │   └── job.types.ts
│   └── utils
│       └── logger.ts
└── tsconfig.json
```

- **src/**: Contains the source code for the project.
  - **api/**: controllers and routes for api.
  - **config/**: Datbase , RabbitMQ connections
  - **const/**: Queues Declarations,Constants.
  - **utils/**: Utility functions,loggers.
  - **services/** : Database Queries and other services.
  - **types/** : Shared Types for static type checking
  - **producer/** : Job producer
  - **consumer/**: DB consumer, File Consumer
- **tests/**: To do.
- **README.md**: Project documentation.
- **package.json**: Project dependencies and scripts.

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/thatShashankGuy/task-processing-queue
cd task-processing-queue
npm install
```

```
flowchart TD
  subgraph API Layer
    A[Client Request]
    B[Fastify API Controller]
  end

  subgraph Job Publisher
    B -->|Creates Job in DB| C[Job Persistence]
    B -->|Publishes Job Message| D[RabbitMQ Fanout Exchange<br/>(FAN_EXCHANGE)]
  end

  subgraph Fanout Routing
    D -->|Broadcasts copy| E[DB Update Queue<br/>(JOB_DB_UPDATE_QUEUE)]
    D -->|Broadcasts copy| F[CSV Update Queue<br/>(JOB_CSV_UPDATE_QUEUE)]
  end

  subgraph Consumers
    E --> G[DB Consumer<br/>(Processes & Updates DB)]
    F --> H[CSV Consumer<br/>(Processes & Updates CSV File)]
  end

  subgraph Update Notifications
    G --> I[Update Queue<br/>(JOB_QUEUE)]
    H --> I
    I --> J[UI / GET Endpoint<br/>(Job Status Retrieval)]
  end

```

## Running Tests

To run the tests, use the following command:

```bash
#testing to be done
npm test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
