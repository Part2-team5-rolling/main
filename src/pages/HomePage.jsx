import React from 'react';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css'
import mainImage01 from '../assets/home-content-01.png';
import mainImage01Mobile from '../assets/home-content-01--mobile.png';
import mainImage02 from '../assets/home-content-02.png';
import mainImage02Mobile from '../assets/home-content-02--mobile.png';


function HomePage() {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

    return (
      <div className='homepage'>
        <Header />

        <section className='homepage__contents'>
          {/* Point 01 */}
          <article className='homepage__content homepage__content--01'>
            <div className='homepage__text'>
              <h3 className='homepage__title' >Point.01</h3>
              <p className='homepage__highlight'><span>누구나 손쉽게, 온라인</span> 롤링페이퍼를 만들 수 있어요</p>
              <p className='homepage__subtext'>로그인 없이 자유롭게 만들어요.</p>
            </div>
            <picture>
              <source media="(max-width: 767px)" srcSet={mainImage01Mobile} />
              <img className='homepage__image' src={mainImage01} alt='메인 이미지 카드' />
            </picture>
          </article>

          {/* Point 02 */}
          <article className='homepage__content homepage__content--02'>
            <div className='homepage__text'>
              <h3 className='homepage__title'>Point. 02</h3>
              <p className='homepage__highlight'><span>서로에게 이미지로 감정을 </span>표현해보세요</p>
              <p className='homepage__subtext'>롤링 페이퍼에 이모지를 추가할 수 있어요.</p>
            </div>
            <picture>
              <source media="(max-width: 767px)" srcSet={mainImage02Mobile} />
              <img className='homepage__image' src={mainImage02} alt='메인 이미지' />
            </picture>
          </article>

          <Button onClick={() => goToPage('/list')} className='button--primary'>구경해보기</Button>
        </section>
      </div>
    )
}

export default HomePage;
