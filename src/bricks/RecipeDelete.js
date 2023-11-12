import { useState} from "react";
import Icon from "@mdi/react";
import {mdiTrashCanOutline} from "@mdi/js";
import Confirmation from "./Confirmation";

export default function RecipeDelete({ recipe, onDelete, onError, onCloseModal }) {
    const [recipeDeleteCall, setRecipeDeleteCall] = useState({
        state: 'inactive'
    });

    const handleRecipeDelete = async () => {
        if (recipeDeleteCall.state === 'pending')
            return

        setRecipeDeleteCall({ state: 'pending' });

        const res = await fetch(`http://localhost:3000/recipe/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: recipe.id })
        });

        const data = await res.json();

        if (res.status >= 400) {
            setRecipeDeleteCall({ state: 'error', error: data });
            if (typeof onError === 'function')
                onError(data.error);
        } else {
            setRecipeDeleteCall({ state: 'success', data });
            if (typeof onDelete === 'function') {
                onDelete(recipe.id);
                if (typeof onCloseModal === 'function') {
                    onCloseModal();
                }
            }
        }
    }

    return (
        <Confirmation
            title="Smazat recept"
            message="Opravdu si přejete smazat tento recept?"
            confirmText="Smazat"
            onConfirm={handleRecipeDelete}
        >
            <span>
                <Icon
                    path={mdiTrashCanOutline}
                    style={{ cursor: 'pointer', color: 'red' }}
                    size={0.8}
                ></Icon>
            </span>
        </Confirmation>
    )
}