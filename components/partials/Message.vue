<template>
  <div class="chat-container">
    <div class="message-container">
      <div class="message text-left mt-4 whitespace-pre-wrap">{{ message.text }}</div>
      <!-- <div class="message text-left mt-4 text-gray-500">{{ message.createdAt.toDate() | datetime }}</div> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type LocalData = {
  isSameDay: Boolean
}

export default Vue.extend ({
  props: ['message'],
  data(): LocalData {
    return {
      isSameDay: true,
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
      }
  }
})
</script>