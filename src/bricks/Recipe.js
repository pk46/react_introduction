import React, {useState} from 'react';

import Card from 'react-bootstrap/Card';
import { Col } from "react-bootstrap";

import Icon from '@mdi/react';
import {mdiFoodVariant, mdiPencilOutline, mdiTrashCanOutline} from '@mdi/js';

import style from '../css/recipe.module.css';
import NewRecipeModalForm from "./NewRecipeModalForm";


function Recipe(props) {

    const [showModal, setShowModal] = useState({
        state: false
    });
    const [recipeDeleteCall, setRecipeDeleteCall] = useState({
        state: "inactive"
    })

    const handleShowModal = (data) => {
        setShowModal({state: true, data})
    }

    const handleRecipeDelete = async (recipe) => {
        setRecipeDeleteCall({state: "pending"})
        const result = await fetch(`http://localhost:3000/recipe/delete`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: recipe.id })
            });
        const data = await result.json();
        if (result.status >= 400) {
            setRecipeDeleteCall({state: "error", error: data});
        } else {
            setRecipeDeleteCall({state: "success", data});
        }
    }

    function truncateText(text, maxLength) {
        return text.substring(0, maxLength) + "...";
    }

    function getIngredients() {
        return (
            <div className="mt-4">
                <ul>
                    {props.recipe.ingredients.slice(0, 4).map((ingredient) => {
                        const ingredientData = props.allIngredients.find((ing) => ing.id === ingredient.id);
                        return ingredientData ? <li key={ingredientData.id}>{ingredientData.name}</li> : "";
                    })}
                </ul>
            </div>
        );
    }

    return (
        <>
            <Col lg={4}>
                <Card className={style.card}>
                    <Card.Img variant="top" src={props.recipe.imgUri} alt={'Obrázek ${props.recipe.name}'} />
                    <Card.Body>
                        <Card.Title>
                            <Icon
                                size={0.8}
                                path={mdiPencilOutline}
                                style={{ color: 'orange', cursor: 'pointer' }}
                                onClick={() => handleShowModal(props.recipe)}
                            />
                            <Icon
                                size={0.8}
                                path={mdiTrashCanOutline}
                                onClick={() => handleRecipeDelete(props.recipe)}
                                />
                            <span>
                  <Icon path={ mdiFoodVariant } size={1.2} color="grey"></Icon>{" "}
                </span>
                            {props.recipe.name}
                        </Card.Title>
                        <Card.Text as="div">
                            {(() => {
                                return props.shortText ? (
                                    <>
                                        {truncateText(props.recipe.description, 120)}
                                        {getIngredients()}
                                    </>
                                ) : (
                                    props.recipe.description
                                );
                            })()}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <NewRecipeModalForm showModal={showModal.state} setShowModal={setShowModal} recipe={showModal.data} />
        </>
    );
}

export default Recipe;