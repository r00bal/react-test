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

function App({ sheetdbId }) {
  const [menu, setMenu] = useState();
  const [restaurant, setRestaurant] = useState();

  useEffect(() => {
    async function fetchData() {
      const resultMenu = await axios(`https://sheetdb.io/api/v1/${sheetdbId}?sheet=menu`,
      );
      const { data } = resultMenu;

      setMenu(groupBy((data), 'maincategory'));
    }
    fetchData()
  }, [sheetdbId]);

  useEffect(() => {
    async function fetchData() {
      const resultRestaurant = await axios(
        `https://sheetdb.io/api/v1/${sheetdbId}?sheet=location`,
      );
      setRestaurant(resultRestaurant.data[0]);
    }
    fetchData()
  }, [sheetdbId]);

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

      {
        restaurant && (
          <footer>
            <h2>Hours and Phone</h2>
            <ul>
              <li>{restaurant.address}</li>
              <li>Phone - <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></li>
              <li>{restaurant.hours1}</li>
              <li>Curbside Pick Available - {restaurant.hours2}</li>
              <li><a href={`${restaurant.website}`} className="broken_link">Website</a></li>
              <li><a href={`${restaurant.facebook}`} className="broken_link">Facebook</a></li>
              <li><a href={`${restaurant.instagram}`} className="broken_link">Instagram</a></li>
            </ul>
          </footer>
        )}

    </div>


    // <div v-for="(category, mainCategory) in menu">
    //   <h2>{{ mainCategory }}</h2>
    //   <div v-for="(items,category) in groupBy(category)">
    //     <p class="pricerange">{{ items.length }} {{ category }} Items - ${{ minPrice(items) }} to ${{ maxPrice(items) }}</p>
    //     <ul style="padding-bottom:0;">
    //       <li v-for="item in items"><b>{{ item.title }}</b> - {{ item.description }} - PRICE {{ item.prices }}</li>
    //     </ul>
    //   </div>
    // </div>
  );
}

export default App;
