<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <Navbar />
  <router-view></router-view>
</template>

<script>
import { provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";

import { client } from "../ApolloClient";
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",
  setup() {
    provide(DefaultApolloClient, client);
  },
  components: {
    Navbar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  padding: 0;
}
</style>
