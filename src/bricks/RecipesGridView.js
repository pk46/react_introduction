import React from "react";
import Recipe from "./Recipe";

function RecipesGridView(props) {
  return props.recipesList.map((recipe) => {
    return <Recipe key={recipe.name} recipe={recipe} shortText={props.shortText} />
  });
}

export default RecipesGridView;