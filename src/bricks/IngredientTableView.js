import Table from "react-bootstrap/Table"

function IngredientTableView(props) {

    return (
        <Table data-testid="ingredientComponentTest">
            <thead>
            <tr>
                <th>Název</th>
                <th>ID</th>
            </tr>
            </thead>
            <tbody>
            {props.ingredients.map((ingredient) => {
                return (
                    <tr key={ingredient.id}>
                        <td data-testid="testName">{ingredient.name}</td>
                        <td>{ingredient.id}</td>
                    </tr>

                );
            })}
            </tbody>
        </Table>
    )
}

export default IngredientTableView;