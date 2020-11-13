<template>
  <div class="product-container">
    <h3>{{ singleProduct.name }}</h3>
    <p class="price">{{ singleProduct.price }}</p>
    <img :src="singleProduct.image" :alt="singleProduct.name" />
    <p class="description">{{ singleProduct.description }}</p>
    <div class="btn-container">
      <template v-if="authData">
        <template
          v-if="
            userId && userId.toString() === singleProduct.creator.toString()
          "
        >
          <button
            class="delete"
            @click="
              $emit('delproduct', {
                id: singleProduct._id,
                name: singleProduct.name,
              })
            "
          >
            Delete
          </button>
          <button class="edit" @click="$emit('editproduct', { singleProduct })">
            Edit
          </button>
        </template>
        <button
          class="cart"
          @click="$emit('addcart', { id: singleProduct._id })"
        >
          Add to cart
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  props: ["product"],
  emits: ["delproduct", "editproduct", "addcart"],
  setup(props) {
    const store = useStore();
    let userId = ref(null);
    const authData = computed(() => store.getters["auth/getAuthData"]);
    userId.value = authData.value ? authData.value && authData.value.id : null;
    console.log(userId.value);
    console.log(props.product);
    return {
      singleProduct: props.product,
      authData,
      userId,
    };
  },
};
</script>

<style scoped>
.product-container {
  flex-direction: column;
  width: 350px;
  margin: 10px 10px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  min-height: 325px;
  border-radius: 4px;
  border: 1px solid gray;
  box-shadow: 2px 3px;
}
.price::before {
  content: "₹";
}
h3,
p {
  margin-bottom: 5px;
}
img {
  margin-bottom: 5px;
  height: 176px;
}
.btn-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.btn-container button {
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}
.description {
  word-break: break-all;
}
button.delete {
  background-color: #ff0000;
  color: #ffffff;
}
button.delete:hover {
  background: rgba(233, 12, 0, 0.75);
  color: #ffffff;
}
button.edit {
  background: rgba(0, 0, 135, 0.6);
  color: #ffffff;
}
button.edit:hover {
  background-color: #7d7dd6;
  color: #ffffff;
}
button.cart {
  background-color: rgba(24, 168, 32, 0.6);
  color: #000000;
}
button.cart:hover {
  background-color: rgba(0, 255, 0, 0.6);
  color: #000000;
}
</style>
