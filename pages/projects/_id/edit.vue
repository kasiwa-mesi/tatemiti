<template>
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-8">{{ post.name }}を編集</h1>
    <PostForm
      v-model="postFormData"
      :is-submitting="isSubmitting"
      submit-label="更新"
      @submit="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentNotExistError } from '~/types/error'
import { PostFormData, Post } from '~/types/struct'
import { toPost, toPostFormData } from '~/utils/transformer/toObject'
import PostForm from '~/components/partials/PostForm.vue'
type LocalData = {
  post: Post | null
  postFormData: PostFormData | null
  isSubmitting: Boolean
}
export default Vue.extend({
  components: {
    PostForm
  },
  async asyncData({ app, params: { id }, error }) {
    try {
      const postDocument = await app.$firestore
        .collection('projects')
        .doc(id)
        .get()
      const post: Post = toPost(postDocument)
      const postFormData: PostFormData = toPostFormData(post)
      return {
        post,
        postFormData
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
  data(): LocalData {
    return {
      post: null,
      postFormData: null,
      isSubmitting: false
    }
  },
  methods: {
    async handleSubmit(): Promise<void> {
      this.isSubmitting = true
      this.postFormData = this.postFormData as PostFormData

      this.$firestore
        .collection('projects')
        .doc((this.post as Post).id)
        .set({
          name: this.postFormData.name,
          image: this.postFormData.imageURL,
          userId: this.$auth.currentUser.uid,
          createdAt: (this.post as Post).createdAt
        })
        .then(() => {
          this.$router.push(`/projects/${(this.post as Post).id}`)
        })
    }
  }
})
</script>