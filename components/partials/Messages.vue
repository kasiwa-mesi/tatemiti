<template>
  <div class="chats-container">
    <message v-for="(message, index) in messages" :message="message" :key="index"/>
  </div>
</template>

<script>
import Message from '../partials/Message'
export default {
  props: ['messages'],
  components: {
    Message
  },
}
</script>