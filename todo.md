TODO:

pets table:

- sex
- microchipped
- vaccinated
- price - default = 0 meaning free

pets:

- add csv upload update endpoint for pets use parseCsv for this
- search endpoint for pets by name

users:

- add GET /users endpoint
- add GET /users/:id endpoint
- add UPDATE /users/:id endpoint

- Export openAPI spec to typescript

- messages table:

  - senderId
  - receiverId
  - petId
  - message

* add ability for users to send messages to each other. Will do this via pub sub and store messages in db. see https://dev.to/franciscomendes10866/using-redis-pub-sub-with-node-js-13k3 for example

future:
split into monorepo:

- e2e into its own pkg
- prisma/db into its own pkg and export it to api
- frontend app
