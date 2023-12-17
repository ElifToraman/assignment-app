'use client';

import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Toast } from 'react-bootstrap';
import { Advertisement, AdvertisementsContext } from '../contexts/AdvertisementContext';
import AdvertisementCard from './components/AdvertisementCard';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import styles from './page.module.scss'

const HomePage = () => {
  const { advertisements } = useContext(AdvertisementsContext);
  const [sortKey, setSortKey] = useState<'most' | 'least' | 'latest'>('latest');
  const [dropdownTitle, setDropdownTitle] = useState('Sırala');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [sortedAds, setSortedAds] = useState(advertisements);

  useEffect(() => {
    const newSortedAds = [...advertisements].sort((a, b) => {
      // Eğer sıralama anahtarı 'most' ise, favori sayısına göre azalan sırada sırala
      // Eğer favori sayıları eşitse, son güncellenme zamanına göre sırala
      if (sortKey === 'most') {
        return b.favoriteCount - a.favoriteCount || b.lastUpdated - a.lastUpdated;
      } 
      // Eğer sıralama anahtarı 'least' ise, favori sayısına göre artan sırada sırala
      // Eğer favori sayıları eşitse, son güncellenme zamanına göre sırala
      else if (sortKey === 'least') {
        return a.favoriteCount - b.favoriteCount || b.lastUpdated - a.lastUpdated;
      }
      // Diğer durumlarda, sadece son güncellenme zamanına göre azalan sırada sırala
      else {
        return b.lastUpdated - a.lastUpdated;
      }
    });

    setSortedAds(newSortedAds);
  }, [sortKey, advertisements]);

  const handleFilterSelect = (filterKey: 'most' | 'least' | 'latest', filterTitle: string) => {
    setSortKey(filterKey); // Filtreleme anahtarını güncelle
    setDropdownTitle(filterTitle); // Dropdown başlığını güncelle
  };

  const handleToast = (message: string, success: boolean) => {
    setToastMessage(message);
    setIsSuccess(success);
    setShowToast(true);
  
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  

  return (
    <>
    <Navbar />
    <div className="toast_container">
      {showToast && (
        <Row className="d-flex justify-content-center">
        <Toast
          delay={3000}
          autohide
          className={isSuccess ? "toast_success" : "toast_error"}
          >
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </Row>
      )}
    </div>
    <Container className="content">
    <Row className="mb-3 d-flex justify-content-between">
      <Col className="d-flex justify-content-start align-items-center">
        <p className="pt-2"><span className="fw-bold me-1">ANA SAYFA</span>VİTRİNİ</p>
      </Col>
      <Col className="d-flex justify-content-end">
        <Dropdown>
          <Dropdown.Toggle className={styles.filter_btn}>
          {dropdownTitle}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilterSelect('latest', 'En son eklenen')}>En son eklenen</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterSelect('most', 'Favori Sayısı En Çok')}>Favori Sayısı En Çok</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterSelect('least', 'Favori Sayısı En Az')}>Favori Sayısı En Az</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
    <hr />
    <Row>
      {sortedAds.length > 0 ? (
        <Row>
          {sortedAds.map((ad: Advertisement) => (
            <Col key={ad.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <AdvertisementCard 
                advertisement={ad} 
                handleToast={handleToast}
              />
            </Col>
          ))}
        </Row>
        ) : (
          <Row className="justify-content-center">
            <p>Henüz hiç ilan eklenmedi.</p>
          </Row>
        )
      }
    </Row>
    </Container>
    <Footer />
    </>
  );
};

export default HomePage;
