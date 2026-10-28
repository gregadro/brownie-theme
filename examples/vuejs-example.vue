<template>
  <h1 class="title">The Best Gooey Salted Caramel Brownies</h1>
  <h3 class="credits">
    From
    <a href="https://tasty.co/recipe/the-best-gooey-salted-caramel-brownies">
      Tasty
    </a>
    by {{ author }}
  </h3>
  <button v-if="isMember" @click="shareRecipe">Share</button>
  <section class="recipe">
    <div class="ingredients">
      <h2 class="ingredients__title">Ingredients</h2>
      <h4>
        <i>(for {{ servings }} servings)</i>
      </h4>
      <ul>
        <li v-for="(ingredient, idx) in ingredients" :key="`ingredient_${idx}`">
          {{ ingredient }}
        </li>
      </ul>
    </div>
    <RecipeSteps :steps="steps" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import RecipeSteps from "./RecipeSteps.vue";

const props = defineProps<{ author: string; isMember?: boolean }>();

const servings = ref(16);
const ingredients = ref<string[]>([
  "nonstick cooking spray, for greasing",
  "12 tablespoons unsalted butter, 1 1/2 sticks, melted",
  "1 cup granulated sugar (200 g)",
  "1/2 cup brown sugar (110 g)",
  // ... and more delicious stuff
]);

const steps = computed(() => [
  `Preheat the oven to ${props.isMember ? 175 : 180}°C.`,
  "Grease an 8x8-inch (20x20-cm) baking pan.",
]);

function shareRecipe(): void {
  // Share this awesome recipe
  navigator.clipboard.writeText(window.location.href);
}
</script>

<style scoped>
.title {
  color: #d4a373;
}
</style>
