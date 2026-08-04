<template>
  <div class="bg-gray-200 w-full h-screen flex flex-col items-center justify-center">
    <!-- wrapper -->
    <div class="bg-white h-[90%] w-[80%] rounded-md p-5">
      <!-- chat header -->
      <div class="w-full h-[15%] flex items-center bg-gray-300 px-2 gap-2">
        <div class="w-12 h-12 rounded-full bg-gray-400"></div>
        <div class="w-[90%] h-full flex justify-between items-center">
          <!-- group id -->
          <div class="h-full w-[60%] flex justify-between items-center">
            <input v-model="roomId" type="text" class="w-[80%] bg-gray-200 h-[60%] px-2 outline-none"
              placeholder="Enter group ID">
            <button @click.prevent="joinGroup"
              class="w-[15%] h-[60%] bg-blue-400 cursor-pointer text-xl text-white">Join</button>
          </div>
          <p>My ID: {{ senderId }}</p>
        </div>
      </div>
      <!-- chat body -->
      <div v-if="messages.length != 0" class="h-[70%] bg-gray-100 px-2 py-5 w-full flex flex-col overflow-y-auto">
        <!-- container for each message -->
        <div v-for="message in messages" class="bg-gray-100 w-full mb-3 flex flex-col">
          <div v-if="message.senderId == senderId"
            class="w-100 px-3 py-2 self-end rounded-s-lg rounded-t-lg bg-blue-500 text-white">
            {{ message.message }}
          </div>
          <p v-else-if="message.senderId == 'inChatNotification'" class="self-center">
            {{ message.message }}
          </p>
          <div v-else class="px-3 text-gray-700 rounded-t-lg rounded-e-lg py-2 ab w-100 bg-blue-200 ">
            {{ message.senderId }}: {{ message.message }}
          </div>
        </div>


      </div>

      <div v-else class="h-[70%] bg-gray-100 px-2 py-5 w-full flex items-center justify-center text-gray-800">
        No New Messages
      </div>
      <p>{{ activity }}</p>
      <!-- chat footer -->
      <div class="h-[15%] w-full ">
        <form @submit.prevent="sendMessage(senderId, messageValue, roomId)"
          class="w-full h-full flex items-center justify-evenly">
          <input @keydown="handleKeyDown" class="w-[80%] bg-gray-200 h-[70%] px-2 outline-none" type="text"
            placeholder="Enter message...." v-model="messageValue">
          <button class="w-[15%] h-[70%] bg-blue-400 cursor-pointer text-xl text-white">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { io } from 'socket.io-client';


// web socket - (socket.io) initialization
const socket = io("http://localhost:3000")



const messageValue = ref("")
const roomId = ref("")
const activity = ref("")


const senderId = ref("")

socket.on("connect", () => {
  senderId.value = socket.id.substring(0, 5)
})

const messages = ref([

])

// send message
const sendMessage = (senderId, message, roomId = "") => {
  if (!senderId || !message) {
    return
  }

  // broadcast it using socket
  if (roomId.trim() == "") {
    socket.emit("send-message", { senderId: senderId, message: message })
  } else {
    socket.emit("to-room", {
      senderId: senderId,
      message: message,
      roomId: roomId
    })
  }


  messageValue.value = ""
}

const joinGroup = () => {
  console.log(roomId.value)

  // request to join group
  socket.emit("join-group", roomId.value)
}

// key down
const handleKeyDown = () => {
  socket.emit("keydown", socket.id.substring(0, 5))
}

let timeout

// recieve activity
socket.on("keydown", (name) => {
  activity.value = `${name} is typing...`

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    activity.value = ""
  }, 2000)
})

// recieve messages from broadast
socket.on("message", (data) => {
  activity.value = ""

  messages.value.push({
    senderId: data.senderId,
    message: data.message
  })
})

// recieve chat notification
socket.on("chat-notification", (data) => {
  messages.value.push({
    senderId: data.senderId,
    message: data.message
  })
})

</script>

<style scoped></style>