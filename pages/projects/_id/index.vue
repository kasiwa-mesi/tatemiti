<template>
  <div class="text-center">
    <div class="py-8 px-4">
      <h1 class="text-3xl mb-2">{{ post.name }}</h1>
      <div class="chats-layout">
        <messages :messages="messages"/>
      </div>
      <div class="input-layout">
        <chat-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentNotExistError } from '../../../types/error'
import { Post } from '../../../types/struct'
import { toPost } from '../../../utils/transformer/toObject'
import Messages from '../../../components/partials/Messages.vue'
import ChatForm from '../../../components/partials/ChatForm.vue'

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
      await app.$firestore
        .collection('projects')
        .doc(id)
        .collection('messages')
        .where('text', '==', 'おぎやはぎ')
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            return;
            }

            snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
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
