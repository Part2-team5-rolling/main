import React from 'react';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleGoToAbout = (path) => {
    navigate(path);
  };

    return (
      <>
        <Header />
        <h1>홈페이지입니다!</h1>
        <Button onClick={() => handleGoToAbout('./post')} className="OutlinedButton">롤링 페이퍼 만들기</Button>
        <Button onClick={() => handleGoToAbout('./list')} className="PrimaryButton">구경해보기</Button>
      </>
    )
}

export default HomePage;
