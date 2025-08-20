import React from 'react'
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaPlashder/Skeleton';

const sortList = [
  { name: 'популярности (DESC)', sortProperty: 'rating', order: 'desc' },
  { name: 'популярности (ASC)', sortProperty: 'rating', order: 'asc' },
  { name: 'цене (DESC)', sortProperty: 'price', order: 'desc' },
  { name: 'цене (ASC)', sortProperty: 'price', order: 'asc' },
  { name: 'алфавиту (ASC)', sortProperty: 'title', order: 'asc' },
  { name: 'алфавиту (DESC)', sortProperty: 'title', order: 'desc' }
];

const Home = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [sortType, setSortType] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    
    const sortObj = sortList[sortType];
    const sortProperty = sortObj?.sortProperty || 'rating';
    const order = sortObj?.order || 'desc';
    
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    
    fetch(`https://689b16ffe727e9657f63b2f6.mockapi.io/Items?${category}${category ? '&' : ''}sortBy=${sortProperty}&order=${order}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка сети');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Ожидался массив, но получено:', data);
          setItems([]);
        }
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
        setItems([]);
      })
      .finally(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      });
  }, [categoryId, sortType]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={(i) => setCategoryId(i)}/>
        <Sort value={sortType} onClickSort={(i) => setSortType(i)}/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading ?
          [...new Array(6)].map((_, index) => <Skeleton key={index}/>)
          : items.map((obj) => (
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
    </div>
  )
}

export default Home;