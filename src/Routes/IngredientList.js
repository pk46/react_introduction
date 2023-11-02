import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import IngredientsList from "../bricks/IngredientsList";
import styles from "../css/recipe.module.css";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";

function IngredientList() {

    const [ingredientListCall, setIngredientListCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        fetch("http://localhost:3000/ingredient/list", {method: "GET"})
            .then(async (response) => {
                if (response.status >= 400) {
                    return await response.json().then((errorResponse) => {
                        setIngredientListCall({state: "error", error: errorResponse});
                    });
                } else {
                    return await response.json().then((dataResponse) => {
                        setIngredientListCall({state: "success", data: dataResponse});
                    })
                }
            })
            .catch((error) => {
                setIngredientListCall({state: "error", error: error.message});
            })
    }, []);

    function getElements() {
        switch (ingredientListCall.state) {
            case "pending":
                return (
                    <div className={styles.loading}>
                        <Icon path={mdiLoading} spin={true} size={5}/>
                    </div>
                );
            case "success":
                return (
                    <>
                        <h1 style={{ textAlign: 'center' }}>Ingredience</h1>
                        <Container className="p-4">
                            <IngredientsList ingredients={ingredientListCall.data} />
                        </Container>
                    </>
                );
            case "error":
                return (
                    <>
                        <div>Chyba pri nacitani ingredienci</div>
                        <pre>{JSON.stringify(ingredientListCall.error, null, 2)}</pre>
                    </>
                );
            default:
                return null;
        }
    }

    return getElements();
}

export default IngredientList;