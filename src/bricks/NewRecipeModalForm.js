import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import WysiwygEditor from "./WysiwygEditor";
import IngredientsDropdown from "./IngredientsDropdown";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";

function NewRecipeModalForm({recipe, showModal, setShowModal, onComplete}) {
    const defaultForm = {
        name: "",
        description: "",
        imgUri: "",
        ingredients: [{
            id: "",
            amount: "",
            unit: ""
        }],
    };
    const [formData, setFormData] = useState(defaultForm);
    const [validated, setValidated] = useState(false);
    const [recipeAddCall, setRecipeAddCall] = useState({
        state: 'inactive'
    });

    const handleDropdownValueChange = (value, index) => {
        const parsed = JSON.parse(value)
        setField("ingredients", [{name: parsed.name, id: parsed.id}]);
    };

    const handleIngredientAmountChange = (value) => {
        formData.ingredients.amount = value;
        setField("ingredients.amount", value)
    }

    const handleIngredientUnitChange = (value) => {
        formData.ingredients.unit = value;
        setField("ingredients.unit", value)
    }

    const [dropDowns, setDropdowns] = useState(
        [
            <IngredientsDropdown
            selectedValue={handleDropdownValueChange}
            ingredientAmount={handleIngredientAmountChange}
            ingredientUnit={handleIngredientUnitChange} required />
        ]
    );

    const handleAddDropDown = () => {
        setDropdowns(dropDown => [...dropDown,
            <IngredientsDropdown
                selectedValue={handleDropdownValueChange}
                ingredientAmount={handleIngredientAmountChange}
                ingredientUnit={handleIngredientUnitChange} required
            />
        ]);
    }

    const handleRemoveDropDown = () => {
        const dropDownArray = [...dropDowns]
        dropDownArray.splice(-1, 1)
        setDropdowns(dropDownArray)
    }

    const setField = (name, value) => {
        if (name === "ingredients") {
            setFormData(() => ({
                ...formData,
                ingredients: value,
            }));
        } else if (name === "ingredients.amount") {
            setFormData(prevFormData => ({
                ...prevFormData,
                ingredients: [
                    {
                        ...prevFormData.ingredients[0],
                        amount: Number(value),
                    },
                ],
            }));
        } else if (name === "ingredients.unit") {
            setFormData(prevFormData => ({
                ...prevFormData,
                ingredients: [
                    {
                        ...prevFormData.ingredients[0],
                        unit: value,
                    }
                ]
            }))
        } else
         {
            setFormData(() => ({
                ...formData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;

        e.preventDefault();
        e.stopPropagation();

        const payload = {
            ...formData,
        };

        if (!form.checkValidity()) {
            return;
        } else {
            setValidated(true);
        }

        console.log(JSON.stringify(payload))

        // setRecipeAddCall({state: "pending"});
        // const result = await fetch(`http://localhost:3000/recipe/create`,
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(payload)
        //     });
        // const data = await result.json();
        // if (result.status >= 400) {
        //     setRecipeAddCall({ state: "error", error: data });
        //     console.log("data:" + data)
        // } else {
        //     setRecipeAddCall({ state: "success", data });
        //     handleCloseModal();
        // }
    };

    const handleCloseModal = () => {
        setShowModal({state: false})
        setFormData(defaultForm);
        setValidated(false)
    }

    useEffect(() => {
        if (!recipe) {
            setFormData(defaultForm)
        } else {
        setFormData({
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
                <Form noValidate validated={validated}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(recipe) ? "Úprava receptu" : "Nový recept"}</Modal.Title>
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
                                onClick={handleSubmit}
                                disabled={recipeAddCall.state === 'pending'}
                                >{ recipeAddCall.state === 'pending' ? (
                                <Icon size={0.8} path={mdiLoading} spin={true} />
                            ) : (
                                "Přidat"
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
