import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../../styles/Header.css'
import headerlogo from '../../assets/header-logo.png'

const Header = () => {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <header className='header'>
      <div className='header-contents'>
        <img src={headerlogo} onClick={() => goToPage('/')} style={{ cursor: 'pointer' }} alt="메인페이지 로고" />
        <div className='header__box--container'>
          <Button onClick={() => goToPage('/post')} className="button--outlinedButton">롤링 페이퍼 만들기</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
