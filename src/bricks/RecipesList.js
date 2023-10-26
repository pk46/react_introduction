import React, { useState, useMemo } from "react";
import RecipesGridView from "./RecipesGridView";
import RecipesTableView from "./RecipesTableView";

import {Row, Col} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form";

import Icon from "@mdi/react";
import {mdiMagnify} from "@mdi/js";


function RecipesList(props) {
    const [view, setView] = useState("Grid");
    const [searchBy, setSearchBy] = useState("");

    function handleSearch(event) {
        event.preventDefault();
        setSearchBy(event.target["searchInput"].value);
    }

    function handleSearchDelete(event) {
        if(!event.target.value) setSearchBy("");
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

    return (
        <>
            <Row>
                <Col>
                    <Navbar bg="light">
                        <div className="container-fluid">
                            <Navbar.Brand>Seznam receptů</Navbar.Brand>
                            <Form className="d-flex" onSubmit={handleSearch}>
                                <Form.Control
                                    id={"searchInput"}
                                    style={{maxWidth:"150px"}}
                                    type="search"
                                    placeholder="Hledat"
                                    aria-label="Hledat"
                                    onChange={handleSearchDelete}
                                />
                                <Button
                                    style={{marginInline:"8px"}}
                                    variant="outline-success"
                                    type="submit"
                                >
                                    <Icon path={mdiMagnify} size={1}/>
                                </Button>
                                <Button
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
            <Row>
                {(() => {
                return filteredRecipesList.length > 0
                    ? view === "Grid"
                        ? <RecipesGridView recipesList={filteredRecipesList} />
                        : view === "SmallGrid"
                            ? <RecipesGridView recipesList={filteredRecipesList} allIngredients={props.allIngredients}
                                               shortText={true} />
                            : <RecipesTableView recipesList={filteredRecipesList} />
                    : <div style={{ margin: "16px auto", textAlign: "center" }}>
                        Nejsou žádné recepty k zobrazení
                    </div>
                })()}
            </Row>
        </>
    )
}

export default RecipesList;