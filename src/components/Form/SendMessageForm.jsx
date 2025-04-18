import { useState } from "react";
import { createMessage } from "../../api/messages-api";

function SendMessageForm({ reciipientId }) {
  const [values, setValues] = useState({
    from: '',
    profileImageURL: 'https://picsum.photos/id/547/100/100',
    relationship: '친구',
    content: '',
    font: 'Noto Sans',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiParams = {
      ...values,
    };
    const result = await createMessage(reciipientId, apiParams);
  };
    
  return (
    <form  onSubmit={handleSubmit}>
      <label htmlFor="from">From.</label>
      <input id="from" name="from" value={values.from} placeholder="이름을 입력해 주세요." onChange={handleChange} />
      <label htmlFor="profileImageURL">프로필 이미지</label>
      <input id="profileImageURL" name="profileImageURL" value={values.profileImageURL} onChange={handleChange} />
      <label htmlFor="relationship">상대와의 관계</label>
      <select id="relationship" name="relationship" value={values.relationship} onChange={handleChange}>
        <option value="친구" key="1">친구</option>
        <option value="지인" key="2">지인</option>
        <option value="동료" key="3">동료</option>
        <option value="가족" key="4">가족</option>
      </select>
      <label htmlFor="content">내용을 입력해 주세요.</label>
      <textarea id="content" name="content" value={values.content} onChange={handleChange} />

      <label htmlFor="font">폰트 선택</label>
      <select id="font" name="font" value={values.font} onChange={handleChange}>
        <option value="Noto Sans" key="1">Noto Sans</option>
        <option value="Pretendard" key="2">Pretendard</option>
        <option value="나눔명조" key="3">나눔명조</option>
        <option value="나눔손글씨 손편지체" key="4">나눔손글씨 손편지체</option>
      </select>
      <button>생성하기</button>
    </form>
  )
}

export default SendMessageForm;
