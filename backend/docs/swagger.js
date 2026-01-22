const swaggerJsdoc = require("swagger-jsdoc");
const auth = require("./auth.swagger");
const company = require("./company.swagger");
const superAdmin = require("./super-admin.swagger");
const user = require("./user.swagger");
const jobs = require("./jobs.swagger");
const jobField = require("./jobField.swagger")

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KarirMu API",
      version: "1.0.0",
      description: "Backend API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication & account activation" },
      { name: "Company", description: "Company & documents" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ...auth.schemas,
        ...company.schemas,
        ...superAdmin.schemas,
        ...user.schemas,
        ...jobs.schemas,
        ...jobField.schemas,
      },
    },
    paths: {
      ...auth.paths,
      ...company.paths,
      ...superAdmin.paths,
      ...user.paths,
      ...jobs.paths,
      ...jobField.paths,
    },
  },
  apis: [], // ⛔ tidak scan routes
});
