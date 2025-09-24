<template>
  <div
    :class="[
      hidden,
      positions[position],
      'duration-300 overflow-y-auto overflow-x-hidden fixed w-full inset-0 h-full max-h-full',
    ]"
  >
    <div
      :class="[
        'relative w-full mx-5 md:mx-10 max-h-full',
        'overflow-hidden z-50 transform transition-all',
        { 'rounded-lg': !flat },
        sizes[size],
        opacity,
      ]"
    >
      <div class="relative bg-white shadow rounded-t-xl">
        <!-- Modal header -->
        <div
          :class="[
            styles[type].bg,
            'flex items-center justify-between p-4 md:p-5',
          ]"
        >
          <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-7 text-white">
              {{ title }}
            </h3>
            <p
              v-if="subtitle"
              class="mt-1 max-w-2xl text-sm leading-6 text-gray-100"
            >
              {{ subtitle }}
            </p>
          </div>
          <button
            type="button"
            :class="[
              styles[type].close,
              'rounded-lg hover:bg-white text-white transition-colors text-sm w-8 h-8 ms-auto inline-flex justify-center items-center',
            ]"
            @click="$emit('update:modelValue', false)"
          >
            <svg-close class="w-8" />
          </button>
        </div>
        <!-- Modal body -->
        <div
          class="p-4 md:p-6 text-black max-h-[70vh] overflow-y-auto"
          :id="id"
        >
          <slot />
        </div>
        <!-- Modal footer -->
        <slot v-if="!!$slots.footer" name="footer" />
        <div
          v-else
          class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 dark:border-gray-600"
        >
          <km-btn
            type="button"
            rounded="full"
            @click="$emit('update:modelValue', false)"
          >
            Cerrar
          </km-btn>
        </div>
      </div>
    </div>

    <div
      :class="[
        opacity,
        'transition-opacity backdrop-blur-sm bg-slate-800/50 absolute z-40 w-full h-full',
      ]"
      @click="() => bg_exit && $emit('update:modelValue', false)"
    ></div>
  </div>
</template>

<script lang="ts">
type Type = "success" | "warning" | "info" | "danger";

type sizeType = "xs" | "sm" | "md" | "lg" | "xl";
type positionModal =
  | "top-left"
  | "top-right"
  | "top-center"
  | "center-left"
  | "center-center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export default {
  data() {
    return {
      styles: {
        success: {
          bg: "bg-green-800",
          close: "hover:text-green-800",
        },
        warning: {
          bg: "bg-yellow-800",
          close: "hover:text-yellow-800",
        },
        info: {
          bg: "bg-slate-800",
          close: "hover:text-slate-800",
        },
        danger: {
          bg: "bg-red-800",
          close: "hover:text-red-800",
        },
      },
      sizes: {
        xs: "max-w-[250px]",
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-7xl",
      },
      positions: {
        "top-left": "justify-start items-start",
        "top-right": "justify-end items-start",
        "top-center": "justify-center items-start",
        "bottom-left": "justify-start items-end",
        "bottom-right": "justify-end items-end",
        "bottom-center": "justify-center items-end",
        "center-left": "justify-start items-center",
        "center-right": "justify-end items-center",
        "center-center": "justify-center items-center",
      },
      hidden: "hidden",
      opacity: "opacity-0",
    };
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.hidden = "flex";
        setTimeout(() => {
          this.opacity = "";
          this.scale = "";
        }, 100);
      } else {
        setTimeout(() => {
          this.hidden = "hidden";
          this.opacity = "opacity-0";
        }, 100);
      }
    },
  },
  props: {
    id: {
      type: String,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
    },
    size: {
      type: String as PropType<sizeType>,
      default: "sm",
    },
    position: {
      type: String as PropType<positionModal>,
      default: "center-center",
    },
    type: {
      type: String as PropType<Type>,
      default: "info",
    },
    bg_exit: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
