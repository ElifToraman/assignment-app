'use client';

import React, { useContext, useState} from 'react';
import { Badge, Button, Card, Modal } from 'react-bootstrap';
import { AdvertisementsContext, Advertisement } from '../../contexts/AdvertisementContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import styles from './AdvertisementCard.module.scss';

interface AdvertisementCardProps {
  advertisement: Advertisement;
  handleToast: (message: string, success: boolean) => void; 
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({ advertisement, handleToast }) => {
    const { toggleFavorite, deleteAdvertisement } = useContext(AdvertisementsContext);
    const { id, imageUrl, title, favoriteCount, lastUpdated, isUrgent } = advertisement;
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async (id: string) => {
      try {
        await deleteAdvertisement(id);
        handleToast('İlan başarıyla silinmiştir.', true);
      } catch (error) {
        handleToast('Bir sorun oluştu, ilan silinemedi.', false);
      }
    };
  
    const lastUpdatedDate = new Date(lastUpdated);

    // Tarih formatlayıcı
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  
    // Tarih formatlayıcıyı kullanarak tarihi formatla
    const formattedDate = dateFormatter.format(lastUpdatedDate);

  return (
    <>
      <Card className={styles.advertisement_card}>
        <div className={styles.image_container}>
          <Card.Img variant="top" src={imageUrl} className={styles.card_image} />
          {isUrgent && (
            <Badge bg="danger" className={styles.urgent_badge}>
              <FontAwesomeIcon icon={faFire} className="me-2" /> 
                ACİL 
            </Badge>
          )}
          <Button
            className={styles.favorite_button}
            onClick={() => toggleFavorite(id)}
          >
            <FontAwesomeIcon icon={faHeart} /> 
          </Button>
          <Button
            variant="light"
            className={styles.trash_button}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faTrashCan}/> 
          </Button>
        </div>
        <Card.Body>
          <p>{title}</p>
          <div className={styles.card_body}> 
            <FontAwesomeIcon icon={faHeart} className="me-2" /> 
            Toplam favori sayısı:
            <span className="ms-1 fw-bold">{favoriteCount}</span> 
          </div>
          <div className={styles.card_body}> 
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" /> 
            Son güncellenme: 
            <span className="ms-1 ">{formattedDate}</span> 
          </div>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>İlanı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <span className="fw-bold">{title}</span>
          <p className="mt-2 mb-1">Bu ilanı silmek istediğinize emin misiniz?</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={() => handleDelete(id)}>
            Evet
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
};

export default AdvertisementCard;
