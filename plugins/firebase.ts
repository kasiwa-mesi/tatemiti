import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import * as _firebase from 'firebase'
import * as Firebase from '../utils/externals/firebase'

declare module '@nuxt/types' {
  interface Context {
    $firebase: typeof _firebase
    $firestore: firebase.default.firestore.Firestore
    $storage: firebase.default.storage.Storage
    $functions: firebase.default.functions.Functions
    $messaging: firebase.default.messaging.Messaging
    $analytics: firebase.default.analytics.Analytics
  }
  interface NuxtAppOptions {
    $firebase: typeof _firebase
    $firestore: firebase.default.firestore.Firestore
    $storage: firebase.default.storage.Storage
    $functions: firebase.default.functions.Functions
    $messaging: firebase.default.messaging.Messaging
    $analytics: firebase.default.analytics.Analytics
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: firebase.default.auth.Auth & {
      user: firebase.default.User
      currentUser: firebase.default.User
    }
    $firebase: typeof _firebase
    $firestore: firebase.default.firestore.Firestore
    $storage: firebase.default.storage.Storage
    $functions: firebase.default.functions.Functions
    $messaging: firebase.default.messaging.Messaging
    $analytics: firebase.default.analytics.Analytics
  }
}

const _auth = (Firebase.auth as any) as firebase.default.auth.Auth & {
  __defineGetter__: any
  _vm: any
}
if (!_auth._vm) {
  _auth._vm = new Vue({
    data() {
      return {
        currentUser: _auth.currentUser !== null ? _auth.currentUser : undefined
      }
    },
    created() {
      _auth.onAuthStateChanged((user: any) => {
        this.currentUser = user
      })
    }
  })
  _auth.__defineGetter__('currentUser', () => {
    return _auth._vm.$data.currentUser
  })
  _auth.__defineGetter__('user', () => {
    return _auth._vm.$data.currentUser
  })
}

const FirebasePlugin: Plugin = (_context, inject) => {
  inject('firebase', Firebase.firebase)
  inject('app', Firebase.app)
  inject('firestore', Firebase.firestore)
  inject('storage', Firebase.storage)
  inject('functions', Firebase.functions)
  inject('auth', _auth as firebase.default.auth.Auth)
  inject('analytics', Firebase.analytics)
}

export default FirebasePlugin
