import React from 'react'
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaPlashder/Skeleton';
import Pagination from '../components/Pagination';
import qs from 'qs'

import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../App'
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice'

import axios from 'axios'

const sortList = [
  { name: 'популярности (DESC)', sortProperty: 'rating', order: 'desc' },
  { name: 'популярности (ASC)', sortProperty: 'rating', order: 'asc' },
  { name: 'цене (DESC)', sortProperty: 'price', order: 'desc' },
  { name: 'цене (ASC)', sortProperty: 'price', order: 'asc' },
  { name: 'алфавиту (ASC)', sortProperty: 'title', order: 'asc' },
  { name: 'алфавиту (DESC)', sortProperty: 'title', order: 'desc' }
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);
  
  const categoryId = useSelector((state) => state.filter.categoryId);
  const currentPage = useSelector((state) => state.filter.currentPage);
  const sortFromState = useSelector((state) => state.filter.sort);
  
  const sort = sortFromState || sortList[0];

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  }
  
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      
      const sort = sortList.find(obj => obj.sortProperty === params.sortProperty) || sortList[0];
      
      dispatch(setFilters({
        categoryId: Number(params.categoryId) || 0,
        currentPage: Number(params.currentPage) || 1,
        sort
      }));
    }
    isSearch.current = true;
  }, [dispatch]);

  React.useEffect(() => {
    setIsLoading(true);

    const sortProperty = sort?.sortProperty || 'rating';
    const order = sort?.order || 'desc';

    const params = {
      page: currentPage,
      limit: 4,
      sortBy: sortProperty,
      order: order
    };

    if (categoryId > 0) params.category = categoryId;
    if (searchValue) params.search = searchValue;

    const queryString = new URLSearchParams(params).toString();
    
    axios.get(`https://689b16ffe727e9657f63b2f6.mockapi.io/Items?${queryString}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [categoryId, sort, searchValue, currentPage]);


  React.useEffect(() => {
    if (isMounted.current) {
      const sortProperty = sort?.sortProperty || 'rating';
    
    const queryString = qs.stringify({
      sortProperty,
      categoryId,
      currentPage,
    });

    navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort, currentPage, navigate]);

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
      <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
    </div>
  );
};

export default Home;