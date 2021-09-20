export default {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "jest",
    },
    binary: {
      version: "^4.1.2",
      skipMD5: true,
    },
    autoStart: false,
  },
};
