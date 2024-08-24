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

future:
split into monorepo:

- e2e into its own pkg
- prisma/db into its own pkg and export it to api
- frontend app
