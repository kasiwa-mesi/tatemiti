<template>
  <div class="text-center">
    <div class="py-8 px-4">
      <div
        class="inline-block fixed z-100 project-title"
      >
      <h2 class="text-3xl mb-2 bg-white border border-black border-solid text-black font-normal px-10">{{ post.name }}</h2>
      </div>
      <div class="update-listener inline-block fixed z-100">
        <button 
          v-if="isUpdating"
          class="border border-teal-500 text-teal-500 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-teal-600 focus:outline-none focus:shadow-outline"
          @click="readUpdatingPosts"
        >
          最新の投稿があります。
        </button>
      </div>
      <div class="chats-layout">
        <messages :messages="messages"/>
      </div>
      <button
        v-show="hasNext && messages.length >= LIMIT"
        class="bg-green-500 hover:bg-green-700 text-white font-bold h-10 w-32 rounded mt-4"
        @click="readMorePosts"
      >
        <span v-if="!isProcessing">もっと見る</span>
        <div v-else class="spinner"></div>
      </button>
      <p v-if="errors.length">
        <b>入力内容に誤りがあります。</b>
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </p>
      <!-- v-ifでプロジェクト運営者かどうか判定 -->
      <div class="input-layout">
        <ChatForm 
            v-model="messageFormData"
            :is-submitting="isSubmitting"
            submit-label="作成"
            @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentNotExistError } from '../../../types/error'
import { Post, Message, MessageFormData } from '../../../types/struct'
import { toPost, toMessage } from '../../../utils/transformer/toObject'
import Messages from '../../../components/partials/Messages.vue'
import ChatForm from '../../../components/partials/ChatTextForm.vue'
import { firebase, firestore } from '../../../utils/externals/firebase'

const LIMIT: number = 20

type LocalData = {
//   post: Post | null
  messageFormData: MessageFormData | null
  isSubmitting: Boolean
  hasNext: boolean
  isProcessing: Boolean
  isUpdating: Boolean
  messages: Array<Message>
  errors: string[]
}

export default Vue.extend({
  components: {
    ChatForm,
  },
  data(): LocalData {
    return {
      messageFormData: {
        text: '',
      },
      isSubmitting: false,
      isProcessing: false,
      isUpdating: false,
      hasNext: true,
      messages: [],
      errors: []
    }
  },
  computed: {
    LIMIT(): number {
      return LIMIT
    }
  },
  async created () {
      const projectId = this.$route.params.id
      const messageDocument = await firestore
        .collection('projects')
        .doc(projectId)
        .collection('messages')
        .orderBy('createdAt', "desc")
        .limit(LIMIT)
        .get()
      //   .onSnapshot((snapshot) => {
      //   snapshot.docChanges().forEach((change) => {
      //     const doc = change.doc
      //     if (change.type === 'added') {
      //       this.messages.push({id: doc.id, text: doc.data().text, createdAt: doc.data().createdAt})
      //     }
      //   })
      // })
        this.messages = messageDocument.docs.map(
          (messageDocument): Message => {
            return toMessage(messageDocument)
          }
        )
  },
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
  methods: {
    async handleSubmit(): Promise<void> {
      this.isSubmitting = true

      this.messageFormData = this.messageFormData as MessageFormData
      if (!this.messageFormData.text) {
        this.errors.push('入力フォームが空白です。');
      } else {
      const projectId = this.$route.params.id
      this.$firestore
        .collection('projects')
        .doc(projectId)
        .collection('messages')
        .add({
          text: this.messageFormData.text,
          createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            this.messageFormData.text = ''
            this.isUpdating = true
        })
      }
    },
    async readMorePosts(): Promise<void> {
      this.isProcessing = true
      try {
        const projectId = this.$route.params.id
        const messageDocument = await firestore
            .collection('projects')
            .doc(projectId)
            .collection('messages')
            .orderBy('createdAt', "desc")
            // .orderBy('createdAt', "asc")
            .startAfter(this.messages[this.messages.length - 1].createdAt)
            // .endBefore(this.messages[0].createdAt)
            .limit(LIMIT)
            .get()
        const messages = messageDocument.docs.map(
          (messageDocument): Message => {
            return toMessage(messageDocument)
          }
        )
        this.messages = [...this.messages, ...messages]
        this.hasNext = messages.length === LIMIT
      } catch (e) {
      } finally {
        this.isProcessing = false
      }
    },
    async readUpdatingPosts(): Promise<void> {
      window.location.reload()
    }
  }
})
</script>

<style scoped>
.chats-layout {
    width: 50%;
    margin-left: 25%;
}
.project-title {
  top: 10%;
  left: 40%;
}

.update-listener {
  top: 16%;
  left: 42%;
}
@media screen and (max-width: 768px) {
    .chats-layout {
        width: 75%;
        margin-left: 12%;
    }
    .project-title {
      top: 10%;
      left: 31%;
    }
    .update-listener {
      top: 16%;
      left: 33%;
    }
}
@media screen and (max-width: 425px) {
    .project-title {
      top: 10%;
      left: 17%;
    }
    .update-listener {
      top: 16%;
      left: 19%;
    }
}
@media screen and (max-width: 320px) {
    .project-title {
      top: 10%;
      left: 8%;
    }
    .update-listener {
      top: 16%;
      left: 10%;
    }
}

</style>