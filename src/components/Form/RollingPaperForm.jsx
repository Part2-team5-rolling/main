import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipient } from "../../api/rollingpaper-api";
import styles from '../../styles/Layout/RollingPaper.module.css';

const colors = ['#FFE2AD', '#ECD9FF', '#B1E4FF', '#D0F5C3'];
const images = [
  'https://i.pinimg.com/originals/b3/96/7b/b3967bce72b7a92d70c0d1010ed745d1.jpg',
  'https://i.pinimg.com/originals/b5/f5/ac/b5f5aca4c3958e2b8a3424ed11bb2dff.jpg',
  'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=11289000&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNS8wMi9DTFM2OS9OVVJJXzAwMV8wNDg2X251cmltZWRpYV8yMDE1MTIwMw==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006',
  'https://d22wqd5mfy0u09.cloudfront.net/wp-content/uploads/2021/01/13175859/slider-image4.0984575d.png'];

const colorMap = {
  '#FFE2AD': 'beige',
  '#ECD9FF': 'purple',
  '#B1E4FF': 'blue',
  '#D0F5C3': 'green',
};

const RollingPaperForm = () => {
  const [to, setTo] = useState("");
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("color");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const navigate = useNavigate();

  const handleBlur = () => {
    if (to.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (to.trim() === "") {
      setError(true);
      return;
    }

    const recipientData = { name: to };

    if (activeTab === "color") {
      recipientData.backgroundColor = colorMap[selectedColor];
    } else if (activeTab === "image") {
      recipientData.backgroundImageURL = selectedImage;
    }

    if (!recipientData.backgroundColor) {
      recipientData.backgroundColor = colorMap[colors[0]];
    }

    try {
      const response = await createRecipient(recipientData);
      const newId = response.id;

      alert("롤링페이퍼가 성공적으로 생성되었습니다!");
      navigate(`/post/${newId}`);
    } catch (err) {
      console.error("에러 내용:", err);
      alert("롤링페이퍼 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['rolling-paper__form']}>
      <label className={styles['rolling-paper__label']}>To.</label>
      <input
        type="text"
        placeholder="받는 사람 이름을 입력해 주세요"
        value={to}
        onChange={(e) => {
          setTo(e.target.value);
          if (e.target.value.trim() !== "") {
            setError(false);
          }
        }}
        onBlur={handleBlur}
        maxLength={40}
        className={styles['rolling-paper__input']}
      />
      {error && (<span className={styles['rolling-paper__error']}>값을 입력해 주세요.</span>)}

      <div>
        <p className={styles['rolling-paper__section-title']}>배경화면을 선택해 주세요.</p>
        <p className={styles['rolling-paper__section-desc']}>컬러를 선택하거나, 이미지를 선택할 수 있습니다.</p>

        <div className={styles["rolling-paper__tab-buttons"]}>
          <button
            type="button"
            onClick={() => setActiveTab("color")}
            className={`${styles["rolling-paper__tab-button"]} ${activeTab === "color" ? styles["rolling-paper__active-tab"] : ""}`}
          >
            컬러
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`${styles["rolling-paper__tab-button"]} ${activeTab === "image" ? styles["rolling-paper__active-tab"] : ""}`}
          >
            이미지
          </button>
        </div>

        {activeTab === "color" && (
          <div className={styles["rolling-paper__color-box-container"]}>
            {colors.map((color) => (
              <div
                key={color}
                className={`${styles["rolling-paper__color-box"]} ${selectedColor === color ? styles["rolling-paper__selected"] : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <div className={styles["rolling-paper__checkmark"]}>✓</div>
                )}
              </div>
            ))}
          </div>
        )}
        {activeTab === "image" && (
          <div className={styles["rolling-paper__image-box-container"]}>
            {images.map((img) => {
              return (
                <div
                  key={img}
                  className={`${styles["rolling-paper__image-box"]} ${selectedImage === img ? styles["rolling-paper__selected"] : ''}`}
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => setSelectedImage(img)}
                >
                  {selectedImage === img && (
                    <div className={styles["rolling-paper__checkmark"]}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button type="submit" className={styles["rolling-paper__submit-button"]}>생성하기</button>
    </form>
  );
};

export default RollingPaperForm;