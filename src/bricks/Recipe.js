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

  return (
    <>
      <Col lg={4}>
        <Card className={style.card}>
          <Card.Img variant="top" src={props.recipe.imgUri} alt={'Obrázek ${props.recipe.name}'} />
          <Card.Body>
            <Card.Title>
              <h2>
                <span>
                  <Icon path={ mdiFoodVariant } size={1.2} color="grey"></Icon>{" "}
                </span>
                {props.recipe.name}
              </h2>
            </Card.Title>
            <Card.Text>
              {(() => {
                if (props.shortText) {
                  return truncateText(props.recipe.description, 120);
                } else {
                  return props.recipe.description;
                }
              })()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Recipe;