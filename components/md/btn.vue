<template>
  <button v-if="type === 'button'" ref="btn" :class="`${$attrs.class
    ? $attrs.class
    : `${styles[variant]} drop-shadow-md text-white transition-all duration-300 bg-size-200 bg-pos-0 hover:bg-pos-100 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mb-1`
    }  ${height} ${width}`" :disabled="loading" v-bind="$attrs">
    <span :class="`flex justify-center items-center text-white text-lg leading-none font-bold`">
      <svg-spinner-button class="w-[1.125rem] h-[1.125rem]" v-if="loading" />
      <slot v-else name="default" />
    </span>
  </button>
  <NuxtLink v-if="type === 'link'" ref="btn" :to="to" :class="`${$attrs.class
    ? $attrs.class
    : 'drop-shadow-md text-white transition-all duration-300 via-slate-500 bg-size-200 bg-pos-0 hover:bg-pos-100 bg-gradient-to-br from-slate-900 to-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-200  font-medium rounded-lg text-sm px-4 py-2 text-center mb-1'
    }`" v-bind="$attrs">
    <span :class="`${width} py-1 flex justify-center text-white text-lg leading-none font-bold`">
      <slot name="default" />
    </span>
  </NuxtLink>
  <NuxtLink v-if="type === 'rounded-link'" ref="btn" :to="to" :class="`${$attrs.class
    ? $attrs.class
    : 'drop-shadow-md text-white transition-all duration-300 via-orange-500 bg-size-200 bg-pos-0 hover:bg-pos-100 bg-gradient-to-br from-orange-700 to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-200  font-medium rounded-full text-sm px-1 text-center '
    }`" v-bind="$attrs">
    <span :class="`${width} text-white text-lg font-bold`">
      <slot name="default" />
    </span>
  </NuxtLink>
</template>

<script lang="ts">
type button = "button" | "link" | "anchor" | "rounded-link";
export default {
  setup() {
    const styles = {
      normal: "via-slate-500 bg-gradient-to-br from-slate-900 to-slate-600 focus:ring-slate-200",
      red: "via-red-500 bg-gradient-to-br from-red-900 to-red-600 focus:ring-red-200",
      danger: "via-red-500 bg-gradient-to-br from-red-900 to-red-600 focus:ring-red-200",
      warning: "via-red-500 bg-gradient-to-br from-red-900 to-red-600 focus:ring-red-200",
      success: "via-green-500 bg-gradient-to-br from-green-800 to-green-600 focus:ring-green-200",
      orange: "via-orange-500 bg-gradient-to-br from-orange-700 to-orange-600 focus:ring-orange-200",
      yellow: "via-yellow-500 bg-gradient-to-br from-yellow-800 to-yellow-600 focus:ring-yellow-200",
    };
    return { styles };
  },
  props: {
    type: {
      type: String as PropType<button>,
      default: "button",
    },
    variant: {
      type: String as keyof typeof this.styles,
      default: "normal",
    },
    to: {
      type: String,
      default: "#",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
  },
};
</script>
