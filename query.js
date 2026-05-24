/* eslint-disable @typescript-eslint/no-require-imports, no-console */
require("dotenv").config();
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
client
  .connect()
  .then(() =>
    client.query(
      'SELECT controls.code FROM controls JOIN assessment_items ON controls.id = assessment_items."controlId" WHERE assessment_items."assessmentId"=\'cmpa11dxh00fym4httu9uik5i\' OFFSET 2 LIMIT 2',
    ),
  )
  .then((res) => console.log(res.rows))
  .catch(console.error)
  .finally(() => client.end());
