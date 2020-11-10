<template>
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-8">新しいプロジェクトを作る</h1>
    <p v-if="errors.length">
      <b>入力内容に誤りがあります。</b>
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
    <aside
      v-show="!$auth.currentUser"
      class="w-full h-full fixed left-0 top-0 bg-gray-800 bg-opacity-75 rounded z-50 flex items-center justify-center"
    >
      <div class="bg-white p-10 rounded">
        <p class="font-bold">ログインしてプロジェクトをつくろう</p>
        <p class="mb-8 mt-1 text-gray-600">作成にはログインが必要です</p>
        <SignInButton class="mb-4" />
        <nuxt-link to="/" class="text-xs underline text-green-600">
          トップへ
        </nuxt-link>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PostFormData } from '../../types/struct'
import PostForm from '../../components/partials/PostForm.vue'
import SignInButton from '~/components/common/signIn/SignInButton.vue'
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
        this.errors.push('入力フォームが空白です。');
      } else {
      if (this.$auth.currentUser) {
        this.$firestore
          .collection('projects')
          .add({
            name: this.postFormData.name,
            createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
            userId: this.$auth.currentUser.uid,
          })
          .then((ref) => {
            this.$router.push(`/projects/${ref.id}`)
          })
      } else {
        this.$firestore
          .collection('projects')
          .add({
            name: this.postFormData.name,
            createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
          })
          .then((ref) => {
            this.$router.push(`/projects/${ref.id}`)
          })
      }
      }
    }
  }
})
</script>
