import React, { useState, useMemo } from "react";
import RecipesGridView from "./RecipesGridView";
import RecipesTableView from "./RecipesTableView";
import NewRecipeModalForm from "./NewRecipeModalForm";

import {Row, Col} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form";


function RecipesList(props) {
    const [view, setView] = useState("Grid");
    const [searchBy, setSearchBy] = useState("");
    const [showModal, setShowModal] = useState({
        state: false
    });

    function handleSearch(event) {
        const inputLength = event.target.value.length;
        if (inputLength >= 3) {
            setSearchBy(event.target.value);
        }
    }

    function handleSearchDelete(event) {
        const inputValue = event.target.value;
        if (!inputValue) {
            setSearchBy("");
        }
    }

    const filteredRecipesList = useMemo(() => {
        return props.recipesList.filter((recipe) => {
            return (
                recipe.name
                    .toLocaleLowerCase()
                    .includes(searchBy.toLocaleLowerCase()) ||
                recipe.description
                    .toLocaleLowerCase()
                    .includes(searchBy.toLocaleLowerCase())
            );
        });
    }, [searchBy, props.recipesList]);

    const handleRecipeAdded = (recipe) => {
        if (props.recipesCall.state === "success") {
            props.setRecipesCall({
                state: "success",
                data: [...props.recipesCall.data, recipe]
            });
        }
    }

    return (
        <>
            <Row>
                <Col>
                    <Navbar
                    fixed="top"
                    style={{top: 56}}>
                        <div className="container-fluid">
                            <Navbar.Brand>Seznam receptů</Navbar.Brand>
                            <Form className="d-flex" >
                                <Form.Control
                                    id={"searchInput"}
                                    style={{maxWidth:"150px"}}
                                    type="search"
                                    placeholder="Hledat"
                                    aria-label="Hledat"
                                    onChange={(event) => {
                                        handleSearch(event);
                                        handleSearchDelete(event);
                                    }}
                                />
                                <Button onClick={() => setShowModal({state: true})} variant="success"
                                        style={{marginLeft: 7}}>Nový recept
                                </Button>
                                <Button
                                    style={{marginInline:"8px"}}
                                    className="d-none d-md-block"
                                    variant="outline-primary"
                                    onClick={() => {
                                        setView((view) => {
                                            if (view === "Grid") {
                                                return "SmallGrid";
                                            } else if (view === "SmallGrid") {
                                                return "Table";
                                            } else {
                                                return "Grid";
                                            }
                                        })
                                    }}>
                                    {view}
                                </Button>
                            </Form>
                        </div>
                    </Navbar>
                </Col>
            </Row>
            <Row style={{paddingTop: 30}}>
                {(() => {
                return filteredRecipesList.length > 0
                    ? view === "Grid"
                        ? <RecipesGridView recipesList={filteredRecipesList} recipesCall={props.recipesCall}
                                           setRecipesCall={props.setRecipesCall} />
                        : view === "SmallGrid"
                            ? <RecipesGridView recipesList={filteredRecipesList} allIngredients={props.allIngredients}
                                               shortText={true} recipesCall={props.recipesCall}
                                               setRecipesCall={props.setRecipesCall} />
                            : <RecipesTableView recipesList={filteredRecipesList} recipesCall={props.recipesCall}
                                                setRecipesCall={props.setRecipesCall} />
                    : <div style={{ margin: "16px auto", textAlign: "center" }}>
                        Nejsou žádné recepty k zobrazení
                    </div>
                })()}
            </Row>
            <NewRecipeModalForm showModal={showModal.state} setShowModal={setShowModal} onComplete={(recipe) => handleRecipeAdded(recipe)} />
        </>
    )
}

export default RecipesList;