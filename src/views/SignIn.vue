<template>
    <div class="signin-container">
      <img src="@/assets/icon.png" alt="Logo" class="logo" />
      <p class="signin-text">Please sign in</p>
  
      <!-- Sign in form -->
      <form @submit.prevent="handleSignIn" class="signin-form">
        <input
          v-model="email"
          type="email"
          placeholder="E-mail address"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign in</button>
      </form>

      <!-- Redirect to sign up if user does not have an account -->
      <p class="sign-up-text">Don't have an account yet?&nbsp;<router-link to="/signup">Sign up</router-link></p>
      <p class="trailing-text">Codeway © 2021</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import  api  from "@/api";
  
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  
  const handleSignIn = async () => {
    try {

      //Sign in request
      const response = await api.post("/auth/signin", {
        email: email.value,
        password: password.value,
      });

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      //Successful sign in redirects to main page which is the configuration panel
      router.push("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Sign-in failed.");
    }
  };
  </script>
  
  <style scoped>
  .signin-container {
    max-width: 250px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
    background-color: transparent;
  }

  .signin-text{
    color:  var(--title-color-1);
    font-size: 20px;
    font-weight: 300;
  }
  
  .signin-form input {
    display: block;
    width: 100%;
    padding: 10px 8px;
    background-color: transparent;
    border: 1px solid var(--border-color-1);
    font-size: 14px;
    box-sizing: border-box;
    border-radius: 0 !important;
  }

  .signin-form input:first-of-type {
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  }
  
  .signin-form input:last-of-type {
    border-bottom-left-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }
  
  .signin-form input::placeholder {
    color: var(--text-color-1);
  }

  .signin-form input:focus {
    outline: none !important;
    border:1px solid var(--input-focus-color-1);
    }
  
  .signin-form button {
    width: 100%;
    padding: 10px 14px;
    background-color: var(--button-color-1);
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .signin-form button:hover {
    background-color: var(--button-hover-color-1);
  }
  
  .trailing-text {
    margin-top: 16px;
    color: var(--text-color-1);
    font-size: 12px;
  }

  .sign-up-text{
    margin-bottom: 40px;
    font-size: 12px;
    color: var(--text-color-1);
  }
  </style>
  