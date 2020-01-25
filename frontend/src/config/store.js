import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isMenuVisible: true,
        user: {
            name: 'Usuário Mock',
            email: 'mock@cod3r.com'
        }
    },
    mutations: {
        toggleMenu(store, isVisible) {
            if(isVisible === undefined) {
                store.isMenuVisible = !store.isMenuVisible;
            } else {
                store.isMenuVisible = isVisible;
            }
        }
    }
})