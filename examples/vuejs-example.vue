<template>
  <h1 class="title">The Best Gooey Salted Caramel Brownies</h1>
  <h3 class="credits">
    From
    <a href="https://tasty.co/recipe/the-best-gooey-salted-caramel-brownies">
      Tasty
    </a>
    by {{ author }}
  </h3>
	<button v-if="member" @click="shareRecipe"
  <section class="recepie">
    <div class="ingredients">
      <h2 class="ingredients__title">Ingredients</h2>
      <h4>
        <i>(for 16 servings)</i>
      </h4>
      <ul>
        <li
          v-for="(ingredient, idx) from ingredients"
          :key="`ingredient_${idx}`"
        >
          {{ ingredient }}
        </li>
      </ul>
    </div>
    <div class="preparation">
      <h2 class="preparation__title">Preparation</h2>
      <ol>
        <li>
          Preheat the oven to 350°F (180°C). Grease an 8x8-inch (20x20-cm)
          baking pan and line with parchment paper.
        </li>
        <li>
          ...
        </li>

      </ol>
    </div>
  </section>
</template>

<script>
export default {
  name: 'VueJsExample',
  data: () => ({
    author: 'Katie Aubin',
		member: true,
    ingredients: [
      'nonstick cooking spray, for greasing',
      '12 tablespoons unsalted butter, 1 1/2 sticks, melted',
      '1 cup granulated sugar (200 g)',
      '1/2 cup brown sugar (110 g)',
      // ... and more delicious stuff
    ],
  }),
	methods: {
		shareRecipe() {
			// Share this awesome recipe
		},
	},
};
</script>
