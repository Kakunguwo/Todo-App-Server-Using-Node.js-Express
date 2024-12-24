import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Use "openapi" for OpenAPI version
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for Todo App",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files with Swagger annotations
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
