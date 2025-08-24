import { Eureka } from "eureka-js-client";

// Get Eureka server details from environment variables
const eurekaHost = process.env.EUREKA_HOST || "localhost";
const eurekaPort = process.env.EUREKA_PORT || 8761;

const client = new Eureka({
  // Application instance information
  instance: {
    app: "user-service",
    hostName: "user-service",
    ipAddr: "user-service",
    port: {
      $: 5001,
      "@enabled": "true",
    },
    vipAddress: "user-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    // Eureka server host and port from environment variables
    host: eurekaHost,
    port: eurekaPort,
    servicePath: "/eureka/apps/",
  },
});

export default client;
