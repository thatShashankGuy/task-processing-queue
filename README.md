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
src
├── api
│   ├── controller
│   │   └── job.controller.ts
│   └── routes
│       └── job.routes.ts
├── config
│   ├── db.ts
│   └── schema.ts
├── constants
│   └── jobs.ts
├── migrations
├── server.ts
├── services
│   └── job.service.ts
├── types
│   └── job.types.ts
├── util
│   ├── consumers.ts
│   ├── error.ts
│   └── rabbitmq.ts
└── workers
    └── worker.ts
```

- **src/**: Contains the source code for the project.
  - **api/**: Contains controllers and routes for api.
  - **config/**: Implementation of database using Drizzle ORM.
  - **const/**: Declared Constants.
  - **utils/**: Utility functions and helpers.
  - **services/** : Database Queries and other services.
  - **types/** : Shared Types for static type checking
  - **workers/** : Workers to process job
- **tests/**: To do.
- **README.md**: Project documentation.
- **package.json**: Project dependencies and scripts.

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd task-processing-queue
npm install
```

## Running Tests

To run the tests, use the following command:

```bash
#testing to be done
npm test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
