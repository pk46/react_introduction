import Form from "react-bootstrap/Form";
import React, { useEffect, useState } from "react";
import {mdiLoading} from "@mdi/js";
import Icon from "@mdi/react";

function IngredientsDropdown({ selectedIngredient, ingredientAmount, ingredientUnit }) {
    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        fetch("http://localhost:3000/ingredient/list", { method: "GET" })
            .then(async (response) => {
                if (response.status >= 400) {
                    return await response
                        .json()
                        .then((errorResponse) => {
                            setIngredientsLoadCall({
                                state: "error",
                                error: errorResponse,
                            });
                        });
                } else {
                    return await response.json().then((dataResponse) => {
                        setIngredientsLoadCall({ state: "success", data: dataResponse });
                    });
                }
            })
            .catch((error) => {
                setIngredientsLoadCall({ state: "error", error: error.message });
            });
    }, []);

    const handleIngredientSelection = (e) => {
        const jsonObject = JSON.parse(e.target.value)
        selectedIngredient(jsonObject)
    };

    function handleIngredientAmountChange(e) {
        ingredientAmount(e.target.value)
    }

    function handleIngredientUnitChange(e) {
        ingredientUnit(e.target.value)
    }

    return (
        <>
            {(() => {
                switch (ingredientsLoadCall.state) {
                    case "pending":
                        return <Icon size={0.8} path={mdiLoading} spin={true} />
                    case "success":
                        return (
                            <>
                                <Form.Group>
                                    <Form.Control as="select"
                                                  onChange={handleIngredientSelection}
                                                  variant="primary"
                                                  required
                                                  defaultValue=""
                                    >
                                        <option disabled value="">Vyberte ingredienci</option>
                                        {ingredientsLoadCall.data.map((ingredient) => (
                                            <option
                                                key={ingredient.id}
                                                value={JSON.stringify({ name: ingredient.name, id: ingredient.id })}
                                            >
                                                {ingredient.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Label>Množství</Form.Label>
                                <Form.Control
                                    type="number"
                                    onChange={handleIngredientAmountChange}
                                    required
                                >
                                </Form.Control>
                                <Form.Label>Jednotky</Form.Label>
                                <Form.Control
                                    type="text"
                                    minLength={1}
                                    onChange={handleIngredientUnitChange}
                                    required
                                >
                                </Form.Control>
                            </>
                        );
                    case "error":
                        return <div>Chyba při načítání ingrediencí</div>;
                    default:
                        return null;
                }
            })()}
        </>
    );
}

export default IngredientsDropdown;
