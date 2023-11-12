import React, {useState} from 'react';

import Card from 'react-bootstrap/Card';
import {Alert, Col, Modal} from "react-bootstrap";

import Icon from '@mdi/react';
import {mdiFoodVariant, mdiPencilOutline} from '@mdi/js';

import style from '../css/recipe.module.css';
import NewRecipeModalForm from "./NewRecipeModalForm";
import RecipeDelete from "./RecipeDelete";


function Recipe(props) {

    const [showModal, setShowModal] = useState({
        state: false
    });

    const [deleteRecipeError, setDeleteRecipeError] = useState('');

    const handleShowModal = (data) => {
        setShowModal({state: true, data})
    }

    const [isModalShown, setIsModalShown] = useState(false);
    const handleCloseModal = () => {
        setIsModalShown(!isModalShown);
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

    const handleRecipeDeleted = (recipeId) => {
        // setIsModalShown(false);
        if (props.recipesCall.state === "success") {
            props.setRecipesCall({
                state: "success",
                data: props.recipesCall.data.filter((recipe) => recipe.id !== recipeId)
            });
        }
    };

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
                            <RecipeDelete recipe={props.recipe}
                                          onError={(error) => setDeleteRecipeError(error)}
                                          onDelete={(id) => handleRecipeDeleted(id)}
                                          onCloseModal={() => setIsModalShown(false)}
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
            <Modal show={isModalShown} onHide={handleCloseModal} className={"hidden"}>
                <Modal.Header closeButton>
                    <Modal.Title>Chyba při mazání receptů</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteRecipeError &&
                        <Alert variant="danger">
                            Error: { deleteRecipeError }
                        </Alert>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Recipe;