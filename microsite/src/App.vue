<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // setting sellers and the seller based on id in the URL
    this.$store.dispatch('getSellers')
  }
}
</script>

<style>
html { margin-left: calc(100vw - 100%); } /* Fixing the jumpy content on scrollbar */
#app {
}
section {
  background-color: none;
}
</style>
