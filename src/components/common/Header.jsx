import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from '../../styles/Header.module.css';
import headerlogo from '../../assets/header-logo.png';

const Header = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <header className={styles.header}> 
      <div className={styles.header_contents}> 
        <img 
          src={headerlogo} 
          onClick={() => goToPage('/')} 
          className={styles.header_img}  
          alt="메인페이지 로고" 
        />
        <div className={styles.header__box__container}>
          <Button onClick={() => goToPage('/post')} className={styles.button__outlinedButton}> 
            롤링 페이퍼 만들기
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
