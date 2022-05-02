import ENVCONFIG from "./env/env.js"

import * as dev from "./env/dev.js";
import * as qa from "./env/qa.js";
import * as prod from "./env/prod.js";

export const CONFIGS =   (ENVCONFIG.env == "dev") ? dev : (ENVCONFIG.env == "qa")? qa : prod;