import React from "react";
import Recipe from "./Recipe";

function RecipesGridView(props) {
  return props.recipesList.map((recipe) => {
    return <Recipe key={recipe.name}
                   recipe={recipe}
                   shortText={props.shortText}
                   allIngredients={props.allIngredients}
                   setRecipesCall={props.setRecipesCall}
                   recipesCall={props.setRecipesCall}
    />
  });
}

export default RecipesGridView;