import { Row, Col } from 'react-bootstrap';
import Link from '@/node_modules/next/link'
import styles from'./navbar.module.scss';

const Navbar = () => {
 
  return (
    <nav className={styles.navbar_header}>
      <Row className="d-flex justify-content-between">
        <Col className="d-flex justify-content-start align-items-center">
          <Link href="/" className={styles.logo}>
            LOGO
          </Link>
        </Col>
        <Col className="d-flex justify-content-end">
          <Link href="/add-new" className={styles.new_btn}>
            Yeni ilan ekle
          </Link>
        </Col>
      </Row>
    </nav>
  );
};

export default Navbar;
