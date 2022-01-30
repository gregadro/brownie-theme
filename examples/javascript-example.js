import Vue from "vue";

const state = {
  ingredients: [],
  recipe: [],
  isMember: false,
};

const actions = {
  getRecipe: async ({ commit }, recipeId) => {
    try {
      const response = await Vue.http.get(`recipe/${recipeId}`);
      commit("SET_RECIPE", response.data);
    } catch (error) {
      // handle error
    }
  },
};

const mutations = {
  SET_RECIPE: (state, recipeData) => {
    state.recipe = recipeData;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
