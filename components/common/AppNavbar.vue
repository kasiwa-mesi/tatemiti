<template>
  <header>
    <div
      class="bg-white shadow border-b border-gray-200 h-12 md:h-16 flex items-center fixed top-0 inset-x-0 z-100"
    >
      <div
        class="mx-auto w-full max-w-screen-lg flex items-center justify-between px-4 py-2"
      >
        <nuxt-link to="/">
          <span class="text-gray-900 font-bold text-sm md:text-lg">
              ミチノリ
          </span>
        </nuxt-link>
        <client-only>
          <div class="flex items-center">
            <nuxt-link
              to="/posts/create"
              class="align-middle text-gray-700 mr-6"
            >
              <i class="mdi mdi-pencil" />
              <span class="hidden md:inline">作成</span>
            </nuxt-link>
          </div>
        </client-only>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppNavbar',
  methods: {
    handleLogoClicked(): void {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>
.z-100 {
  z-index: 100;
}
</style>
