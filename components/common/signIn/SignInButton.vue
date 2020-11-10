<template>
  <sign-in>
    <template v-slot:default="{ signIn, isProcessing }">
      <button
        class="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
        @click="signIn()"
      >
        <template v-if="!isProcessing">
          ログイン
        </template>
        <template v-else>
          <div class="spinner h-6 w-16" />
        </template>
      </button>
    </template>
  </sign-in>
</template>

<script>
import signIn from '../signIn/SignIn'
export default {
  components: {
    signIn
  }
}
</script>