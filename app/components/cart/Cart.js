import { useEffect, useState } from 'react';
import { getCart } from '../../api/cart';
import { getCartItems } from '../../api/cart';
import { processOrder } from '../../api/orders';
import CartItemList from './CartItemList';


function getDate(datetimeString) {
  const datetime = new Date(datetimeString);
  return datetime.toLocaleDateString()
}

function getTime(datetimeString) {
  const datetime = new Date(datetimeString);
  return datetime.toLocaleTimeString()
}

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  async function getCartData() {
    const response = await getCart();
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    setCart(data);
  }

  async function getCartItemsData() {
    const response = await getCartItems();
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    setCartItems(data);
  }

  async function handleCheckout(event) {
    event.preventDefault();
    try {
      const response = await processOrder();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      window.location.href = `/orders/${data.id}`;
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  useEffect(() => {
    try {
      getCartData();
      getCartItemsData();
    } catch (error) {
      setError(error);
    }
  }, []);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className='row'>
      <div className='col'>
        <CartItemList cartItems={cartItems} />
      </div>
      <div className='col-md-2 cart-summary'>
        <div className='cart-summary-content'>
          <h5>Summary</h5>
          <p>Total: {cart.total}</p>
          <p>Last Updated: </p>
          <p>{getDate(cart.updated_on)}</p>
          <p>at {getTime(cart.updated_on)}</p>

          <form className='checkout-form' method='POST' onSubmit={handleCheckout}>
            <button type='submit' className='btn btn-success'>Checkout</button>
          </form>
        </div>
      </div>
    </div>
  )
}
