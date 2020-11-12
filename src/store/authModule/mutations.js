const mutations = {
  setAuthData: (state, authData) => {
    state.authData = authData;
  },
  logout: (state) => (state.authData = null),
};

export default mutations;
