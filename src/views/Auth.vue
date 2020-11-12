<template>
  <div class="auth-form">
    <form @submit="submitForm">
      <p v-if="errors" class="invalid">
        {{ errors }}
      </p>
      <div>
        <label for="email" required>Email</label>
        <input
          :class="[
            errors && errors.search('email') !== -1 ? 'error' : '',
            'form-control',
          ]"
          type="text"
          name="email"
          autofocus
          id="email"
          v-model.lazy.trim="form.email"
        />
      </div>
      <div>
        <label for="password" required>Password</label>
        <input
          :class="[
            errors && errors.search('password') !== -1 ? 'error' : '',
            'form-control',
          ]"
          type="password"
          name="password"
          id="password"
          v-model.lazy.trim="form.password"
        />
      </div>
      <template v-if="isSignup">
        <div>
          <label for="confirmpassword" required>Confirm Password</label>
          <input
            :class="[isInValid ? 'invalid' : '', 'form-control']"
            type="password"
            name="confirmpassword"
            :disabled="form.password === ''"
            id="confirmpassword"
            v-model.trim="form.confirmpassword"
          />
        </div>
        <p v-if="isInValid" class="invalid">Passwords do not match</p>
      </template>
      <p v-if="errors && errors.error" class="invalid">
        {{ isSignup ? errors.error : "Invalid credentials" }}
      </p>
      <button
        :disabled="loading || signinLoading"
        class="secondary"
        type="button"
        @click="changeMode"
      >
        Switch to {{ isSignup ? "Signin" : "Signup" }}
      </button>
      <button class="primary" type="submit">
        {{
          isSignup
            ? loading || signinLoading
              ? "Signing up.."
              : "Signup"
            : loading || signinLoading
            ? "Signing in.."
            : "Signin"
        }}
      </button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, computed } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import mutations from "../graphql/mutations/index";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    // const router = inject("$router");
    const form = reactive({
      email: "",
      password: "",
      confirmpassword: "",
    });
    const isSignup = ref(false);
    const errors = ref(null);
    const changeMode = () => {
      isSignup.value = !isSignup.value;
      form.confirmpassword = "";
      if (form.password !== "") {
        form.password = "";
      }
      // if (errors.value) {
      //   errors.value = null;
      // }
    };
    const submitForm = (e) => {
      e.preventDefault();
      // let url = "signin";
      console.log(isSignup.value);
      isSignup.value ? signupData() : signinData();
      // store.dispatch("auth/authenticate", { form, url });
      console.log(form);
    };
    // signup mutation
    const {
      mutate: signupData,
      loading,
      onDone: signupDone,
      onError: signupError,
    } = useMutation(mutations.SIGN_UP, () => ({
      variables: {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmpassword,
      },
    }));
    signupDone((res) => {
      console.log(1);
      console.log(res);
      store.commit("auth/setAuthData", res.data.signup);
      router.push("/");
    });

    signupError((error) => {
      errors.value = error.message;
    });

    // signin mutation
    const {
      mutate: signinData,
      loading: signinLoading,
      onDone: signinDone,
      onError,
    } = useMutation(mutations.SIGN_IN, () => ({
      variables: {
        email: form.email,
        password: form.password,
      },
    }));
    signinDone((res) => {
      console.log(1);
      console.log(res);
      store.commit("auth/setAuthData", res.data.signin);
      router.push("/");
    });
    onError((error) => {
      console.log({ name: error.name, stack: error.stack });
      errors.value = error.message;
    });
    const isInValid = computed(() => {
      if (isSignup.value) {
        if (
          form.password !== "" &&
          form.confirmpassword !== "" &&
          form.password !== form.confirmpassword
        ) {
          return true;
        } else {
          return false;
        }
      }
    });
    // Passing args in Getters
    // const authData = computed(() => store.getters["auth/getAuthData"](args));
    // const authData = computed(() => store.getters["auth/getAuthData"]);
    // const loading = computed(() => store.getters["auth/getLoading"]);
    // const errors = computed(() => store.getters["auth/getErrors"]);
    return {
      form,
      isSignup,
      changeMode,
      submitForm,
      // authData,
      errors,
      loading,
      signinLoading,
      isInValid,
      // errors,
    };
  },
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  flex-wrap: wrap;
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
div input:not(.invalid):focus {
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
}
button {
  margin: 2% 2%;
  min-width: 10%;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.secondary {
  background-color: #ff0000;
  color: #ffffff;
}
.secondary:not(:disabled):hover {
  background: rgba(233, 12, 0, 0.75);
  color: #ffffff;
}
.invalid {
  color: red;
}
.primary {
  background-color: #065806;
  color: #ffffff;
}
.primary:hover {
  background-color: #45c545;
  color: #ffffff;
}
button:disabled {
  cursor: no-drop;
  background-color: silver;
  color: #000000;
}
</style>
