<template>
  <div :class="`relative flex flex-col gap-3 ${width}`">
    <label
      v-if="title"
      :for="id"
      class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white"
    >
      {{ title }}
    </label>
    <vField
      :id="id"
      :disabled="disabled"
      :name="name"
      v-model.lazy="proxyValue"
      type="text"
      v-money="config"
      :placeholder="placeholder"
      :class="`border px-2 text-end ${as === 'textarea' ? 'resize-none' : 'h-9'} ${
        disabled ? 'opacity-80 bg-gray-50 text-orange-400' : ''
      } h-full border-slate-400 text-orange-500 focus:border-slate-600 focus:ring-slate-600 rounded-lg leading-[1.2]`"
    />
    <v-error-message :name="name" class="text-red-500" />
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
const emit = defineEmits(["update:modelValue"]);
const config = {
  decimal: ",",
  thousands: ".",
  prefix: "",
  suffix: " Bs.",
  precision: 2,
  masked: false,
  focusOnRight: true,
};
const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
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
