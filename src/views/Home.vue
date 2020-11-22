<template>
  <div v-if="authData">
    <button data-tooltip="create product" @click="createProduct">+</button>
  </div>
  <div
    v-if="productData && productData.paginationInfo"
    class="pagination-container"
  >
    <div class="pages">
      <button
        @click="setPage(paginationData.page - 1)"
        v-if="productData.paginationInfo.prevPage"
      >
        Prev
      </button>
      <template
        v-for="(page, index) in Array.from({
          length: productData.paginationInfo.totalPages,
        })"
        :key="index"
      >
        <button
          @click="setPage(index + 1)"
          :disabled="paginationData.page === index + 1 ? true : false"
        >
          {{ index + 1 }}
        </button>
      </template>
      <button
        @click="setPage(paginationData.page + 1)"
        v-if="productData.paginationInfo.nextPage"
      >
        Next
      </button>
    </div>
    <div class="limit">
      <select v-model="paginationData.limit">
        <option disabled value="">Items per page</option>
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  </div>
  <template v-if="!loading">
    <template v-if="productData && productData.paginationInfo">
      <div class="products-container">
        <template v-for="product in productData.products" :key="product._id">
          <Product
            :product="product"
            @delproduct="delproduct($event)"
            @editproduct="updateProduct($event)"
            @addcart="addcart($event)"
          />
        </template>
      </div>
    </template>
    <p v-else>No data.Try to create one😀</p>
  </template>
  <div v-else>
    <p>Fetching current data...⏳</p>
    <template v-if="productData && productData.paginationInfo">
      <div class="products-container">
        <template v-for="product in productData.products" :key="product._id">
          <Product :product="product" />
        </template>
      </div>
    </template>
  </div>
  <template v-if="isModalOpen">
    <Productform
      @cancel="cancel"
      :delId="delId"
      @success="success"
      :prodName="prodName"
      :editProduct="editProduct"
    />
  </template>
</template>

<script>
import { useMutation } from "@vue/apollo-composable";

import { onMounted, reactive, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import Product from "../components/Product.vue";
import Productform from "../components/Productform.vue";
import mutations from "../graphql/mutations/index";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const paginationData = reactive({ page: 1, limit: 2 });
    const cartItemId = ref("");
    const productData = ref("");
    const delId = ref("");
    const prodName = ref("");
    const editProduct = ref("");
    const isModalOpen = ref(false);
    const setPage = (page) => {
      paginationData.page = page;
    };
    watch(paginationData, () => {
      getProducts();
    });
    const authData = computed(() => store.getters["auth/getAuthData"]);
    const createProduct = () => {
      router.push("/create-product");
      isModalOpen.value = true;
    };
    const delproduct = ({ id, name }) => {
      delId.value = id;
      prodName.value = name;
      router.push(`/delete-product/${id}`);
      isModalOpen.value = true;
    };
    const updateProduct = ({ singleProduct }) => {
      router.push(`/edit-product/${singleProduct._id}`);
      editProduct.value = singleProduct;
      isModalOpen.value = true;
    };
    const success = () => {
      getProducts();
      cancel();
    };
    const cancel = () => {
      isModalOpen.value = false;
      delId.value = null;
      prodName.value = null;
      router.push("/");
      editProduct.value = null;
    };
    // Fetching products
    const { mutate: getProducts, loading, onDone } = useMutation(
      mutations.GET_PRODUCTS,
      () => ({
        variables: {
          page: paginationData.page,
          limit: +paginationData.limit,
        },
      })
    );

    onDone((res) => {
      productData.value = res.data ? res.data.getProducts : null;
    });

    // Add to Cart

    const addcart = (product) => {
      cartItemId.value = product.id;
      addToCart();
    };

    const { mutate: addToCart, onDone: addedToCart } = useMutation(
      mutations.addToCart,
      () => ({
        variables: {
          prodId: cartItemId.value,
        },
      })
    );

    addedToCart(() => {
      cartItemId.value = null;
      alert("Added to your cart");
    });

    onMounted(() => {
      router.push("/");
      getProducts();
    });
    return {
      loading,
      productData,
      paginationData,
      authData,
      setPage,
      addcart,
      createProduct,
      delproduct,
      updateProduct,
      editProduct,
      success,
      delId,
      prodName,
      cancel,
      isModalOpen,
    };
  },
  components: {
    Product,
    Productform,
  },
};
</script>

<style scoped>
.products-container,
.pagination-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  /* align-content: center; */
}
.pagination-container {
  margin: 0 10px;
}
.pagination-container > .pages {
  margin-bottom: 10px;
}
button {
  margin: 0 5px;
  cursor: pointer;
  background-color: #0000ff;
  border-radius: 4px;
  color: #ffffff;
}
button:disabled {
  cursor: no-drop;
  background-color: gray;
  color: #000000;
}
.limit::before {
  content: "Items per page";
  margin-right: 5px;
  /* position: absolute; */
}
[data-tooltip] {
  position: relative;
  background-color: rgb(68, 0, 255);
}
[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  border: 1px solid black;
  top: -1rem;
  left: 36px;
  background-color: rgb(68, 0, 255);
  padding: 0.5rem;
  color: #ffffff;
}
.fetch {
  width: 100%;
  height: 100%;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
}
</style>
