<template>
  <div class="text-center">
    <div class="border border-gray-400 rounded py-8 px-4">
      <h1 class="text-3xl mb-2">{{ post.name }}</h1>
      <p class="text-gray-800 mb-2">{{ post.createdAt }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentNotExistError } from '../../../types/error'
import { Post } from '../../../types/struct'
import { toPost } from '../../../utils/transformer/toObject'

type LocalData = {
  post: Post | null
}

export default Vue.extend({
  async asyncData({ app, params: { id }, error }) {
    try {
      const postDocument = await app.$firestore
        .collection('projects')
        .doc(id)
        .get()
      const post = toPost(postDocument)
      return {
        post,
      }
    } catch (e) {
      if (e instanceof DocumentNotExistError) {
        error({
          statusCode: 404,
          message: 'ページが見つかりませんでした'
        })
      }
    }
  },
})
</script>
