import { Eureka } from "eureka-js-client";

// Example configuration
const client = new Eureka({
  // Application instance information
  instance: {
    app: "user-service", // Should be a unique identifier for your service
    hostName: "user-service", // The hostname of your service
    ipAddr: "user-service",
    port: {
      $: 5001, // The port your service is running on
      "@enabled": "true",
    },
    vipAddress: "user-service", // A virtual IP address for your service
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    // Eureka server host and port
    host: "host.docker.internal",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

export default client;
