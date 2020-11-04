<template>
  <div class="chat-container">
    <div class="message-container">
      <div class="message">{{ messages.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      message: {
        text: '今日も良い天気ですね',
        user: {
          thumbnail: 'https://pbs.twimg.com/profile_images/1131882065337602049/0JRUGd3S_400x400.jpg',
          name: 'note'
        }
      }
    }
  },
}
</script>