import React from "react";
import Recipe from "./Recipe";

function RecipesList(props) {
  return props.recipesList.map((recipe) => {
    return <Recipe key={recipe.name} recipe={recipe} />
  });
}

export default RecipesList;