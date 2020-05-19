import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { filter, groupBy, max, min, map, toNumber, trim, toArray } from 'lodash';
import './App.css';

const _groupBy = (data, category = 'category') => {
  data = filter(data, function (o) {
    return o.showinmenu.trim().toLowerCase() == "yes";
  });
  return groupBy(data, category);
};
const maxPrice = (items) => {
  return max(getPrices(items));
};
const minPrice = (items) => {
  return min(getPrices(items));
};
const getPrices = (items, value = 'prices') => {
  let prices = map(items, 'prices');
  return prices.map(function (item) {
    return toNumber(trim(item.trim(), '$'));
  });
}

function App({ hello }) {
  const [menu, setMenu] = useState();
  const [restaurant, setRestaurant] = useState();

  useEffect(() => {
    async function fetchData() {
      const resultMenu = await axios(
        'https://sheetdb.io/api/v1/3x3bl9v7indtm?sheet=menu&fbclid=IwAR18nVF2gXhgk9B6hHVpoBruWiIuWotUt4BQeEs4jazF8sPaW2qBkYCvfno',
      );
      const { data } = resultMenu;

      setMenu(groupBy((data), 'maincategory'));
    }
    fetchData()
  }, []);

  useEffect(() => {
    async function fetchData() {
      const resultRestaurant = await axios(
        'https://sheetdb.io/api/v1/3x3bl9v7indtm?sheet=location&fbclid=IwAR18nVF2gXhgk9B6hHVpoBruWiIuWotUt4BQeEs4jazF8sPaW2qBkYCvfno',
      );
      setRestaurant(resultRestaurant.data[0]);
    }
    fetchData()
  }, []);

  return (

    <div className="sheet">
      <h1>{restaurant && restaurant.restaurant}</h1>
      <p style={{ 'textAlign': 'center' }}>{restaurant && restaurant.address}</p>

      {menu && Object.keys(menu).map((maincategory, i) => {
        console.log(maincategory)
        const category = _groupBy(menu[maincategory]);
        console.log(category)
        return (
          <div>

            <h2>{maincategory}</h2>
            {Object.keys(category).map((item, j) => (
              <div>
                <p class="pricerange">{category[item].length} {item} Items - ${minPrice(category[item])} to ${maxPrice(category[item])}</p>
                <ul style={{ 'paddingBottom': '0' }}>
                  {category[item].map(({ title, description, prices }) => (
                    <li>
                      <strong>{title}</strong> - {description} - PRICE {prices}
                    </li>
                  ))}

                </ul>
              </div>
            ))}
          </div>
        )
      })}
    </div>
}

export default App;
