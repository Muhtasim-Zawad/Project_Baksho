import { Eureka } from "eureka-js-client";

const eurekaHost = process.env.EUREKA_HOST || "localhost";
const eurekaPort = process.env.EUREKA_PORT || 8761;
const port = process.env.PORT || 1234;

const client = new Eureka({
  instance: {
    app: "payment-service",
    hostName: "payment-service",
    ipAddr: "payment-service",
    port: {
      $: port,
      "@enabled": "true",
    },
    vipAddress: "payment-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: "/eureka/apps/",
  },
});

export default client;
