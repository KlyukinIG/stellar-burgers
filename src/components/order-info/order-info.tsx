import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { useDispatch, useSelector } from '../../services/store';

import { TIngredient } from '@utils-types';

import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  selectFeedOrders,
  selectCurrentOrder
} from '../../services/slices/feedSlice';
import {
  fetchProfileOrderByNumber,
  selectProfileOrders,
  selectProfileCurrentOrder
} from '../../services/slices/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();

  const { number } = useParams();
  const location = useLocation();

  const ingredients = useSelector(selectIngredients);

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);

  const currentFeedOrder = useSelector(selectCurrentOrder);
  const currentProfileOrder = useSelector(selectProfileCurrentOrder);

  const isProfilePage = location.pathname.startsWith('/profile');

  const orders = isProfilePage ? profileOrders : feedOrders;

  const orderFromStore = orders.find(
    (order) => order.number === Number(number)
  );

  const orderData = orderFromStore
    ? orderFromStore
    : isProfilePage
      ? currentProfileOrder
      : currentFeedOrder;

  useEffect(() => {
    if (orderData || !number) return;

    if (isProfilePage) {
      dispatch(fetchProfileOrderByNumber(Number(number)));
    } else {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData, isProfilePage]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
