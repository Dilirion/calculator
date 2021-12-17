import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    data: null,
  },
  getters: {
    DATA: state => {
        return state.data;
    }
  },
  mutations: {
    SET_DATA: (state, payload) => {
        state.data = payload;
      }
  },
  actions: {
    GET_DATA: async (context) => {
        let {data} = await Axios.get(`http://localhost:3000/data`);
        context.commit('SET_DATA', data);
    }
  }
});