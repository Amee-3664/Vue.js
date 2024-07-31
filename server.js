const express = require('express');
const cors = require('cors'); // Import cors
const toggleMachine = require('./machine');
const { createMachine, interpret } = require('xstate');


const service = interpret(toggleMachine).onTransition((state) => {
    console.log('State changed to:', state.value);
    console.log('Context:', state.context);
  }).start();


const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));
app.use(express.json());
const port = 3000;

// logs 'inactive'

// logs 'inactive'
app.post('/', (req, res) => {


    const sendingFunction = (ctx) => {
        res.json(ctx);
    }

    const httpReq = req.body;

    const newMachine = toggleMachine.withConfig({
        actions: {
            sendCtx: (context, event) => {
                sendingFunction(context);
            },
        }
    });
    const service = interpret(newMachine);

    service.start();

    service.onTransition((state) => {
        // keys[key].service = service;
        console.log("ON STATE: ", state.value);
        console.log("NextEvents: ", state.nextEvents);
    });
    console.log("httpReq.data=", httpReq.data);

    service.send({ type: httpReq.transition, value: httpReq.data });

    service.onStop(() => {
        console.log(
            "---------------------!!! Machine STOPPED !!!---------------------"
        );

    });

    // logs 'active'
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});