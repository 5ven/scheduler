<template>
  <section>
    <logo></logo>
    <nav>
      <ul>
        <li v-for="(item,index) in items" :key="index">
          <router-link :to="item.link">{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>
<style>
  nav a {
    font-family: Ubuntu,arial,sans-serif;
    font-size: 0.9rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #70a6bc;
    display: inline;
    position: relative;
    overflow: hidden;
  }
  nav a:after {
    content: "";
    position: absolute;
    z-index: -1;
    right: 0;
    width: 0;
    bottom: -5px;
    background: #91d8f7;
    height: 2px;
    transition-property: width;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }
  nav a:hover, nav a.router-link-active {
    color: #91d8f7;
  }
  nav a:hover:after,
  nav a:focus:after,
  nav a:active:after,
  nav a.router-link-active:after {
    left: 0;
    right: auto;
    width: 100%;
  }
  nav ul li:nth-child(1) {
    margin-left: 2vw;
  }
  nav ul li {
    margin-top: 2vw;
    margin-bottom: 1vw;
    float: left;
    margin-right: 30px;
    font-size: 18px;
  }
</style>
<script>
import logo from '@/components/Logo'
export default {
  components: { logo },
  data () {
    return {
      items: [
        {
          link: '/id/' + this.$store.state.seller.id,
          title: 'Schedule'
        },
        {
          link: '/privacy-policy',
          title: 'Privacy Policy'
        }
      ]
    }
  }
}
</script>
