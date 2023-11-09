import Form from "react-bootstrap/Form";
import React, { useEffect, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

function IngredientsDropdown({ selectedValue, ingredientAmount, ingredientUnit }) {
    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    const [dropDownValue, setDropDownValue] = useState(null);

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

    const handleIngredientSelection = (eventKey) => {
        const parsed = JSON.parse(eventKey);
        setDropDownValue(parsed.name);
        selectedValue(eventKey)
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
                        return <div>Nacitam data</div>;
                    case "success":
                        return (
                            <>
                                <DropdownButton
                                    onSelect={handleIngredientSelection}
                                    variant="primary"
                                    id="ingredients-dropdown"
                                    title={dropDownValue ? dropDownValue : "Vyberte ingredience"}
                                >
                                    {ingredientsLoadCall.data.map((ingredient) => (
                                        <Dropdown.Item
                                            key={ingredient.id}
                                            eventKey={JSON.stringify(ingredient)}
                                        >
                                            {ingredient.name}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
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
