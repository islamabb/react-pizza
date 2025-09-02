import React from 'react'
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaPlashder/Skeleton';
import Pagination from '../components/Pagination';
import {SearchContext} from '../App'
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId} from '../redux/slices/filterSlice'


const sortList = [
  { name: 'популярности (DESC)', sortProperty: 'rating', order: 'desc' },
  { name: 'популярности (ASC)', sortProperty: 'rating', order: 'asc' },
  { name: 'цене (DESC)', sortProperty: 'price', order: 'desc' },
  { name: 'цене (ASC)', sortProperty: 'price', order: 'asc' },
  { name: 'алфавиту (ASC)', sortProperty: 'title', order: 'asc' },
  { name: 'алфавиту (DESC)', sortProperty: 'title', order: 'desc' }
];

const Home = () => {
  const dispatch = useDispatch();
  const {categoryId, sort} = useSelector((state) => state.filter);

  const {searchValue} = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);

  const onChangeCategory = (id) => {
  console.log(id)
  dispatch(setCategoryId(id));
  }


React.useEffect(() => {
  setIsLoading(true);

  const sortObj = sortList[sort.sortProperty];
  
  // Создаем объект параметров
  const params = {
    page: currentPage,
    limit: 4,
    sortBy: sortObj?.sortProperty || 'rating',
    order: sortObj?.order || 'desc'
  };

  // Добавляем опциональные параметры
  if (categoryId > 0) params.category = categoryId;
  if (searchValue) params.search = searchValue;

  // Формируем URL с помощью URLSearchParams
  const queryString = new URLSearchParams(params).toString();
  const url = `https://689b16ffe727e9657f63b2f6.mockapi.io/Items?${queryString}`;

  console.log('Fetching:', url); // Для дебага

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setItems(Array.isArray(data) ? data : []);
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      setItems([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, [categoryId, sort.sortProperty, searchValue, currentPage]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : items.length > 0
          ? items.map((obj) => (
              <PizzaBlock
                key={obj.id}
                title={obj.title}
                price={obj.price}
                image={obj.imageUrl}
                sizes={obj.sizes}
                types={obj.types}
              />
            ))
          : <div>Пицца не найдена по запросу "{searchValue}"</div>
        }
      </div>
        <Pagination onChangePage={number => setCurrentPage(number)}/>
    </div>
  );
};

export default Home;