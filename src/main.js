import { createApp } from 'vue';
import { createStore } from 'vuex';

import App from './App.vue';

const store = createStore({
    state() {
        return {
            round: 0,
        };
    },
    mutations: {
        incrementRound(state) {
            state.round++;
        },
    },
    getters: {
        roundCounter(state) {
            return state.round;
        },
    },
});

const app = createApp(App);
app.use(store);
app.mount('#app');
