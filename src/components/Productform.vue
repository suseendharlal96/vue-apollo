<template>
  <teleport to="body">
    <div class="model-container">
      <span class="close" @click="$emit('cancel')">X</span>
      <div class="auth-form">
        <h2 class="heading" v-if="!deleteId">
          {{ editMode ? "Edit" : "Create" }} product
        </h2>
        <form v-if="!deleteId" @submit="submitForm">
          <div>
            <label for="name" required>Name</label>
            <input
              :class="[errors && errors.name ? 'invalid' : '', 'form-control']"
              type="text"
              name="name"
              id="name"
              v-model.lazy.trim="form.name"
              placeholder="Product Name"
            />
            <p v-if="errors && errors.name" class="invalid">
              {{ errors.name }}
            </p>
          </div>
          <div>
            <label for="price" required>Price</label>
            <input
              :class="[errors && errors.price ? 'invalid' : '', 'form-control']"
              type="number"
              name="price"
              id="price"
              v-model.lazy.trim="form.price"
              placeholder="Price"
            />
          </div>
          <p v-if="errors && errors.price" class="invalid">
            {{ errors.price }}
          </p>
          <div>
            <label for="image" required>Image url</label>
            <input
              :class="[errors && errors.image ? 'invalid' : '', 'form-control']"
              type="text"
              name="image"
              id="image"
              v-model.trim="form.image"
              placeholder="Image URL"
            />
          </div>
          <p v-if="errors && errors.image" class="invalid">
            {{ errors.image }}
          </p>
          <div>
            <label for="description" required>Description</label>
            <textarea
              :class="[
                errors && errors.description ? 'invalid' : '',
                'form-control',
              ]"
              rows="2"
              name="description"
              id="description"
              v-model.trim="form.description"
              placeholder="About product.."
            />
          </div>
          <p v-if="errors && errors.description" class="invalid">
            {{ errors.description }}
          </p>
          <button
            class="secondary"
            :disabled="adding || editing"
            type="button"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button class="primary" type="submit">
            {{
              editMode
                ? editing
                  ? "Saving"
                  : "Edit & Save"
                : adding
                ? "Creating"
                : "Create"
            }}
          </button>
        </form>
        <template v-if="deleteId">
          <div class="delete-container">
            <h3>Are you sure want to Delete "{{ prodName }}" ?</h3>
            <button class="secondary" @click="deleteProduct({ id: deleteId })">
              {{ deleting ? "Deleting.." : "Delete" }}
            </button>
            <button
              class="primary"
              :disabled="deleting"
              type="button"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
          </div>
        </template>
      </div>
    </div>
  </teleport>
</template>

<script>
import { reactive, ref, computed, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import mutations from "../graphql/mutations";

export default {
  props: ["delId", "prodName", "editProduct"],
  emits: ["cancel", "success"],
  setup(props, { emit }) {
    // const { editProduct } = props;
    const router = useRouter();
    const store = useStore();
    let form = ref({
      name: "",
      price: null,
      image: "",
      description: "",
    });
    let errors = reactive({
      name: "",
      price: null,
      image: "",
      description: "",
    });
    if (props.editProduct) {
      form.value = props.editProduct;
    }
    const authData = computed(() => store.getters["auth/getAuthData"]);
    const isValid = computed(() => {
      if (
        form.value.name !== "" &&
        form.value.price > 0 &&
        form.value.image !== "" &&
        form.value.description !== ""
      ) {
        return true;
      } else {
        return false;
      }
    });
    const submitForm = (e) => {
      e.preventDefault();
      errors = { name: "", price: null, image: "", description: "" };
      if (isValid.value) {
        props.editProduct ? editProduct() : addProduct();
      } else {
        if (form.value.name === "") {
          errors.name = "Must not be empty";
        } else {
          errors.name = "";
        }
        if (form.value.price <= 0) {
          errors.price = "Must be valid";
        } else {
          errors.price = "";
        }
        if (form.value.image === "") {
          errors.image = "Must not be empty";
        } else {
          errors.image = "";
        }
        if (form.value.description === "") {
          errors.description = "Must not be empty";
        } else {
          errors.description = "";
        }
      }
    };
    const {
      mutate: editProduct,
      loading: editing,
      onDone: editDone,
    } = useMutation(mutations.updateProduct, () => ({
      variables: {
        id: props.editProduct._id,
        name: form.value.name,
        image: form.value.image,
        price: +form.value.price,
        description: form.value.description,
      },
    }));
    const {
      mutate: addProduct,
      loading: adding,
      onDone: addDone,
    } = useMutation(mutations.createProduct, () => ({
      variables: {
        name: form.value.name,
        image: form.value.image,
        price: +form.value.price,
        description: form.value.description,
      },
    }));
    editDone(() => {
      emit("success");
    });
    addDone(() => {
      emit("success");
    });
    const {
      mutate: deleteProduct,
      loading: deleting,
      onDone: deleteSuccess,
    } = useMutation(mutations.deleteProduct);
    deleteSuccess(() => {
      emit("success");
    });
    onMounted(() => {
      if (!authData.value) {
        router.push("/auth");
      }
    });
    return {
      form,
      submitForm,
      deleting,
      deleteProduct,
      deleteId: props.delId,
      editMode: props.editProduct,
      errors,
      adding,
      editing,
    };
  },
};
</script>

<style scoped>
.model-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  position: fixed;
  top: 0px;
  text-align: center;
}
.delete-container {
  background-color: #ffffff;
  padding: 2rem;
  margin-top: 5%;
}
.auth-form {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 6rem 1rem;
}
.heading {
  color: #ffffff;
}
[required]::after {
  content: "*";
  color: red;
}
.form-control {
  min-width: 30%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #555;
  outline: none;
}
div input:not(.invalid):focus,
textarea:not(.invalid):focus {
  background-color: lightblue;
  border: 2px solid lightskyblue;
}
.invalid:focus {
  background-color: salmon;
}
.error {
  background-color: salmon;
}
label {
  display: block;
  color: #ffffff;
}
button {
  cursor: pointer;
  margin: 2% 2%;
  min-width: 10%;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 2px 3px solid;
}
.primary {
  background-color: #0000ff;
  color: #ffffff;
}
.primary:hover {
  background: rgba(64, 64, 230, 0.6);
  color: #ffffff;
}
.secondary {
  background-color: #ff0000;
  color: #ffffff;
}
.secondary:hover {
  background: rgba(233, 12, 0, 0.75);
  color: #ffffff;
}
.close {
  position: absolute;
  top: 50px;
  right: 60px;
  color: #ff0000;
  font-size: 1.75rem;
  cursor: pointer;
  width: 35px;
  background-color: #ffffff;
  border-radius: 4px;
}
.invalid {
  background-color: #ff0000;
}
</style>
