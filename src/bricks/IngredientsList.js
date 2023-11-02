import {Col, Row} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import {mdiMagnify} from "@mdi/js";
import React, {useMemo, useState} from "react";
import IngredientTableView from "./IngredientTableView";

function IngredientsList(props) {

    const [searchValue, setSearchValue] = useState("");
    function handleSearch(event) {
        event.preventDefault();
        setSearchValue(event.target["searchInput"].value)
    }

    function handleSearchDelete(event) {
        if (!event.target.value) setSearchValue("")
    }

    const filteredResults = useMemo(() => {
        return props.ingredients.filter((ingredient) => {
            return (
                ingredient.name
                    .toLocaleLowerCase()
                    .includes(searchValue.toLocaleLowerCase())
            );
        });
    }, [searchValue]);

    return (
        <>
            <Row>
                <Col>
                    <Navbar>
                        <div className="container-fluid">
                            <Navbar.Brand>Seznam ingrediencí</Navbar.Brand>
                            <Form className="d-flex" onSubmit={handleSearch}>
                                <Form.Control
                                    id={"searchInput"}
                                    style={{ maxWidth: "150px" }}
                                    type="search"
                                    placeholder="Hledat"
                                    aria-label="Hledat"
                                    onChange={handleSearchDelete}
                                />
                                <Button
                                    style={{ marginRight: "8px" }}
                                    variant="outline-success"
                                    type="submit"
                                >
                                    <Icon size={1} path={mdiMagnify} />
                                </Button>
                            </Form>
                        </div>
                    </Navbar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <IngredientTableView ingredients={filteredResults} />
                </Col>
            </Row>
        </>
    );
}

export default IngredientsList;