<template>
  <nav class="navbar">
    <div class="brand">VueGraphQLKart</div>
    <a href="#" class="toggle" @click="toggle()">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </a>
    <div :class="['nav-links', showLink ? 'active' : '']">
      <ul>
        <li
          :class="currentRoute === '/' ? 'active' : ''"
          @click="navigate('/')"
        >
          Home
        </li>
        <li
          v-if="!authData"
          :class="currentRoute === '/auth' ? 'active' : ''"
          @click="navigate('/auth')"
        >
          SignIn
        </li>
        <template v-if="authData">
          <li
            :class="currentRoute === '/cart' ? 'active' : ''"
            @click="navigate('/cart')"
          >
            Cart
          </li>
          <li
            :class="currentRoute === '/orders' ? 'active' : ''"
            @click="navigate('/orders')"
          >
            Orders
          </li>
          <li @click="logout">Logout</li>
          <li class="email">Signed as {{ authData && authData.email }}</li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const showLink = ref(false);
    const logout = () => {
      const answer = window.confirm("Do you really want to logout?");
      if (!answer) return false;
      store.commit("auth/logout");
      showLink.value = false;
      router.push("/");
    };
    const toggle = () => {
      showLink.value = !showLink.value;
    };
    const navigate = (to) => {
      router.push(to);
      showLink.value = false;
    };
    const authData = computed(() => store.getters["auth/getAuthData"]);
    console.log(authData.value);
    const currentRoute = computed(() => route.path);
    return {
      router,
      authData,
      logout,
      showLink,
      toggle,
      navigate,
      currentRoute,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  background-color: #333;
  color: #ffffff;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2%;
}
.brand {
  font-size: 1.5rem;
  margin: 0.5rem;
  color: #00ffb4;
}
.navbar ul {
  margin: 0;
  padding: 0;
  display: flex;
}
.navbar li {
  list-style: none;
  color: white;
  padding: 1rem;
}
.navbar li.active {
  background-color: #00ffb4;
  color: #000000;
}
.navbar li.active:hover {
  background-color: #555;
  color: #ffffff;
}
.navbar .email {
  color: #dcdf25;
}
.navbar li:not(.email):hover {
  background-color: #555;
  cursor: pointer;
}
.toggle {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
}
.toggle .bar {
  height: 3px;
  width: 100%;
  border-radius: 10px;
  background-color: #ffffff;
}
@media (max-width: 550px) {
  .toggle {
    display: flex;
  }
  .nav-links {
    display: none;
    width: 100%;
    transition: all 1.5s;
  }
  .navbar {
    justify-content: center;
  }
  .nav-links.active {
    width: 100%;
    display: flex;
  }
  .navbar ul {
    flex-direction: column;
    width: 100%;
  }
}
.auth-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5%;
}
.email {
  color: #dcdf25;
}
</style>
