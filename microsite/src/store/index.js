import Vue from 'vue'
import Vuex from 'vuex'
import {settings} from '../../config/settings'

const UPDATE_SELLERS = 'UPDATE_SELLERS'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    seller: {
      id: '',
      name: {
        first: '',
        last: ''
      },
      skype: '',
      email: ''
    },
    sellers: []
  },
  getters: {
    seller: state => {
      return state.seller
    }
  },
  mutations: {
    [UPDATE_SELLERS] (state, sellers) {
      state.sellers = sellers
      // finding the current seller
      let id = state.route.params.id
      let sellerFound = false
      state.sellers.forEach((seller) => {
        if (seller.id === id) {
          state.seller = seller
          sellerFound = true
        }
      })

      if (!sellerFound) {
        state.seller = false
      }
    }
  },
  actions: {
    getSellers ({commit}) {
      Vue.http.get(settings.apiUrl + 'user/sellers', { headers: { 'content-type': 'application/json' } }).then((result) => {
        commit(UPDATE_SELLERS, result.data)
      }, (error) => {
        console.error(error)
      })
    }
  },
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== 'production'
})
