import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';

const mockBun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

const mockIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  id: 'unique-id-1'
};

const mockIngredient2 = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  id: 'unique-id-2'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('должен обработать addIngredient для булки', () => {
    const state = constructorReducer(
      initialState,
      addIngredient({ ...mockBun, id: 'unique-id' })
    );
    expect(state.bun).toEqual({ ...mockBun, id: 'unique-id' });
    expect(state.ingredients).toEqual([]);
  });

  test('должен обработать addIngredient для начинки', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.bun).toBe(null);
    expect(state.ingredients).toContainEqual(mockIngredient);
  });

  test('должен обработать removeIngredient', () => {
    const stateWithIngredients = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient(mockIngredient.id)
    );
    expect(state.ingredients).not.toContainEqual(mockIngredient);
    expect(state.ingredients).toEqual([]);
  });

  test('должен обработать moveIngredient', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    state = constructorReducer(
      state,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients[0]).toEqual(mockIngredient2);
    expect(state.ingredients[1]).toEqual(mockIngredient);
  });

  test('должен обработать clearConstructor', () => {
    let state = constructorReducer(
      initialState,
      addIngredient({ ...mockBun, id: 'unique-id' })
    );
    state = constructorReducer(state, addIngredient(mockIngredient));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const clearedState = constructorReducer(state, clearConstructor());
    expect(clearedState).toEqual(initialState);
  });
});
