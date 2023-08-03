import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant.js';
import MenuItem from './MenuItem';

function Menu() {
  // Here use render as you fetch strategy, render the component and fetch the data simultaneously, no data loading waterfalls like fetch on render approach (before render, then fetch)
  const menu = useLoaderData();

  return (
    <ul className="divide-y divide-stone-200 px-2 ">
      {menu.map((pizza) => (
        <MenuItem key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}

export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
