<template>
  <div :class="['relative flex flex-col gap-3', width]">
    <label v-if="title" :for="id" class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white">
      {{ title }}
    </label>
    <div v-if="$slots.icon && type === 'text'"
      class="absolute top-[39px] end-3 flex items-center ps-3.5 pointer-events-none text-orange-500 tracking-wide">
      <slot name="icon" />
    </div>

    <div v-if="type === 'password'"
      class="absolute top-[39px] end-3 flex items-center cursor-pointer text-slate-500 tracking-wide"
      @click="showPassword = !showPassword">
      <svg-eye-slash v-if="showPassword" class="w-6 h-6" />
      <svg-eye v-else class="w-6 h-6" />
    </div>
    <vField :id="id" :as="as" :rows="rows" :disabled="disabled" :name="name" v-model="proxyValue" :type="inputType"
      :placeholder="placeholder" :class="[
        $attrs.class,
        as === 'textarea' ? 'resize-none' : 'h-9',
        disabled ? 'opacity-80 bg-gray-50 text-orange-400' : '',
        'px-2',
        'text-orange-500 leading-[1.2]',
        'border border-slate-400 rounded-lg focus:border-slate-600 focus:ring-slate-600 ring-0',
      ]" />

    <v-error-message :name="name" class="text-red-500" />
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
const emit = defineEmits(["update:modelValue"]);
const showPassword = ref(false);
const inputType = computed(() => {
  return props.type !== "password" || showPassword.value ? "text" : "password";
});
const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
const props = defineProps({
  as: {
    type: String,
    default: "input",
  },
  rows: {
    type: Number,
    default: 4,
  },
  placeholder: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "w-full",
  },
  modelValue: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const id = uuidv4();
</script>
