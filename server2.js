"use strict";
const { memoizedGetTokenReport } = require("./getToken.js");
const machine = require("./Teller_Cash_Management_Cash_Collections_Receive_Cash_FSM.js");
const authorize = require("./Keycloakauthorize");
var session = require("express-session");
var Keycloak = require("keycloak-connect");
const log = require("./log.js");
const logger = log("server.js");
const { interpret } = require("xstate");
var bodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const { assign } = require("xstate/lib/actionTypes");
const { networkInterfaces } = require("os");
const app = express();
const port = process.env.PORT;
var keys = {};
const fetch = (url, options) =>
    import("node-fetch").then(({ default: fetch }) => fetch(url, options));
var httpReq = {};
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var n = 0;
var r = 0;
// var memoryStore = new session.MemoryStore();
// let kcConfig = {
//     realm: "ahbs-realm",
//     "bearer-only": true,
//     "auth-server-url": process.env.AUTH_TOKEN_SERVER + "/auth/",
//     "ssl-required": "external",
//     resource: "fsm-credit-card-inquiry",
//     "confidential-port": 0,
// };
// let keycloak = new Keycloak({ store: memoryStore }, kcConfig);
app.use(
    session({
        secret: "some secret",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);
// app.use(keycloak.middleware());
function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
app.post(
    "/fsm/cm_cc_rc",
    // keycloak.protect(),
    // authorize("TELLER", "CMCCRCH"),
    (req, res) => {
        httpReq = req.body;
        var key = parseJwt(req.headers.authorization).sid;
        if (key) {
            if (key in keys) {
                keys[key].res = res;
                service = keys[key].service;
                var jsonObj = httpReq.data;
                logger.debug(`Data from Front-End = ${JSON.stringify(jsonObj)} `);
                keys[key].service = service;
                logger.debug(`Front-End transition = ${httpReq.transition}`);
                service.send({
                    ...jsonObj,
                    type: httpReq.transition,
                });
                logger.debug(`State: ${service._state.value}`);
            } else {
                keys[key] = {
                    service: null,
                    res: res,
                    sendingFunction: (ctx, myKey) => {
                        var resp = keys[myKey].res;
                        if (!resp.headersSent) {
                            r++;
                            resp.json(ctx);
                        }
                    },
                };
                const newMachine = machine.withConfig({
                    actions: {
                        sendCtx: (context, event) => {
                            keys[key].sendingFunction(context, key);
                        },
                    },
                    services: {
                        sendFile: async (context, event, { data }) => {
                            let apiURL = data.url;
                            let fetchOptions = {
                                method: "GET",
                                headers: { "Content-Type": "application/json" },
                                mode: "cors",
                            };
                            if (data.secret) {
                                fetchOptions.headers.Authorization = `Bearer ${await memoizedGetTokenReport(
                                    data.secret
                                )}`;
                            }
                            if (data.method) {
                                fetchOptions.method = data.method;
                            }
                            if (data.headers) {
                                fetchOptions.headers = data.headers;
                            }
                            if (data.params) {
                                fetchOptions.body = JSON.stringify(data.params);
                            }
                            const url = new URL(apiURL);
                            const queryParams = new URLSearchParams(url.search);
                            if (
                                fetchOptions.method == "POST" ||
                                fetchOptions.method == "PUT"
                            ) {
                                logger.info(
                                    `${fetchOptions.method} ${url.hostname}${url.pathname}`
                                );
                                logger.debug(`Parameters: ${fetchOptions.body}`);
                            } else {
                                logger.info(
                                    `${fetchOptions.method} ${url.hostname}${url.pathname}`
                                );
                                logger.debug(`Parameters: ${queryParams}`);
                            }
                            return await fetch(apiURL, fetchOptions)
                                .then((response) => {
                                    logger.info(`Status: ${response.status}`);
                                    if (response.status != 200) {
                                        throw new Error(
                                            "Service Error: " +
                                            response.status +
                                            " " +
                                            response.statusText
                                        );
                                    } else {
                                        return response.body;
                                    }
                                })
                                .then((body) => {
                                    body.pipe(keys[key].res);
                                })
                                .catch((e) => {
                                    logger.error(`Error: ${e.message}`);
                                    return Promise.reject(e.message);
                                });
                        },
                    },
                });
                var service = interpret(newMachine);
                service.start();
                keys[key].service = service;

                service.onTransition((state) => {
                    logger.debug(`NextEvents: = ${state.nextEvents}`);
                });
                var jsonObj = httpReq.data;
                logger.debug(`Data from Front-End = ${JSON.stringify(jsonObj)} `);

                service.send({
                    ...jsonObj,
                    type: httpReq.transition,
                });
                service.onStop(() => {
                    logger.info(
                        `---------------------!!! Machine STOPPED !!!---------------------`
                    );
                    delete keys[key];
                });
            }
        } else {
            logger.info("Request Token key is missing!");
            return res.json("Request Token key is missing!");
        }
    }
);

app.listen(port, () => {
    logger.info(`Example app listening at ${process.env.FSM}:${port}`);
});
