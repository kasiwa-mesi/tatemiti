<template>
    <form @submit.prevent="handleSubmit" class="container form-label">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            入力フォーム
        </label>
        <textarea class=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" 
        id="message"
        v-model="messageFormData.text"
        >
        </textarea>
        <div class="flex flex-col">
          <div class="flex">
            <input class="mt-1 mr-1" type="checkbox" id="checkbox" v-model="linkChecked">
            <label for="checkbox">urlを参照する。</label>
          </div>
          <div v-if="linkChecked">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              参考リンク
            </label>
            <div class="form-label mt-5">
              <input class="shadow appearance-none border border-grey-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              placeholder="ex)https://example.com"
              v-model="messageFormData.link"
              >
            </div>
          </div>
          <div class="flex">
            <input class="mt-1 mr-1" type="checkbox" id="checkbox" v-model="uploadChecked">
            <label for="checkbox">画像を投稿する</label>
          </div>
          <div v-if="uploadChecked">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              画像アップロード
            </label>
            <div class="form-label mt-5">
              <input type="file" @change="fileUpload" />
            </div>
          </div>
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
import { MessageFormData } from '../../types/struct'

export default Vue.extend({
  data() {
    return {
      linkChecked: false,
      uploadChecked: false,
    };
  },
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
    async fileUpload(event) {
      let file = event.target.files[0];
      const storageRef = this.$storage.ref("user/" + this.$auth.currentUser.uid + "/" + file.name);
      const snapshot = await storageRef.put(file)
      const url = await snapshot.ref.getDownloadURL()
      this.messageFormData.imageURL = url
      // console.log(url)
      // storageRef.put(file).then(() => {
      //   console.log('uploaded file')
      // });
    }
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