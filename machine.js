const { createMachine, assign, spawn, sendParent } = require('xstate');

const fetch = (url, options) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, options));

const toggleMachine = createMachine({
  initial: 'Idle',
  context: {},
  states: {
    Idle: {
      on: {
       
        SIGNUP: {
          target: 'SIGNUP_REQUEST',
          actions: assign({
            username: (context, event) => event.value.username,
            email: (context, event) => event.value.email,
            password: (context, event) => event.value.password,
            gender: (context, event) => event.value.gender,
            age: (context, event) => event.value.age,
          }),
        },
        LOGIN: {
          target: 'LOGIN_REQUEST',
          actions: assign({
            username: (context, event) => event.value.username,
            password: (context, event) => event.value.password,
          }),
        },
        FETCH_USERS: {
          target: 'FETCH_RECORDS',
        },
      },
    },
    
    SIGNUP_REQUEST: {
      entry: [
        (context) => console.log('Entering SIGNUP_REQUEST with context:', context),
        'spawnFetch',
        async (context) => {
          trigger(
            context,
            'http://localhost:3001/signup',
            'POST',
            {
              username: context.username,
              email: context.email,
              password: context.password,
              gender: context.gender,
              age: context.age,
            },
            'SIGNUP_SUCCESS',
            'SIGNUP_FAILURE'
          );
        },
      ],
      on: {
        SIGNUP_SUCCESS: {
          actions: [assign({ user: (context, event) => event.result }), 'sendCtx'],
          target: 'Idle',
        },
        SIGNUP_FAILURE: {
          actions: ['receiveMessage', 'sendCtx'],
          target: 'Idle',
        },
      },
    },
    LOGIN_REQUEST: {
      entry: [
        (context) => console.log('Entering LOGIN_REQUEST with context:', context),
        'spawnFetch',
        async (context) => {
          trigger(
            context,
            'http://localhost:3001/login',
            'POST',
            {
              username: context.username,
              password: context.password,
            },
            'LOGIN_SUCCESS',
            'LOGIN_FAILURE'
          );
        },
      ],
      on: {
        LOGIN_SUCCESS: {
          actions: [assign({ user: (context, event) => event.result }), 'sendCtx'],
          target: 'Idle',
        },
        LOGIN_FAILURE: {
          actions: ['receiveMessage', 'sendCtx'],
          target: 'Idle',
        },
      },
    },
    FETCH_RECORDS: {
      entry: [
        (context) => console.log('Entering FETCH_RECORDS with context:', context),
        'spawnFetch',
        async (context) => {
          trigger(context, 'http://localhost:3001/users', 'GET', {}, 'FETCH_SUCCESS', 'Error');
        },
      ],
      on: {
        FETCH_SUCCESS: {
          actions: [
            assign({
              users: (context, event) => {
                return event.result;
              },
            }),
            'sendCtx',
          ],
          target: 'Idle',
        },
        Error: {
          actions: ['receiveMessage', 'sendCtx'],
          target: 'Idle',
        },
      },
    },
    Home: {
      // Define actions or states for Home if needed
      type: 'final',
    },
    Final: {
      type: 'final',
    },
  },
}, {
  actions: {
    receiveMessage: assign({
      errorMessage: (context, event) => event.ErrorMessage,
      mBoolean: true,
    }),
    spawnFetch: assign({
      fetchSrc: () => spawn(Fetch_Machine),
      mBoolean: false,
    }),
    sendCtx: (context) => console.log('Updated context:', context),
  },
});

const Fetch_Machine = createMachine({
  id: 'FETCH',
  initial: 'Idle',
  context: {},
  states: {
    Idle: {
      on: {
        FETCH2: {
          target: 'GetData2',
          actions: [
            'recieveUrl',
            'recieveparameter',
            'recievenexttransition',
            'recievefailuretransition',
          ],
        },
      },
    },
    GetData2: {
      invoke: {
        id: 'GetData',
        src: 'getData',
        onDone: {
          target: 'Final',
          actions: sendParent((context, event) => ({
            ...context,
            type: context.success,
          })),
        },
        onError: {
          target: 'Final',
          actions: sendParent((context, event) => ({
            ...context,
            type: context.failure,
          })),
        },
      },
    },
    Final: {
      type: 'final',
    },
  },
}, {
  services: {
    getData: (context, event) => {
      console.log(`Fetching data from URL: ${context.url}`);
      console.log(`With parameters: ${JSON.stringify(context.parameters)}`);
      console.log(`Using request method: ${context.request}`);
      return fetch(context.url, {
        method: context.request,
        ...(context.request === 'POST' && {
          body: JSON.stringify(context.parameters),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`API Response: ${JSON.stringify(data)}`);
          context.result = data;
        })
        .catch((e) => {
          context.ErrorMessage = e.message;
          console.log(`Service Error: ${context.ErrorMessage}`);
          return Promise.reject();
        });
    },
  },
  actions: {
    recieveUrl: assign({
      url: (context, event) => event.value.url,
      request: (context, event) => event.value.request,
    }),
    recieveparameter: assign({
      parameters: (context, event) => event.value.parameter,
    }),
    recievenexttransition: assign({
      success: (context, event) => event.value.success,
    }),
    recievefailuretransition: assign({
      failure: (context, event) => event.value.failure,
    }),
  },
});

const trigger = (context, url, request, parameter, success, failure) => {
  console.log('Triggering fetch with:', { url, request, parameter, success, failure });
  context.fetchSrc.send({
    type: 'FETCH2',
    value: { url, request, parameter, success, failure },
  });
};

module.exports = toggleMachine;
