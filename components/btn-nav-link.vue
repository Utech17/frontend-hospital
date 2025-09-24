<template>
  <NuxtLink :to="to"
    class="text-xs flex justify-center items-center w-fit h-fit px-3 transition duration-200 hover:border-b-white hover:border-b-[1px]">
    <slot name="default" />
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    default: "/dashboard/"
  }
});
</script>

<style lang="scss" scoped></style>
