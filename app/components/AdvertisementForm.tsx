'use client';

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvertisementsContext, Advertisement } from '../../contexts/AdvertisementContext';
import { Form, Toast, Col, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import styles from './AdvertisementForm.module.scss';

interface FormValues {
    title: string;
    imageUrl: string;
    isUrgent: boolean; 
}
  
const AdvertisementForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({ title: '', imageUrl: '', isUrgent: false});
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');
  const router = useRouter();
  const { addAdvertisement } = useContext(AdvertisementsContext);


  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast, router,]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    setErrors(errors => ({ ...errors, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formu doğrula, eğer geçersizse işlemi durdur
    if (!validateForm()) return;

    setIsSubmitting(true); 

    const placeholderImagePath = '/placeholder.jpeg';

    try {
      const newAd: Advertisement = {
        id: uuidv4(),
        title: formValues.title,
        imageUrl: formValues.imageUrl || placeholderImagePath,
        favoriteCount: 0,
        lastUpdated: new Date().getTime(),
        isUrgent: formValues.isUrgent
      };
      addAdvertisement(newAd);
      setToastMessage('İlan başarıyla kaydedilmiştir. Ana sayfaya yönlendiriliyorsunuz.');
      setIsSuccess(true);
    } catch (error) {
        setToastMessage('Bir sorun oluştu, ilan kaydedilemedi.');
        setIsSuccess(false); 
        setIsSubmitting(false);
      }
    setShowToast(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(''); // Mevcut hata mesajını temizle

    // Eğer dosya seçilmişse
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

      // Dosya formatı desteklenen formatlardan biri mi diye kontrol et
      if (supportedFormats.includes(file.type)) {
        const reader = new FileReader();

        // Dosya okuma işlemi tamamlandığında çalışır
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
          
          // Canvas oluştur
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Resmin boyutunu düşür
          const maxW = 600;
          const maxH = 400;
          let width = img.width;
          let height = img.height;

          // Resmin oranını koruyarak boyutlandırma
          if (width > height) {
            if (width > maxW) {
              height *= maxW / width;
              width = maxW;
            }
          } else {
            if (height > maxH) {
              width *= maxH / height;
              height = maxH;
            }
          }

          // Canvas boyutlarını ayarla ve resmi çiz
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Canvas'ı Base64 formatında JPEG olarak sıkıştır ve sakla
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // JPEG formatında ve %70 kalitede
          setFormValues(prevValues => ({ ...prevValues, imageUrl: dataUrl }));
        };
        // Resim kaynağını FileReader sonucu olarak ayarla
        img.src = event.target?.result as string;
      };
      // FileReader'ı dosyayı okumak için tetikle
      reader.readAsDataURL(file);
    } else {
      setFileError('Sadece jpeg, jpg, png formatları yüklenebilir.');
    }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prevValues => ({ ...prevValues, isUrgent: e.target.checked }));
  };
  
  const validateForm = () => {
    let newErrors = {};
    if (!formValues.title) {
      newErrors = { ...newErrors, title: 'Lütfen ilan başlığını giriniz.' };
    } else if (formValues.title.length < 8) {
      newErrors = { ...newErrors, title: 'İlan başlığı en az 8 karakter olmalıdır.' };
    }
    setErrors(newErrors);

    // Eğer newErrors nesnesinde hiç hata yoksa, true döndür; aksi halde false döndür
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>  
    <div className="toast_container">
     {showToast && (
        <Row className="d-flex justify-content-center">
          <Toast 
            onClose={() => setShowToast(false)}
            className={isSuccess ? "toast_success" : "toast_error"}
          >
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </Row>
      )}
    </div>
    <Row className="d-flex justify-content-center my-5">
      <Col lg={5} xl={4} className={styles.form_card}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="my-3">
            <Form.Label className="fw-bold">İlan Başlığı</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Başlığı Giriniz"
              value={formValues.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formImageUrl" className="my-3">
            <Form.Label className="fw-bold">İlan Kapak Görseli</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              isInvalid={!!fileError} // Dosya hatası varsa geçersiz olarak işaretle
              accept=".jpeg, .jpg, .png"
            />
              <Form.Control.Feedback type="invalid">
                {fileError || 'Geçersiz dosya formatı.'}
              </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 form-check">
            <Form.Label className="ms-2" htmlFor="urgentCheck">Acil mi?</Form.Label >
            <Form.Control
              type="checkbox"
              className="form-check-input"
              id="urgentCheck"
              checked={formValues.isUrgent}
              onChange={handleCheckboxChange} 
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <button className={styles.submit_btn} type="submit" disabled={isSubmitting}>
              KAYDET
            </button>
          </div>
        </Form>
      </Col>
    </Row>
    </>
  );
};

export default AdvertisementForm;
