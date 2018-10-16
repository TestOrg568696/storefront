import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

const module = 'product'
// initial state
// array of products objects
// https://ecomstore.docs.apiary.io/#reference/products
const state = {
  all: []
}

const mutations = {
  // add product object to array
  addProduct (state, payload) {
    // arbitrary initial properties
    state.all.push({
      _id: payload.id,
      sku: null,
      commodity_type: null,
      name: null,
      i18n: {},
      slug: null,
      available: true,
      visible: true,
      currency_id: DEFAULT_CURRENCY,
      currency_symbol: DEFAULT_CURRENCY_SYMBOL
    })
  },

  // reset entire product body
  initProduct (state, payload) {
    // find product
    let id = payload.id
    let body = {}
    for (let i = 0; i < state.all.length; i++) {
      let product = state.all[i]
      if (product._id === id) {
        // found
        body = product
        break
      }
    }

    if (body) {
      let Body = payload.body
      // ensure to not write new (unused) properties
      Object.keys(Body).forEach((key) => {
        if (key in body) {
          body[key] = Body[key]
        }
      })
    }
  },

  // delete product from list by ID
  removeProduct (state, { id }) {
    state.all.forEach((product, index, list) => {
      if (product._id === id) {
        // found
        list.splice(index, 1)
      }
    })
  }
}

const getters = {
  products: state => state.all,

  // find product by ID from stored list
  productById: state => id => {
    let product = state.all.find(product => product._id === id)
    if (product !== undefined) {
      // returns product body from array
      return product
    } else {
      return {}
    }
  }
}

const actions = {
  // init specific product object
  initProduct ({ commit, dispatch }, payload) {
    // check if product is already loaded
    let id = payload.id
    commit('addProduct', payload)
    // API request
    return dispatch('api', [ 'get', module, id ], { root: true }).then(body => {
      commit('initProduct', { id, body })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
