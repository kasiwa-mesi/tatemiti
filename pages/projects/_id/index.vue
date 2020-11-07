<template>
  <div class="text-center">
    <div class="py-8 px-4">
      <h1 class="text-3xl mb-2">{{ post.name }}</h1>
      <div class="chats-layout">
        <messages :messages="messages"/>
      </div>
      <button
        v-show="hasNext && messages.length >= LIMIT"
        class="bg-red-500 hover:bg-red-700 text-white font-bold h-10 w-32 rounded mt-4"
        @click="readMorePosts"
      >
        <span v-if="!isProcessing">もっと見る</span>
        <div v-else class="spinner"></div>
      </button>
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
  messages: Array<Message>
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
      hasNext: true,
      messages: []
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
        })
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
    }
  }
})
</script>

<style scoped>
.chats-layout {
    width: 50%;
    margin-left: 25%;
}
@media screen and (max-width: 768px) {
    .chats-layout {
        width: 100%;
    }
}
</style>