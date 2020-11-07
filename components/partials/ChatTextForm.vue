<template>
    <form @submit.prevent="handleSubmit" class="container form-label">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            Message
        </label>
        <textarea class=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" 
        id="message"
        v-model="messageFormData.text"
        >
        </textarea>
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
import { MessageFormData } from '../../types/struct'

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<MessageFormData>,
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
    messageFormData: {
      get(): MessageFormData {
        return this.value
      },
      set(value: MessageFormData) {
        this.$emit('textarea', value)
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
    margin-left: 25%;
}
@media screen and (max-width: 480px) {
.form-label {
    width: 100%;
    margin-left: 0;
}
}
</style>