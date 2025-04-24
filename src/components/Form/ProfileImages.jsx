function ProfileImages({ id, name, images, selectedImage, label, handleChange, className }) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <div>
        <img id={id} src={selectedImage} width={'80px'} height={'80px'} />
        <div>
          <span>프로필 이미지를 선택해주세요!</span>
          <div onClick={(e) => handleChange(name, e.target.src)}>
            {images.map((url, index) => {
              return <img src={url} width={'56px'} height={'56px'} key={index} />
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileImages;
