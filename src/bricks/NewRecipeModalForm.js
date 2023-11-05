import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useEffect, useMemo, useState} from "react";
import Form from "react-bootstrap/Form";
import WysiwygEditor from "./WysiwygEditor";
import IngredientsDropdown from "./IngredientsDropdown";
import dropdown from "bootstrap/js/src/dropdown";

function NewRecipeModalForm({recipe, showModal, setShowModal}) {
    const [formData, setFormData] = useState({
        name: "",
        imgUri: "",
        description: "",
        ingredients: [{
            id: "",
            amount: "",
            unit: ""
        }],
    });

    const defaultForm = {
        name: "",
        imgUri: "",
        description: "",
        ingredients: [{
            id: "",
            amount: "",
            unit: ""
        }],
    };

    const [validated, setValidated] = useState(false);

    const handleDropdownValueChange = (value) => {
        const parsed = JSON.parse(value)
        setField("ingredients", [{name: parsed.name, id: parsed.id}]);
    };

    const handleIngredientAmountChange = (value) => {
        formData.ingredients.amount = value;
        setField("ingredients.amount", value)
    }

    const [dropDowns, setDropdowns] = useState([<IngredientsDropdown selectedValue={handleDropdownValueChange} ingredientAmount={handleIngredientAmountChange} required/>]);

    const handleAddDropDown = () => {

        setDropdowns(dropDown => [...dropDown, <IngredientsDropdown selectedValue={handleDropdownValueChange} ingredientAmount={handleIngredientAmountChange} required />]);
    }

    const handleRemoveDropDown = () => {
        const dropDownArray = [...dropDowns]
        dropDownArray.pop()
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
        } else {
            setFormData(() => ({
                ...formData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;

        const payload = {
            ...formData,
        };

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();

        }
        setValidated(true);

        console.log(payload)
        handleCloseModal()

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
            name: recipe.name,
            imgUri: recipe.imgUri,
            description: recipe.description,
            ingredients: [{
                id: recipe.ingredients[0].id,
                amount: recipe.ingredients[0].amount,
                unit: recipe.ingredients[0].unit
            }]
        })}
    }, [recipe]);

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
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
                            {/*<IngredientsDropdown selectedValue={handleDropdownValueChange} required/>*/}
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
                        <div className="d-flex flex-row gap-2">
                            <Button
                                className="btn btn-sm"
                                variant="secondary"
                                onClick={handleCloseModal}
                            >
                                Zavřít
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            style={{ float: "right" }}
                            variant="primary"
                            className="btn btn-success btn-sm"
                            onClick={handleSubmit}
                        >Odeslat
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default NewRecipeModalForm;
