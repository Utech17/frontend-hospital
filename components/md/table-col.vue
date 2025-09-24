<template>
  <th
    scope="col"
    :class="`h-[35px] ${props.styles ? props.styles : 'px-6 py-2'}`"
  >
    <slot name="default" />
  </th>
</template>

<script setup lang="ts">
const props = defineProps({
  styles: {
    type: String,
    default: "",
  },
});
</script>
