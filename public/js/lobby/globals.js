export let deck = [];
export let user_id = null;

export function setGlobals(newDeck, newUserId) {
    deck = newDeck;
    user_id = newUserId;
}