export default {
  mongoURL: process.env.MONGO_URL || "mongodb://mongo:27017/clean-node-api",
  port: process.env.PORT || 5050,
  jwtSecret:
    process.env.JWT_SECRET ||
    "qy8gtAk5X/R6GRYYLfQoluCVK0PXQnLq5uXTrJVJSA4/2hqddOBD4g/97UL+8SOFlHxrx9YCJUGLuGFaCQkXtw==",
};
