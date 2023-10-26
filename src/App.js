import React, {useState, useEffect} from "react";
import RecipesList from "./bricks/RecipesList";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./css/recipe.module.css";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";


const cookbook = {
  name: "Kuchařka"
}

function App() {

  const [recipesCall, setRecipesCall] = useState({
    state: "pending",
  });

  const [ingredientsCall, setIngredientsCall] = useState({
        state: "pending",
  })

  function apiCall(call, setCall, url) {
    fetch(url, {method: "GET"})
        .then((response) => {
            if (response.status >= 400) {
                return response.json().then((errorResponse) => {
                    setCall({ state: "error", error: errorResponse });
                });
                } else {
                    return response.json().then((dataResponse) => {
                    setCall({ state: "success", data: dataResponse });
                });
                }
            })
            .catch((error) => {
                setCall({ state: "error", error: error.message });
            });
    }

    useEffect(() => {
        apiCall(recipesCall, setRecipesCall, `http://localhost:3000/recipe/list`);
        apiCall(ingredientsCall, setIngredientsCall, `http://localhost:3000/ingredient/list`);
    }, [])

    function getChild() {
      if (recipesCall.state === "pending" || ingredientsCall.state === "pending") {
        return (
            <div className={styles.loading}>
                <Icon path={mdiLoading} spin={true} size={5} />
            </div>
        );
      } else if (recipesCall.state === "success" && ingredientsCall.state === "success") {
        return (
            <>
                <h1>{cookbook.name}</h1>
                <RecipesList recipesList={recipesCall.data} allIngredients={ingredientsCall.data} />
            </>
        );
      } else if (recipesCall.state === "error" || ingredientsCall.state === "error") {
        return (
            <div className={styles.error}>
                <div>{recipesCall.state === "error" ? "recipesCall.error" : "ingredientsCall.error"}</div>
                <br />
                <pre>{JSON.stringify(recipesCall.error, null, 2)}</pre>
                <pre>{JSON.stringify(ingredientsCall.error, null, 2)}</pre>
            </div>
        );
      }
    }
  return <div className="App">{getChild()}</div>
}

export default App;
