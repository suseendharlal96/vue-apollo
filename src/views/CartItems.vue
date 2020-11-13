<template>
  <template v-if="!loading">
    <template v-if="cart && cart.length > 0">
      <h3>Cart Total: ₹ {{ total }}</h3>
      <div class="cart-container">
        <template v-for="c in cart" :key="c._id">
          <Cart :cart="c" @changetotal="changetotal" />
        </template>
      </div>
    </template>
    <p v-else>No items in cart</p>
  </template>
  <template v-else>
    <p>Fetching Cart Items..⏳</p>
  </template>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import queries from "../graphql/queries/index";
import Cart from "../components/Cart.vue";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const authData = computed(() => store.getters["auth/getAuthData"]);
    const cart = ref();
    const loading = ref(false);
    const total = computed(() => {
      let t = 0;
      cart.value.forEach((c) => {
        t += c.quantity * c.price;
      });
      return t;
    });
    const changetotal = (data) => {
      console.log(data);
      console.log(cart.value);
      const tempCart = [...cart.value];
      const a = tempCart.findIndex((c) => c._id === data._id);
      console.log(a);
      tempCart[a] = { ...tempCart[a], quantity: data.quantity };
      cart.value = tempCart;
    };
    onMounted(() => {
      if (!authData.value) {
        router.push("/");
      } else {
        const { loading: fetching, onResult } = useQuery(
          queries.getCart,
          null,
          {
            fetchPolicy: "cache-and-network",
          }
        );
        loading.value = fetching.value;
        onResult((res) => {
          loading.value = res.loading;
          cart.value = res && res.data.getCart.products;
        });
      }
    });
    return {
      cart,
      loading,
      total,
      changetotal,
    };
  },
  components: {
    Cart,
  },
};
</script>

<style scoped>
.cart-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}
</style>
