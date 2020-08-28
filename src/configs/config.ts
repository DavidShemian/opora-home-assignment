import defaultConfigs from "./default-config.json";
import { pick } from "lodash";

/**
 * Environment configurations will override default configurations
 */

const loadConfig = () => {
  const configuration = pick(
    { ...defaultConfigs, ...process.env },
    Object.keys(defaultConfigs)
  );

  return configuration;
};

export const config = loadConfig();
