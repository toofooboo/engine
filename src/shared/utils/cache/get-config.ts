import { getConfiguration } from "../../db/configuration/get-configuration";
import type { ParsedConfig } from "../../schemas/config";

let _config: ParsedConfig | null = null;

export const getConfig = async (
  retrieveFromCache = true,
): Promise<ParsedConfig> => {
  if (!_config || !retrieveFromCache) {
    _config = await getConfiguration();
  }

  return _config;
};

export const invalidateConfig = () => {
  _config = null;
};