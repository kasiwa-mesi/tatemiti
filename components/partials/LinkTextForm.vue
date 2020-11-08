<template>
    <form @submit.prevent="handleSubmit">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        参考リンク
      </label>
      <div class="form-label mt-5">
        <input class="shadow appearance-none border border-grey-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        placeholder="https://example.com"
        v-model="postFormData.link"
        >
      </div>
      <button
        class="block mx-auto bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-1 px-4 border border-green-500 hover:border-transparent rounded"
      >
      <i class="mdi mdi-pencil mr-1" />
        作成
      </button>
    </form>
</template>