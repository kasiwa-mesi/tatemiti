<template>
  <div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <div class="mb-4">
          <nuxt-link :to="`/projects/${post.id}`">
            <div
              class="border bg-white p-4 max-w-xl text-left mx-auto hover:bg-gray-200 hover:shadow"
              :class="[
                $auth.currentUser && post.userId === $auth.currentUser.uid
                  ? 'rounded-t'
                  : 'rounded'
              ]"
            >
              <div v-if="post.image" class="w-2/3 image-wrap">
                <img :src="post.image">
              </div>
              <p class="font-bold text-gray-700">
                {{ post.name }}
              </p>
            </div>
          </nuxt-link>
          <div
            v-if="$auth.currentUser && post.userId === $auth.currentUser.uid"
          >
            <nuxt-link :to="`/projects/${post.id}/edit`">
              <div
                class="border-b border-r border-l bg-white px-4 py-1 mb-4 max-w-xl text-left mx-auto hover:bg-gray-200 hover:shadow rounded-b"
              >
                <p class="text-xs text-gray-600">
                  <i class="mdi mdi-pencil" />
                  編集
                </p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Post } from '../../types/struct'

export default Vue.extend({
  name: 'PostList',
  props: {
    posts: {
      type: Array as PropType<Post[]>,
      required: true
    }
  }
})
</script>

<style scoped>
.image-wrap {
  margin-left: 15%;
}
</style>