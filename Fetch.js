

const {
    createMachine,
    interpret,
    assign,
    actions,
    send,
    spawn,
    sendParent,
} = require("xstate");



const Fetch_Machine = createMachine(
    {
        id: "FETCH",
        initial: "Idle",
        context: {
            url: "",
            request: "",
            parameters: "",
            success: "",
            failure: "",
            response: "ok",
            ErrorMessage: "",
            result: {},
            errorFlag: false,
            mBoolean: false,
            errorMessage: "",
        },
        states: {
            Idle: {
                on: {
                    FETCH2: {
                        target: "GetData2",
                        actions: [
                            "recieveUrl",
                            "recieveparameter",
                            "recievenexttransition",
                            "recievefailuretransition",
                        ],
                    },

                },
            },
            GetData2: {
                invoke: {
                    id: "GetData",
                    src: "getData",
                    onDone: {
                        target: "Final",
                        actions: sendParent((context, event) => ({
                            ...context,
                            type: context.success,
                        })),
                    },
                    onError: {
                        target: "Final",
                        actions: sendParent((context, event) => ({
                            ...context,
                            type: context.failure,
                        })),
                    },
                },
            },


            Final: {
                type: "final",
            },
        },
    },
    {
        services: {
            // ---------------------------------
            getData: (context, event) => {
                logger.info(`URL =  ${context.url}`);
                logger.info(`Parameters = ${JSON.stringify(context.parameters)}`);
                logger.info(`Request = ${context.request}`);
                return fetch(context.url, {
                    method: context.request,
                    ...(context.request == "POST" && {
                        body: JSON.stringify(context.parameters),
                    }),

                    headers: {
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                })
                    .then((response) => {
                        if (response.status != 200) {
                            throw new Error(response.status + " " + response.statusText);
                        } else {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        logger.info(`API Responce: ${JSON.stringify(data)}`);
                        // if (data.mBoolean == true) {
                        //     throw new Error(data.errorMessage);
                        // } else if (data[0]) {
                        //     if (data[0].validate == false) {
                        //         throw new Error(data[0].message);
                        //     }
                        // } else if (data.validate == false) {
                        //     // logger.info("Validate", data.message);
                        //     throw new Error(data.message);
                        // }
                        context.result = data;
                    })
                    .catch((e) => {
                        context.ErrorMessage = e.message;
                        assign({
                            ErrorMessage: (e) => e.message,
                        });
                        logger.error(`Service Error = ${context.ErrorMessage}`);
                        return Promise.reject();
                    });
            },

        },
        actions: {
            recieveheader: assign({
                header: (context, event) => {
                    return event.value.header;
                },
            }),
            recieveUrl: assign({
                url: (context, event) => {
                    return event.value.url;
                },
                request: (context, event) => event.value.request,
            }),
            recieveparameter: assign({
                parameters: (context, event) => {
                    return event.value.parameter;
                },
            }),
            recievenexttransition: assign({
                success: (context, event) => {
                    return event.value.success;
                },
            }),
            recievefailuretransition: assign({
                failure: (context, event) => {
                    return event.value.failure;
                },
            }),
        },
    }
);


module.exports = Fetch_Machine