<template>
  <figure class="logo">
    <span>
      <img src="/static/images/company-logo.png" alt="Company Logo">
    </span>
  </figure>
</template>
<style>
  img {
    width:150px;
    height:auto;
  }
  figure {
    float: left;
  }
  .logo {
    width: 150px;
    height: auto;
    margin-top: 1vw;
  }
  @media (max-width: 767px) {
    figure {
      float: none;
      margin-left: auto;
      margin-right: auto;
      margin-top: 1rem;
      clear: both;
    }
  }
</style>
