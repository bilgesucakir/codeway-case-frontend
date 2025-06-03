<script setup>
</script>

<template>
  <div id="app">
    <div v-if="isLoading" class="loading-screen">
      Loading...
    </div>
    <router-view v-else />
  </div>
</template>

<style>
:root{
  /* color theme*/
  --background-color-1: rgb(30, 30, 43);
  --background-color-2: #22223b;
  --title-color-1: rgb(55, 55, 102);
  --text-color-1: rgb(127, 127, 145);
  --text-color-2: rgb(101, 129, 165);
  --text-color-3: #cccccc;
  --text-color-4: white;
  --button-color-1: rgb(79, 101, 211);
  --button-color-2: #3b82f6;
  --button-color-3: #ef4444;
  --button-color-4: #22c55e;
  --button-hover-color-1: #2563eb;
  --input-focus-color-1: rgb(211, 50, 203);
  --border-color-1: rgb(63, 63, 90);
  --border-color-2: #444;
} 

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
}
.logo {
    width: 200px;
    margin-bottom: 20px;
}

body {
  background-color: var(--background-color-1);
  margin: 0;
  font-family: Arial, sans-serif;
  color: var(--text-color-4);
}

button{
  color: var(--text-color-4);
}

</style>
