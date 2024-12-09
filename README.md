How to run:
- Clone the project & `cd todolist`
- `npm install`
- Create `.env` file & follow the `.env-example` file
- Create new database
- Apply the Prisma migrations `npx prisma migrate deploy`
 If migrations haven’t been created yet, run `npx prisma migrate dev --name init`
- To run the web applicatioin run this command `npm run dev`
