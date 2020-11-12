import { createStore } from "vuex";

import authModule from "./authModule/index";

const store = createStore({
  modules: {
    auth: { ...authModule, namespaced: true },
  },
});

export default store;
