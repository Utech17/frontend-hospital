<template>
  <dl
    v-if="!loading"
    :class="[
      '@container',
      orientation === 'vertical'
        ? 'divide-y divide-gray-200'
        : 'flex gap-4 w-full',
      $attrs.class,
    ]"
  >
    <div
      v-for="([key, value], i) in Object.entries(list)"
      :key="i"
      :class="[
        $attrs.class ? $attrs.class : 'p-3',
        '@sm:grid @sm:grid-cols-2  @md:grid-cols-3 sm:gap-1 sm:px-1 w-full',
      ]"
    >
      <dt
        :class="[
          orientation === 'horizontal' ? 'col-span-3' : '',
          text_align.dt,
          'text-sm leading-6 tracking-wide uppercase text-gray-950',
        ]"
      >
        {{ key }}
      </dt>
      <dd
        :class="[
          'mt-1 text-sm leading-6 text-gray-700 w-full break-words',
          text_align.dd,
          orientation === 'vertical'
            ? '@sm:col-span-1 @md:col-span-2 @md:mt-0'
            : 'col-span-3 mt-0',
        ]"
      >
        {{ value }}
      </dd>
    </div>
  </dl>
  <km-skeleton-details v-else :columns="columns" :orientation="orientation" />
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Number,
      default: 5,
    },
    orientation: {
      type: String,
      default: "vertical",
    },
    text_align: {
      type: Object,
      default: () => {
        return { dt: "text-left", dd: "text-left" };
      },
    },
  },
};
</script>
