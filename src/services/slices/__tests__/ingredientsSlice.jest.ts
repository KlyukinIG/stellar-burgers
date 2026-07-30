import ingredientsReducer, {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredientById
} from '../ingredientsSlice';

const mockIngredient = {
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

describe('ingredientsSlice', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('должен обработать fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('должен обработать fetchIngredients.fulfilled', () => {
    const mockData = [mockIngredient];
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      fetchIngredients.fulfilled(mockData, '', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockData);
    expect(state.error).toBe(null);
  });

  test('должен обработать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      fetchIngredients.rejected(new Error(errorMessage), '', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('селектор selectIngredients должен возвращать массив ингредиентов', () => {
    const state = {
      ingredients: {
        data: [mockIngredient],
        loading: false,
        error: null
      }
    };
    expect(selectIngredients(state)).toEqual([mockIngredient]);
  });

  test('селектор selectIngredientById должен находить ингредиент по id', () => {
    const state = {
      ingredients: {
        data: [mockIngredient],
        loading: false,
        error: null
      }
    };
    const selector = selectIngredientById(mockIngredient._id);
    expect(selector(state)).toEqual(mockIngredient);
  });
});
