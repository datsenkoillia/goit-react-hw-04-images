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
  const [isCardsShow, setIsCardsShow] = useState(false);

  useEffect(() => {
    if (!isCardsShow) {
      return;
    }

    async function getData() {
      try {
        const { data } = await pixabayApi.fetchPhotos(page, searchQuery);
        if (data.total === 0) {
          alert(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        const newCards = data.hits;
        setCards(prevState => [...prevState, ...newCards]);
      } catch (error) {
        console.log(error);
        alert('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [isCardsShow, page, searchQuery]);

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
    setIsCardsShow(true);
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
