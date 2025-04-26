import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipient } from "../../api/rollingpaper-api";
import styles from '../../styles/Layout/RollingPaper.module.css';

const colors = ['#FFE2AD', '#ECD9FF', '#B1E4FF', '#D0F5C3'];
const images = [
  'https://raw.githubusercontent.com/Part2-team5-rolling/rolling/main/public/images/bg1.png',
  'https://raw.githubusercontent.com/Part2-team5-rolling/rolling/main/public/images/bg2.png',
  'https://raw.githubusercontent.com/Part2-team5-rolling/rolling/main/public/images/bg3.png',
  'https://raw.githubusercontent.com/Part2-team5-rolling/rolling/main/public/images/bg4.png',
];

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
  const [selectedImage, setSelectedImage] = useState("");
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

    let backgroundColor = null;
    let backgroundImageURL = null;

    if (activeTab === "color") {
      backgroundColor = colorMap[selectedColor];
    } else if (activeTab === "image") {
      backgroundImageURL = selectedImage;
    }

    try {
      const recipientData = {
        name: to,
        backgroundColor: backgroundColor,
        backgroundImageURL: backgroundImageURL
      };

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
        onChange={(e) => setTo(e.target.value)}
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
            className={`${styles["rolling-paper__tab-button"]} ${activeTab === "color" ? styles["rolling-paper__active-tab"] : ""
              }`}
          >
            컬러
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`${styles["rolling-paper__tab-button"]} ${activeTab === "image" ? styles["rolling-paper__active-tab"] : ""
              }`}
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
            {images.map((img) => (
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
            ))}
          </div>
        )}
      </div>

      <button type="submit" className={styles["rolling-paper__submit-button"]}>생성하기</button>
    </form>
  );
};

export default RollingPaperForm;
