<template>
  <div class="cart">
    <h3>{{ mycart.name }}</h3>
    <p class="price">{{ mycart.price }}</p>
    <img :src="mycart.image" :alt="mycart.name" />
    <div class="btn-container">
      <div>
        <span>
          <button
            :disabled="mycart.quantity === 1"
            @click="changeQuantity('decrease')"
          >
            -
          </button>
        </span>
        <span>
          <input
            class="item-quantity"
            type="text"
            disabled
            :value="mycart.quantity"
          />
        </span>
        <span>
          <button @click="changeQuantity('increase')">+</button>
        </span>
      </div>
      <button class="remove" @click="removeItem({ prodId: mycart._id })">
        Remove
      </button>
      <button
        class="pay"
        @click="
          makepayment({
            id: mycart._id,
            name: mycart.name,
            price: mycart.price,
            image: mycart.image,
            description: mycart.description,
            quantity: mycart.quantity,
          })
        "
      >
        {{ paying ? "Processing payment" : "Pay " }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";

import mutations from "../graphql/mutations/index";

export default {
  props: ["cart"],
  emits: ["changetotal", "remove-item"],
  setup(props, { emit }) {
    const actualCart = ref();
    const store = useStore();
    watch(() => {
      if (props.cart) {
        actualCart.value = props.cart;
      }
    });
    // props?.cart ? (actualCart.value = props?.cart) : null;

    const changeQuantity = (option) => {
      if (option === "increase") {
        actualCart.value.quantity++;
      } else {
        actualCart.value.quantity--;
      }
      emit("changetotal", actualCart.value);
      actualCart.value.price = props.cart.price * actualCart.value.quantity;
    };
    const authData = computed(() => store.getters["auth/getAuthData"]);

    // remove cart mutation
    const { mutate: removeItem, onDone } = useMutation(
      mutations.removeFromCart
    );
    onDone(() => {
      alert("Item removed");
      emit("remove-item");
    });

    const {
      mutate: makepayment,
      loading: paying,
      onDone: paymentSuccess,
    } = useMutation(mutations.pay);
    paymentSuccess(() => {
      alert("Payment successfull");
      emit("remove-item");
    });
    return {
      mycart: actualCart,
      changeQuantity,
      paying,
      makepayment,
      authData,
      removeItem,
    };
  },
};
</script>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #000000;
  border-radius: 4px;
  /* box-shadow: 3px 3px; */
  padding: 0.5rem;
  margin: 0px 15px 15px 0px;
  transition: box-shadow 0.5s;
  width: 350px;
}
.cart:hover {
  box-shadow: 4px 4px;
}
.price::before {
  content: "₹";
}
.price {
  font-weight: bold;
}
.btn-container {
  margin-top: 15px;
  padding: 1rem;
  display: flex;
  width: 300px;
  justify-content: space-between;
}
.item-quantity {
  text-align: center;
  width: 40px;
  margin: 0 10px;
}
button {
  cursor: pointer;
  border-radius: 4px;
  padding: 0.5rem;
}
.remove {
  background-color: #700f0f;
  color: #ffffff;
}
.remove:hover {
  background: #ff0000;
  color: #ffffff;
}
.pay {
  background-color: #042e04;
  color: #ffffff;
}
.pay:hover {
  background: #00ff00;
  color: #000000;
}
[disabled] {
  cursor: no-drop;
}
img {
  height: 275px;
}
</style>
