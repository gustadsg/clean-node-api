/* eslint-disable no-console */
import "dotenv/config";
import { MongoHelper } from "../infra/db/mongodb/helpers/mogo-helper";
import env from "./config/env";

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.port, () =>
      console.log(`🔥 server running on port ${env.port}`)
    );
  })
  .catch((error) => {
    console.error(error);
  });
