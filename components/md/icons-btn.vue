
<template>
  <button
    class="inline-flex items-center justify-center border font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition rounded-lg p-1 text-base w-9 h-9"
    :class="buttonClass"
    :disabled="disabled"
    :title="title"
    @click="onClick"
  >
    <component :is="iconComponent" class="w-5 h-5" />
  </button>
</template>


<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';

const props = defineProps({
  status: { type: Number, required: true },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
});
const emit = defineEmits(['click']);

const onClick = (e: Event) => {
  if (!props.disabled) emit('click', e);
};

const buttonClass = computed(() => {
  switch (props.status) {
    case 2:
      return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';
    case 4:
      return 'bg-gradient-to-br from-red-500 to-red-700 text-white';
    case 5:
      return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
    case 6:
      return 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-white';
  }
});

const IconClock = defineComponent({
  name: 'IconClock',
  setup() {
    return () => h('svg', {
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 8v4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M12 12h4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ]);
  }
});
const IconClose = defineComponent({
  name: 'IconClose',
  setup() {
    return () => h('svg', {
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5'
    }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6 18L18 6M6 6l12 12' })]);
  }
});
const IconCheck = defineComponent({
  name: 'IconCheck',
  setup() {
    return () => h('svg', {
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5'
    }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 13l4 4L19 7' })]);
  }
});
const IconMinus = defineComponent({
  name: 'IconMinus',
  setup() {
    return () => h('svg', {
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 12h8' })
    ]);
  }
});

const iconComponent = computed(() => {
  switch (props.status) {
    case 2:
      return IconClock;
    case 4:
      return IconClose;
    case 5:
      return IconCheck;
    case 6:
      return IconMinus;
  }
});
</script>
