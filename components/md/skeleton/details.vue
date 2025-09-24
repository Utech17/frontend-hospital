<template>
  <div class="@container">
    <dl
      :class="[
        orientation === 'vertical'
          ? 'divide-y divide-gray-200'
          : 'flex gap-4 w-full flex-wrap @sm:flex-nowrap',
        'animate-pulse',
      ]"
    >
      <div
        v-for="i in columns"
        :key="i"
        :class="[
          $attrs.class ? $attrs.class : 'p-3',
          '@sm:grid @sm:grid-cols-2  @md:grid-cols-3 sm:gap-1 sm:px-0 w-full',
        ]"
      >
        <dt
          :class="[
            orientation === 'horizontal' ? '@sm:col-span-3' : '',
            'flex text-sm leading-6 tracking-wide uppercase text-gray-950',
          ]"
        >
          <div class="h-2.5 w-[40%] bg-gray-400 rounded-full"></div>
        </dt>
        <dd
          :class="[
            'mt-1 text-sm leading-6 text-gray-700 w-full',
            orientation === 'vertical'
              ? '@sm:col-span-1 @md:col-span-2 @md:mt-0'
              : 'col-span-3 mt-0',
          ]"
        >
          <div class="h-2 w-[80%] mb-2.5 bg-gray-300 rounded-full"></div>
          <div class="h-2 w-[60%] bg-gray-300 rounded-full"></div>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  methods: {
    randItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    },
  },
  props: {
    columns: {
      type: Number,
      default: 5,
    },
    orientation: {
      type: String,
      default: "vertical",
    },
  },
};
</script>
