import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import WysiwygEditor from "./WysiwygEditor";
import IngredientsDropdown from "./IngredientsDropdown";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";


const defaultForm = {
    id: "",
    name: "",
    description: "",
    imgUri: "",
    ingredients: [],
};

function NewRecipeModalForm({showModal, setShowModal, recipe, onComplete}) {
    const [formData, setFormData] = useState(defaultForm);
    const [validated, setValidated] = useState(false);
    const [recipeAddCall, setRecipeAddCall] = useState({
        state: 'inactive'
    });

    const handleDropdownValueChange = (value, index, amount, unit) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            name: value.name,
            id: value.id,
            amount: amount,
            unit: unit,
        };
        setField("ingredients", updatedIngredients);
    };


    const handleIngredientAmountChange = (value, index) => {
        setField("ingredients.amount", value, index);
    }

    const handleIngredientUnitChange = (value, index) => {
        setField("ingredients.unit", value, index);
    }

    const [dropDowns, setDropdowns] = useState(
        [
            <IngredientsDropdown
            selectedIngredient={(value) => handleDropdownValueChange(value, formData.ingredients.length)}
            ingredientAmount={(value) => handleIngredientAmountChange(value, formData.ingredients.length)}
            ingredientUnit={(value) => handleIngredientUnitChange(value, formData.ingredients.length)} required />
        ]
    );

    const handleAddDropDown = () => {
        setDropdowns(dropDown => [...dropDown,
            <IngredientsDropdown
                selectedIngredient={(value) => handleDropdownValueChange(value, formData.ingredients.length)}
                ingredientAmount={(value) => handleIngredientAmountChange(value, formData.ingredients.length)}
                ingredientUnit={(value) => handleIngredientUnitChange(value, formData.ingredients.length)} required
            />
        ]);
    }

    const handleRemoveDropDown = () => {
        setFormData((prevData) => ({
            ...prevData,
            ingredients: prevData.ingredients.slice(0, -1),
        }));
        const dropDownArray = [...dropDowns];
        dropDownArray.splice(-1, 1);
        setDropdowns(dropDownArray);
    };

    const setField = (name, value, index) => {
        if (name === "ingredients") {
            setFormData((prevData) => ({
                ...prevData,
                ingredients: value,
            }));
        } else if (name === "ingredients.amount") {
            setFormData((prevData) => {
                const updatedIngredients = [...prevData.ingredients];
                updatedIngredients[index] = {
                    ...updatedIngredients[index],
                    amount: Number(value),
                };
                return {
                    ...prevData,
                    ingredients: updatedIngredients,
                };
            });
        } else if (name === "ingredients.unit") {
            setFormData((prevData) => {
                const updatedIngredients = [...prevData.ingredients];
                updatedIngredients[index] = {
                    ...updatedIngredients[index],
                    unit: value,
                };
                return {
                    ...prevData,
                    ingredients: updatedIngredients,
                };
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        if (form.checkValidity()) {
            const payload = {
                ...formData,
            };

            setRecipeAddCall({state: "pending"});
            const result = await fetch(`http://localhost:3000/recipe/${(recipe) ? "update" : "create"}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                });
            const data = await result.json();
            if (result.status >= 400) {
                setRecipeAddCall({ state: "error", error: data });
            } else {
                setRecipeAddCall({ state: "success", data });
                if (typeof onComplete === 'function') {
                    onComplete(data);
                }
                handleCloseModal();
            }
        };
        setValidated(true);
    };

    const handleCloseModal = () => {
        setShowModal({state: false})
        setFormData(defaultForm);
    }

    useEffect(() => {
        if (!recipe) {
            setFormData(defaultForm)
        } else {
        setFormData({
            "id": recipe.id,
            "name": recipe.name,
            "description": recipe.description,
            "imgUri": recipe.imgUri,
            "ingredients": recipe.ingredients.map(ingredient => ({
                "id": ingredient.id,
                "amount": ingredient.amount,
                "unit": ingredient.unit
            }))
        })}
    }, [recipe]);

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(recipe) ? "Upravit recept" : "Nový recept"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Název</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setField("name", e.target.value)}
                                minLength={5}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Minimální délka pro název je 5 znaků
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" style={{ height: "8rem" }}>
                            <Form.Label>Postup</Form.Label>
                            <WysiwygEditor
                                value={formData.description}
                                onChange={(content) => setField("description", content)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL Obrázku</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.imgUri}
                                onChange={(e) => setField("imgUri", e.target.value)}
                                minLength={5}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Seznam ingrediencí</Form.Label>
                            {dropDowns.map((ingredient, i) => {
                                return <div key={i}>{ingredient}</div>
                            })}
                            <Form.Control.Feedback type="invalid">
                                Něco vyberte
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button onClick={handleAddDropDown}>Přidat ingredienci</Button>
                        <Button onClick={handleRemoveDropDown}>Odstranit ingredienci</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex flex-row justify-content-between align-items-center w-100">
                            <div>
                                { recipeAddCall.state === 'error' &&
                                    <div className="text-danger">Error: {recipeAddCall.error.errorMessage}</div>
                                }
                            </div>
                            <div className="d-flex flex-row gap-2">
                                <Button
                                    className="btn btn-sm"
                                    variant="secondary"
                                    onClick={handleCloseModal}
                                >
                                    Zavřít
                                </Button>
                            <Button
                                type="submit"
                                style={{ float: "right" }}
                                variant="primary"
                                className="btn btn-success btn-sm"
                                disabled={recipeAddCall.state === 'pending'}
                                >{ recipeAddCall.state === 'pending' ? (
                                <Icon size={0.8} path={mdiLoading} spin={true} />
                            ) : (
                                (recipe) ? "Upravit" : "Uložit"
                            )}
                            </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default NewRecipeModalForm;
