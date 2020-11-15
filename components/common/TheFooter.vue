<template>
  <div class="w-full bg-green-500 py-8 text-white text-center">
    <p class="font-semibold text-center pb-5">©︎ タテミチ</p>
    <div class="flex information-wrap pb-4">
      <p class="font-mono">開発・運営</p>
      <a target="_blank" class="ml-2 underline" href="https://twitter.com/kasiwa9494">@kasiwa9494</a>
    </div>
    <div class="information-wrap flex pb-4">
      <a class="underline" href="/agreement">利用規約</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TheFooter'
})
</script>

<style scoped>
.information-wrap {
  margin-left: 43%;
}
@media screen and (max-width: 768px) {
  .information-wrap {
    margin-left: 38%;
  }
}
@media screen and (max-width: 425px) {
  .information-wrap {
    margin-left: 25%;
  }
}
</style>