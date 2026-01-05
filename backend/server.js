const dotenv = require("dotenv")

dotenv.config();
const app = require("./src/app");
const { connectDB }= require("./src/config/database");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");


const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
})();
