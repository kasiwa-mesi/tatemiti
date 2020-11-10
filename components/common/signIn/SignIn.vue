<template>
  <div>
    <client-only>
      <slot
        v-if="!$auth.currentUser"
        :signIn="signIn"
        :isProcessing="isProcessing"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
type LocalData = {
  isProcessing: Boolean
}
export default Vue.extend({
  data(): LocalData {
    return {
      isProcessing: false
    }
  },
  methods: {
    async signIn(): Promise<void> {
      this.isProcessing = true
      const provider =  new this.$firebase.default.auth.GoogleAuthProvider()
      const result = await this.$auth.signInWithPopup(provider)
      if (result.user) {
        await this.$firestore
          .collection('users')
          .doc(result.user.uid)
          .set({
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL as string
          })
        location.reload()
      }
    }
  }
})
</script>