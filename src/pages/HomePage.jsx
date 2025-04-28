import React from 'react';
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import { useNavigate } from 'react-router-dom';
import mainImage01 from '../assets/home-content-01.png';
import mainImage02 from '../assets/home-content-02.png';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.homepage}>
      <Header />

      <section className={styles.homepage__contents}>
        {/* Point 01 */}
        <article className={`${styles.homepage__content} ${styles.homepage__content__01}`}>
          <div className={styles.homepage__text}>
            <h3 className={styles.homepage__title}>Point.01</h3>
            <p className={styles.homepage__highlight}><span>누구나 손쉽게, 온라인</span> 롤링페이퍼를 만들 수 있어요</p>
            <p className={styles.homepage__subtext}>로그인 없이 자유롭게 만들어요.</p>
          </div>
          <img className={styles.homepage__image} src={mainImage01} alt='메인 이미지 카드' />
        </article>

        {/* Point 02 */}
        <article className={`${styles.homepage__content} ${styles.homepage__content__02}`}>
          <div className={styles.homepage__text}>
            <h3 className={styles.homepage__title}>Point. 02</h3>
            <p className={styles.homepage__highlight}><span>서로에게 이미지로 감정을 </span>표현해보세요</p>
            <p className={styles.homepage__subtext}>롤링 페이퍼에 이모지를 추가할 수 있어요.</p>
          </div>
          <img className={styles.homepage__image} src={mainImage02} alt='메인 이미지' />
        </article>

        <div className={styles.homepage__box__container}>
          <Button onClick={() => goToPage('/list')} className={styles.button__primary}>구경해보기</Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
