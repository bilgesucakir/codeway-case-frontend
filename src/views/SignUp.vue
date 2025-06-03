<template>
    <div class="signup-container">
      <img src="@/assets/icon.png" alt="Logo" class="logo" />
      <p class="signup-text">Please sign up</p>
  
      <!-- Sign up form -->
      <form @submit.prevent="handleSignUp" class="signup-form">
        <input
          v-model="displayName"
          type="text"
          placeholder="Name Surname"
          required
        />
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
        <input
          v-model="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          required
        />
        <button type="submit">Sign up</button>
      </form>
      
      <!-- Redirect to sign in if user has an account -->
      <p class="sign-up-text">Already have an account??&nbsp;<router-link to="/signin">Sign in</router-link></p>
      <p class="trailing-text">Codeway © 2021</p>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import  api  from "@/api";

  const router = useRouter();

  const displayName = ref('');
  const email = ref('');
  const password = ref('');
  const repeatPassword = ref('');

  const handleSignUp = async () => {

    //Strings that have one or more non-whitespace char, @ char, one or more non-whitespace char, . char, one or more non-whitespace char
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Strings that have at least one letter, at least one digit, at least one special char, at least 8 chars long
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!emailRegex.test(email.value)) {
        alert('Invalid email address.');
        return;
    }

    if (!passwordRegex.test(password.value)) {
        alert('Password must be at least 8 characters long, contain at least one letter, one digit, and one symbol.');
        return;
    }

    //Password and repeated password should match
    if (password.value !== repeatPassword.value) {
        alert('Passwords do not match.');
        return;
    }
    try {

      //Sign up request
      await api.post("auth/signup", {
          email: email.value,
          password: password.value,
          displayName: displayName.value,
      });

      alert('Sign-up successful! Please sign in now.');

      //Sign up redirects to sign in since user should be signed in to access control panel
      router.push("/signin");
    } catch (error) {
        alert(error.response?.data?.message || "Sign-up failed.");
    }
  };
</script>

  
<style scoped>
  .signup-container {
    max-width: 250px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
    background-color: transparent;
  }

  .signup-text{
    color:  var(--title-color-1);
    font-size: 20px;
    font-weight: 300;
  }
  

  .signup-form input {
    display: block;
    width: 100%;
    padding: 10px 8px;
    background-color: transparent;
    border: 1px solid var(--border-color-1);
    border-radius: 0 !important;
    font-size: 14px;
    box-sizing: border-box;
  }

  .signup-form input:first-of-type {
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  }
  
  .signup-form input:last-of-type {
    border-bottom-left-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }
  
  .signup-form input::placeholder {
    color: var(--text-color-1);
  }

  .signup-form input:focus {
    outline: none !important;
    border:1px solid var(--input-focus-color-1);
    }
  
  .signup-form button {
    width: 100%;
    padding: 10px 14px;
    background-color: var(--button-color-1);
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .signup-form button:hover {
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
  