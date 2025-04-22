import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Layout/RollingPaper.module.css';

const colors = ['#FBD46D', '#E5D4F4', '#BCE6FF', '#D4F4DD'];
const images = ['/images/bg1.png', '/images/bg2.png', '/images/bg3.png', '/images/bg4.png'];

const CreateRollingForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (to.trim() === "") {
      setError(true);
      return;
    }
    const background = activeTab === "color" ? selectedColor : selectedImage;
    console.log("선택됨:", { to, background });

    navigate('/post/:id');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>To.</label>
      <input
        type="text"
        placeholder="받는 사람 이름을 입력해 주세요"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        onBlur={handleBlur}
        className={styles.input}
      />
      {error && <span className={styles.error}>값을 입력해 주세요.</span>}

      <div>
        <p className={styles.sectionTitle}>배경화면을 선택해 주세요.</p>
        <p className={styles.sectionDesc}>컬러를 선택하거나, 이미지를 선택할 수 있습니다.</p>

        <div>
          <button type="button" onClick={() => setActiveTab("color")}
            className={`${styles.tabButton} ${activeTab === "color" ? styles.activeTab : ''}`}
          >
            컬러
          </button>
          <button type="button" onClick={() => setActiveTab("image")}
            className={`${styles.tabButton} ${activeTab === "image" ? styles.activeTab : ''}`}
          >
            이미지
          </button>
        </div>

        {activeTab === "color" && (
          <div className={styles.colorBoxContainer}>
            {colors.map((color) => (
              <div
                key={color}
                className={`${styles.colorBox} ${selectedColor === color ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
            ))}
          </div>
        )}
        {activeTab === "image" && (
          <div className={styles.imageBoxContainer}>
            {images.map((img) => (
              <div
                key={img}
                className={`${styles.imageBox} ${selectedImage === img ? styles.selected : ''}`}
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => setSelectedImage(img)}
              >
                {selectedImage === img && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>생성하기</button>
    </form>
  );
};

export default CreateRollingForm;
