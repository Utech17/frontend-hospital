<template>
  <div class="tree-contain">
    <details :disabled="disabled">
      <summary tabindex="-1">{{ title }}</summary>
      <div class="folder">
        <slot v-if="$slots.last_child" class="relative" name="last_child" />
        <slot v-else />
      </div>
    </details>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  setup() {
    const id = uuidv4();
    return { id };
  },
  props: {
    title: {
      type: String,
      default: "Nombre",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
details[disabled="true"] summary,
details.disabled summary {
  pointer-events: none;
  user-select: none;
  background: #34383d;
}
.tree-contain {
  position: relative;
}
details {
  width: auto;
  height: auto;
  overflow: hidden;
  max-height: 2.5em !important;
  transition: all 0.4s ease;
}
details > summary {
  position: relative;
  margin-top: 0.4em;
  color: white;
  font-weight: bold;
  padding: 0.1em 0.5em 0.2em;
  background: #1e293b;
  border-radius: 5px;
}
details > summary:before {
  content: "⊞";
  color: white;

  margin-right: 0.5em;
}
details[open] > summary {
  background: #f97316;
  color: white;
}
details[open] > summary:before {
  content: "⊟";
  color: white;
}
details summary::-webkit-details-marker,
details summary::marker {
  display: none;
  content: "";
}
.folder {
  position: relative;
  margin: 0 0 0.5em 0.86em;
  padding: 0 0em 0.5em 0.5em;
}
.folder > p {
  position: relative;
  font-weight: bold;
  padding: 0 0.5em 0 0.2em;
}
.folder > * {
  position: relative;
  /* padding-left: 5px; */
}

details[open] {
  height: auto;
  max-height: 99em !important;
  transition: all 1.2s ease;
}

details:not([open]) .folder {
  height: 0 !important;
  max-height: 0 !important;
  transition: all 1.2s ease;
}

.folder > *:before {
  content: "";
  counter-increment: item;
  position: absolute;
  left: -5px;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  width: 12px;
  height: 16px;
}
.folder > *:after {
  position: absolute;
  content: "";
  top: 5px;
  left: -5px;
  border-left: 1px solid black;
  width: 30px;
  height: 100%;
}
.folder > *:last-child:after {
  display: none;
}
</style>
