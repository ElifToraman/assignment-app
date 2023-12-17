import { Container , Row, Col } from 'react-bootstrap';
import AdvertisementForm from '../components/AdvertisementForm';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const NewAdvertisement = () => {
    return (
        <>
        <Navbar />
        <Container className="content">
           <Row>
              <Col>
                 <p>
                   <span className='fw-bold me-1'>YENİ İLAN</span>
                   EKLE
                 </p>
              </Col>
           </Row>
           <hr />
           <AdvertisementForm />
        </Container>
        <Footer />
        </>
    )
}

export default NewAdvertisement;
