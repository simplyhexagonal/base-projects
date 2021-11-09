var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/.pnpm/dotenv@10.0.0/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@10.0.0/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var os2 = require("os");
    function log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    var NEWLINE = "\n";
    var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
    var RE_NEWLINES = /\\n/g;
    var NEWLINES_MATCH = /\r\n|\n|\r/;
    function parse(src, options) {
      const debug = Boolean(options && options.debug);
      const obj = {};
      src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
        const keyValueArr = line.match(RE_INI_KEY_VAL);
        if (keyValueArr != null) {
          const key = keyValueArr[1];
          let val = keyValueArr[2] || "";
          const end = val.length - 1;
          const isDoubleQuoted = val[0] === '"' && val[end] === '"';
          const isSingleQuoted = val[0] === "'" && val[end] === "'";
          if (isSingleQuoted || isDoubleQuoted) {
            val = val.substring(1, end);
            if (isDoubleQuoted) {
              val = val.replace(RE_NEWLINES, NEWLINE);
            }
          } else {
            val = val.trim();
          }
          obj[key] = val;
        } else if (debug) {
          log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
        }
      });
      return obj;
    }
    function resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os2.homedir(), envPath.slice(1)) : envPath;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let debug = false;
      if (options) {
        if (options.path != null) {
          dotenvPath = resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
        if (options.debug != null) {
          debug = true;
        }
      }
      try {
        const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug });
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else if (debug) {
            log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
          }
        });
        return { parsed };
      } catch (e) {
        return { error: e };
      }
    }
    module2.exports.config = config;
    module2.exports.parse = parse;
  }
});

// src/index.ts
var import_os = __toModule(require("os"));
var import_fastify = __toModule(require("fastify"));
var import_mono_context3 = __toModule(require("@simplyhexagonal/mono-context"));
var import_logger = __toModule(require("@simplyhexagonal/logger"));

// src/routes/health-check/index.ts
var import_mono_context = __toModule(require("@simplyhexagonal/mono-context"));
var healthCheckRoute = {
  method: "GET",
  url: "/health-check",
  handler: async () => ({
    appVersion: import_mono_context.default.getStateValue("version"),
    status: "ok",
    uptime: process.uptime()
  })
};
var health_check_default = healthCheckRoute;

// src/routes/secret/handlers.ts
var import_mono_context2 = __toModule(require("@simplyhexagonal/mono-context"));
var updateSecret = async ({ body }) => {
  const logger2 = import_mono_context2.default.getStateValue("logger");
  const prevSecret = import_mono_context2.default.getStateValue("secret");
  logger2.debug("Received body:", body);
  import_mono_context2.default.setState({
    secret: (body || {}).secret || null
  });
  return {
    prevSecret,
    secret: import_mono_context2.default.getStateValue("secret")
  };
};
var readSecret = async ({}, reply) => {
  return {
    secret: import_mono_context2.default.getStateValue("secret")
  };
};

// src/routes/secret/index.ts
var updateSecretRoute = {
  method: "POST",
  url: "/secret",
  handler: updateSecret,
  constraints: {
    mustAuth: true
  }
};
var readSecretRoute = {
  method: "GET",
  url: "/secret",
  handler: readSecret,
  constraints: {
    mustAuth: true
  }
};
var secret_default = [
  updateSecretRoute,
  readSecretRoute
];

// src/routes/index.ts
var routes_default = [
  health_check_default,
  ...secret_default
].reduce((a, b) => {
  const {
    constraints,
    ...definiton
  } = b;
  if ((constraints || {}).mustAuth) {
    a.authRoutes.push(definiton);
  } else {
    a.openRoutes.push(definiton);
  }
  return a;
}, {
  openRoutes: [],
  authRoutes: []
});

// package.json
var name = "@simplyhexagonal/api";
var version = "0.0.1";

// src/index.ts
require_main().config();
var {
  PORT,
  HOST,
  CLUSTER_REGION,
  CLUSTER_TYPE,
  SECRET_TOKEN
} = process.env;
var logger = new import_logger.default({
  appIdentifiers: {
    region: CLUSTER_REGION,
    clusterType: CLUSTER_TYPE,
    hostname: import_os.default.hostname(),
    app: name
  }
});
import_mono_context3.default.setState({
  logger,
  version,
  secret: null
});
var main = async () => {
  const server = (0, import_fastify.default)({
    logger: false
  });
  await server.register((instance, opts, next) => {
    instance.addHook("preValidation", ({ headers }, reply, done) => {
      if (headers.authorization !== `Bearer ${SECRET_TOKEN}`) {
        reply.status(401).send("");
      }
      done();
    });
    routes_default.authRoutes.forEach((r) => instance.route(r));
    next();
  });
  await server.register((instance, opts, next) => {
    routes_default.openRoutes.forEach((r) => instance.route(r));
    next();
  });
  const serverAddress = await server.listen(PORT || "5000", HOST);
  logger.all(`Server successfully started on: ${serverAddress}`);
};
main();
//# sourceMappingURL=server.js.map
