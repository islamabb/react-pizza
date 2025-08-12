import './scss/app.scss';
import Header from './components/Header';
import Categories from './components/Categories';
import Sort from './components/Sort';
import PizzaBlock from './components/PizzaBlock';
import React from 'react';

function App() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('https://689b16ffe727e9657f63b2f6.mockapi.io/Items') // ← без пробелов
      .then((res) => res.json())
      .then((arr) => {
        if (Array.isArray(arr)) {
          setItems(arr);
        } else if (arr.items && Array.isArray(arr.items)) {
          setItems(arr.items);
        } else {
          console.error('Invalid data:', arr);
          setItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          <div className="content__top">
            <Categories />
            <Sort />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          {loading ? (
            <div>Загрузка пицц...</div>
          ) : items.length === 0 ? (
            <div>Нет пицц</div>
          ) : (
            <div className="content__items">
              {items.map((obj) => (
                <PizzaBlock
                  key={obj.id}
                  title={obj.title}
                  price={obj.price}
                  image={obj.imageUrl}
                  sizes={obj.sizes}
                  types={obj.types}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;