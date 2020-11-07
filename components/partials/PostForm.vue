<template>
    <form @submit.prevent="handleSubmit">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        プロジェクト名
      </label>
      <div class="form-label mt-5">
        <input class="shadow appearance-none border border-grey-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        placeholder="プロジェクト名"
        v-model="postFormData.name"
        >
      </div>
    <button
      class="block mx-auto bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-1 px-4 border border-green-500 hover:border-transparent rounded"
    >
      <i class="mdi mdi-pencil mr-1" />
      作成
    </button>
    </form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { PostFormData } from '../../types/struct'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<PostFormData>,
      required: true
    },
    submitLabel: {
      type: String,
      required: true
    },
    isSubmitting: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    postFormData: {
      get(): PostFormData {
        return this.value
      },
      set(value: PostFormData) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    handleSubmit(): void {
      this.$emit('submit')
    },
  }
})
</script>

<style scoped>
.form-label {
    width: 50%;
    margin-left: 24%;
    justify-content: center;
}
</style>