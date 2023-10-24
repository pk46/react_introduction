import React from "react";
import Table from "react-bootstrap/Table";

function RecipesTableView(props) {
    return (
        <Table>
            <thead>
            <tr>
                <th>Název</th>
                <th>Recept</th>
            </tr>
            </thead>
            <tbody>
            {props.recipesList.map((recipe) => {
                return (
                    <tr key={recipe.name}>
                    <td>{recipe.name}</td>
                    <td>{recipe.description}</td>
                </tr>
                );
            })}
            </tbody>
        </Table>
    )
}

export default RecipesTableView;