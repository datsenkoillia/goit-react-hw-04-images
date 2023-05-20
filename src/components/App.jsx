import { PixabayAPI } from 'pixabayApi/pixabay-api';
import { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Loader } from './Loader';
import { Button } from './Button';
import { Modal } from './Modal';
import { AppWrapper } from './App.styled';

const pixabayApi = new PixabayAPI();

export function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [forModalLink, setForModalLink] = useState('');

  useEffect(() => {
    if (!searchQuery || page > 1) {
      return;
    }

    pixabayApi.page = page;
    pixabayApi.q = searchQuery;

    async function getFirstPageData() {
      try {
        const { data } = await pixabayApi.fetchPhotos();
        if (data.total === 0) {
          alert(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        const newCards = data.hits;
        setLoading(false);
        setCards(newCards);
      } catch (error) {
        console.log(error);
        alert('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    getFirstPageData();
  }, [page, searchQuery]);

  useEffect(() => {
    if (page === 1) {
      return;
    }

    pixabayApi.page = page;

    async function getNewPageData() {
      try {
        const { data } = await pixabayApi.fetchPhotos();
        if (data.total === 0) {
          alert(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        const newCards = data.hits;
        setLoading(false);
        setCards(prevState => [...prevState, ...newCards]);
      } catch (error) {
        console.log(error);
        alert('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    getNewPageData();
  }, [page]);

  const addPage = () => {
    setLoading(true);
    setPage(prevState => prevState + 1);
  };

  const showModalWindow = link => {
    setForModalLink(link);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(showModal => (showModal = !showModal));
  };

  const handleFormSubmit = searchText => {
    if (searchText === searchQuery) {
      alert('Please enter new data for search');
      return;
    }
    setLoading(true);
    setPage(1);
    setSearchQuery(searchText);
    setCards([]);
  };

  return (
    <AppWrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      {cards.length !== 0 && (
        <ImageGallery imagesArray={cards} showModal={showModalWindow} />
      )}
      {loading && <Loader />}
      {cards.length !== 0 && !loading && (
        <Button handleClick={addPage}></Button>
      )}
      {showModal && (
        <Modal handleClose={toggleModal}>
          <img src={forModalLink} alt="" />
        </Modal>
      )}
    </AppWrapper>
  );
}
