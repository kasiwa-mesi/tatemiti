<template>
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-8">新しいプロジェクトを作る</h1>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </p>
    <PostForm 
      v-model="postFormData"
      :is-submitting="isSubmitting"
      submit-label="作成"
      @submit="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PostFormData } from '../../types/struct'
import PostForm from '../../components/partials/PostForm.vue'
import { firebase } from '../../utils/externals/firebase'

type LocalData = {
  postFormData: PostFormData | null
  isSubmitting: Boolean
  errors: string[]
}

export default Vue.extend({
  components: {
    PostForm,
  },
  data(): LocalData {
    return {
      postFormData: {
        name: '',
      },
      isSubmitting: false,
      errors: []
    }
  },
  methods: {
    async handleSubmit(): Promise<void> {
      this.isSubmitting = true

      this.postFormData = this.postFormData as PostFormData
      if (!this.postFormData.name) {
        this.errors.push('Name required.');
      }

      this.$firestore
        .collection('projects')
        .add({
          name: this.postFormData.name,
          createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
        })
        .then((ref) => {
          this.$router.push(`/projects/${ref.id}`)
        })
    }
  }
})
</script>
