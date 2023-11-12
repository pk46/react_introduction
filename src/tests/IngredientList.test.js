import {render, screen} from '@testing-library/react';
import IngredientTableView from "../bricks/IngredientTableView";


const ingredientsTest = [
    {
        id: 1,
        name: "cibuleTest"
    },
    {
        id: 2,
        name: "okurkaTest"
    },
    {
        id: 3,
        name: "melounTest"
    }
];

test('should render ingredient component', () => {
    render(<IngredientTableView ingredients={ingredientsTest} />)

    const ingredientComponent = screen.getByTestId("ingredientComponentTest")

    expect(ingredientComponent).toBeInTheDocument()
})

test ('should get element name', () => {
    render(<IngredientTableView ingredients={ingredientsTest} />)

    const ingredientNames = screen.getAllByTestId("testName")

    ingredientNames.forEach((element, i) => {
        expect(element.textContent).toBe(ingredientsTest[i].name)
    })

})
