import React from 'react';

import Card from 'react-bootstrap/Card';
import { Col } from "react-bootstrap";

import Icon from '@mdi/react';
import { mdiFoodVariant } from '@mdi/js';

import style from '../css/recipe.module.css';


function Recipe(props) {

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
    </>
  );
}

export default Recipe;