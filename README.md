This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Live App

Access the app [here](https://we-are-the-champions-five.vercel.app/)

## Running Locally

Prerequisites: Docker

### Quick Start

`docker compose -f docker-compose.dev.yml up`
App will be accessible at localhost:3000

### Developing

For developing locally, node:16 and above is required

1. Start db on docker: `docker compose -f docker-compose.dev.yml up db`

2. Sync db with prisma schema: `npx prisma db push`

3. Start app: `npm run dev`

App will be accesible at localhost:3000
