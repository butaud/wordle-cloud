import { app, init } from "./app";

(async () => {
  await init();

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
