<template>
  <div class="text-center">
    <div class="py-8 px-4">
      <div
        class="inline-block fixed z-100 project-title"
      >
      <h2 class="text-xs lg:text-2xl xl:text-xl md:text-lg sm:text-sm mb-2 bg-white border border-black border-solid text-black font-normal px-10">{{ post.name }}</h2>
      <div class="flex">
        <p class="text-sm border border-black bg-white text-black">
          投稿主：<nuxt-link :to="`/users/${user.id}/projects`" class="underline">
            {{ user.displayName }}
          </nuxt-link>
        </p>
        <button
          v-if="$auth.currentUser && post.userId === $auth.currentUser.uid"
          class="block mx-auto bg-transparent hover:bg-green-500 text-green-500 text-xs hover:text-white py-1 px-4 border border-green-500 hover:border-transparent rounded"
          @click="$router.push(`/projects/${post.id}/edit`)"
        >
          このプロジェクトを編集
        </button>
      </div>
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
      <div class="chats-layout mt-12">
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
        <div
        class="form-label"
        v-if="$auth.currentUser"
        >
        <!-- <p>{{ $auth.currentUser }}</p> -->
          <p v-if="errors.length">
            <b>入力内容に誤りがあります。</b>
            <ul>
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </p>
          <!-- v-ifでプロジェクト運営者かどうか判定 -->
          <!-- 画像アップロード機能を追加 -->
          <div class="input-layout">
            <ChatForm 
                v-if="$auth.currentUser.uid === post.userId"
                v-model="messageFormData"
                :is-submitting="isSubmitting"
                submit-label="作成"
                @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentNotExistError } from '../../../types/error'
import { User, Post, Message, MessageFormData } from '../../../types/struct'
import { toUser, toPost, toMessage } from '../../../utils/transformer/toObject'
import Messages from '../../../components/partials/Messages.vue'
import ChatForm from '../../../components/partials/ChatTextForm.vue'
import { firebase, firestore } from '../../../utils/externals/firebase'

const LIMIT: number = 20

type LocalData = {
  post: Post | null
  user: User | null
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
      post: null,
      user: null,
      messageFormData: {
        text: '',
        link: '',
        imageURL: ''
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
      const userDocument = await app.$firestore
        .collection('users')
        .doc(post.userId)
        .get()
      return {
        post,
        user: toUser(userDocument)
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
      const projectId: string = this.$route.params.id

      this.messageFormData = this.messageFormData as MessageFormData
      if (!this.messageFormData.text) {
        if (this.messageFormData.link && this.messageFormData.imageURL) {
          this.$firestore
            .collection('projects')
            .doc(projectId)
            .collection('messages')
            .add({
              link: this.messageFormData.link,
              image: this.messageFormData.imageURL,
              createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              if (this.messageFormData) {
                this.messageFormData.link = ''
                this.messageFormData.imageURL = ''
              }
              this.isUpdating = true
            })
        } else if (this.messageFormData.link) {
          if (this.messageFormData.link.includes('http://') || this.messageFormData.link.includes('https://')) {
            this.$firestore
              .collection('projects')
              .doc(projectId)
              .collection('messages')
              .add({
                link: this.messageFormData.link,
                createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                if (this.messageFormData) {
                  this.messageFormData.link = ''
                }
                this.isUpdating = true
              })
          } else {
            this.errors.push('URLの形式が正しくありません。');
          }
        } else if (this.messageFormData.imageURL) {
            this.$firestore
              .collection('projects')
              .doc(projectId)
              .collection('messages')
              .add({
                image: this.messageFormData.imageURL,
                createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                if (this.messageFormData) {
                  this.messageFormData.imageURL = ''
                }
                this.isUpdating = true
              })
        } else {
          this.errors.push('入力フォームが空白です。');
        }
      } else {
      if (this.messageFormData.link && this.messageFormData.imageURL) {
          this.$firestore
            .collection('projects')
            .doc(projectId)
            .collection('messages')
            .add({
              text: this.messageFormData.text,
              link: this.messageFormData.link,
              image: this.messageFormData.imageURL,
              createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              if (this.messageFormData) {
                this.messageFormData.text = ''
                this.messageFormData.link = ''
                this.messageFormData.imageURL = ''
              }
              this.isUpdating = true
            })
      } else {
        if (this.messageFormData.link) {
          if (this.messageFormData.link.includes('http://') || this.messageFormData.link.includes('https://')) {
            this.$firestore
              .collection('projects')
              .doc(projectId)
              .collection('messages')
              .add({
                text: this.messageFormData.text,
                link: this.messageFormData.link,
                createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                if (this.messageFormData) {
                  this.messageFormData.text = ''
                  this.messageFormData.link = ''
                }
                  this.isUpdating = true
              })
          } else {
            this.errors.push('URLの形式が正しくありません。');
          }
        } else if (this.messageFormData.imageURL) {
            this.$firestore
              .collection('projects')
              .doc(projectId)
              .collection('messages')
              .add({
                text: this.messageFormData.text,
                image: this.messageFormData.imageURL,
                createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                if (this.messageFormData) {
                  this.messageFormData.text = ''
                  this.messageFormData.imageURL = ''
                }
                this.isUpdating = true
              })
        } else {
            this.$firestore
              .collection('projects')
              .doc(projectId)
              .collection('messages')
              .add({
                text: this.messageFormData.text,
                createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                if (this.messageFormData) {
                  this.messageFormData.text = ''
                }
                  this.isUpdating = true
              })
        }
      }
      }
    },
    async readMorePosts(): Promise<void> {
      this.isProcessing = true
      try {
        const projectId = this.$route.params.id
        console.log(projectId)
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
  },
  head() {
    const post = this.post! as Post
    const title = `${post.name} | 継続するならタテミチ`
    const image = post.image ? `${post.image}` : `${process.env.BASE_URL}` + '/image.jpg'
    return {
      title,
      image,
      meta: [
        { property: 'og:title', hid: 'og:title', content: title },
        {
          property: 'og:url',
          hid: 'og:url',
          content: `${process.env.BASE_URL}/projects/${post.id}`
        },
        { name: 'twitter:title', hid: 'twitter:title', content: title },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image
        }
      ]
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
  left: 33%;
}

.update-listener {
  top: 16%;
  left: 33%;
}
@media screen and (max-width: 1024px) {
.project-title {
  top: 10%;
  left: 27%;
}
}
@media screen and (max-width: 768px) {
    .chats-layout {
        width: 75%;
        margin-left: 12%;
    }
    .project-title {
      top: 10%;
      left: 16%;
    }
    .update-listener {
      top: 16%;
      left: 16%;
    }
}
@media screen and (max-width: 425px) {
    .project-title {
      top: 10%;
      left: 15%;
    }
    .update-listener {
      top: 16%;
      left: 15%;
    }
}
@media screen and (max-width: 320px) {
    .project-title {
      top: 10%;
      left: 6%;
    }
    .update-listener {
      top: 16%;
      left: 6%;
    }
}

</style>