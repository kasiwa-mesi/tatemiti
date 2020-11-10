<template>
  <div class="chat-container">
    <div class="message-container">
      <!-- <div v-if="isURL" class="message text-left whitespace-pre-wrap">
        <a :href="message.text" class="text-blue-400">{{ message.text }}</a>
      </div> -->
      <div class="message text-left whitespace-pre-wrap">
          {{ message.text }}
      </div>
      <div v-show="message.link" class="message text-left whitespace-pre-wrap">
        <a target='_blank' :href="message.link" class="text-blue-400">{{ message.link }}</a>
      </div>
      <img :src="message.image">
      <div class="message text-left mt-2 text-gray-500">
        {{ message.createdAt | datetime }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type LocalData = {
  isSameDay: Boolean
  isURL: Boolean
  url: string
}

export default Vue.extend ({
  props: ['message'],
  data(): LocalData {
    return {
      isSameDay: true,
      isURL: false,
      url: ''
    }
  },
  filters: {
      datetime(date) {
          const day = date.getDate()
          const monthIndex = date.getMonth()
          const year = date.getFullYear()
          const hour = date.getHours()
          const minutes = date.getMinutes()

          return `${year}/${monthIndex + 1}/${day} ${hour}:${minutes}`
      },
      //message.textのhttps://で自動リンクをつける
      // setURL(text) {
      //   text = text.replace(/(http(s)?:\/\/[\x21-\x7e]+)/gi, "<a href='$1' target='_blank'>$1</a>");
      //   // text = text.replace(/(http(s)?:\/\/[\x21-\x7e]+)/gi, "$1");
      //   if (text.includes('http://' || 'https://')) {
      //     // this.isURL = true
      //     return text;
      //   } else {
      //     return text;
      //   }
      // }
  }
})
</script>