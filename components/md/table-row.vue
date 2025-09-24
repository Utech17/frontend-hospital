<template>
  <tr
    :class="`h-[40px]   ${
      props.styles
        ? props.styles
        : 'odd:bg-white even:bg-gray-100 group hover:bg-slate-200'
    }`"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
const props = defineProps({
  styles: {
    type: String,
    defatul: "",
  },
});
</script>
