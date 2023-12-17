import { Row } from 'react-bootstrap';
import styles from './footer.module.scss'

const Footer = () => {

  return (
    <div className={styles.footer}>
      <Row className=" d-flex justify-content-center mx-3 mb-3 fw-bold">
        © 2023 Company
      </Row>
      <div className="d-flex justify-content-center">
        <p className="mx-1 navbar_items">
          Hüküm ve Koşullar
        </p>
        <p>•</p>
        <p className="mx-1 navbar_items">
          Gizlilik Politikası
        </p>
      </div>
    </div>
  );
};

export default Footer;
