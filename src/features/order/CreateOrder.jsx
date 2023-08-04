import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddress, getUser } from '../user/userSlice';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice.js';
import { useState } from 'react';
import store from '../../store.js';
import { formatCurrency } from '../../utils/helpers.js';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData();
  const {
    username,
    status,
    address,
    position,
    error: errorAddress,
  } = useSelector(getUser);

  const isLoadingAddress = status === 'loading';

  const [withPriority, setWithPriority] = useState(false);

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className={`input w-full ${
                formErrors?.phone ? 'border border-red-600' : ''
              }`}
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone && (
              <p className="mt-1  flex items-center gap-1 px-1 text-xs font-medium text-red-700">
                <span className="material-symbols-outlined self-start text-base font-medium">
                  error
                </span>
                <span>{formErrors.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className={`input w-full  ${
                status === 'error' ? 'border border-red-600' : ''
              }`}
              type="text"
              name="address"
              defaultValue={address}
              disabled={isLoadingAddress}
              required
            />

            {status === 'error' && (
              <p className="mt-1  flex items-center gap-1 px-1 text-xs font-medium text-red-700">
                <span className="material-symbols-outlined self-start text-base font-medium">
                  error
                </span>
                <span>{errorAddress}</span>
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span
              className={`absolute bottom-[3px] right-[3px] z-50 sm:bottom-[1px] sm:right-[1px] md:bottom-[5px] md:right-[5px] ${
                status === 'error' ? 'top-[35px] sm:top-[1px] lg:top-[5px]' : ''
              }`}
            >
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none  focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ''
            }
          />

          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? 'Placing order...'
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, place the order & redirect
  const newOrder = await createOrder(order);

  // do NOT overuse, stop some optimizations
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
