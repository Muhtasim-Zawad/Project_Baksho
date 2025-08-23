const { Eureka } = require("eureka-js-client");

// Example configuration
const client = new Eureka({
  // Application instance information
  instance: {
    app: "user-service", // Should be a unique identifier for your service
    hostName: "localhost", // The hostname of your service
    ipAddr: "127.0.0.1",
    port: {
      $: 3001, // The port your service is running on
      "@enabled": "true",
    },
    vipAddress: "user-service", // A virtual IP address for your service
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "project bakso",
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    // Eureka server host and port
    host: "localhost",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

module.exports = client;
