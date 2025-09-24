<template>
    <header
      :class="`flex ${!!$slots.button_title ? 'gap-x-4 pb-2' : 'justify-between'} items-center border-b-orange-500 border-b-[2px] py-1`"
    >
      <slot name="button_title" />
      <h2 class="text-2xl font-bold text-slate-800">{{ title }}</h2>
      <slot name="default" />
    </header>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        default: "Nombre del modulo",
      },
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  