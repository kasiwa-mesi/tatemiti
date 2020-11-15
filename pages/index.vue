<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-900">タテミチ</h1>
    <ButtonPostCreate class="mt-12" />
    <h2 class="text-xl font-bold mt-12">みんなのプロジェクト</h2>
    <PostList :posts="posts" class="mt-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import app from '../plugins/firebase'
import PostList from '../components/partials/PostList.vue'
import ButtonPostCreate from '../components/partials/ButtonPostCreate.vue'
import { Post } from '../types/struct'
import { toPost } from '../utils/transformer/toObject'

type LocalData = {
  hasNext: boolean
  isProcessing: boolean
  posts: Post[]
}

export default Vue.extend({
  components: {
    PostList,
  },
  async asyncData({ app }) {
    const postDocuments = await app.$firestore
      .collection('projects')
      .get()
    const posts = postDocuments.docs.map(
      (postDocument): Post => {
        return toPost(postDocument)
      }
    )
    return {
      posts
    }
  },
  head() {
    return {
      meta: [
        { property: 'og:title', hid: 'og:title', content: 'タテミチ' },
        {
          property: 'og:url',
          hid: 'og:url',
          content: `${process.env.BASE_URL}`
        },
        { name: 'twitter:title', hid: 'twitter:title', content: 'タテミチ' },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${process.env.BASE_URL}` + '/image.jpg'
        }
      ]
    }
  }
})
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
</style>
