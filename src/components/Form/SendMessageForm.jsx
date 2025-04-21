import { useState } from 'react';
import { createMessage } from '../../api/messages-api';
import Input from '../common/Input';
import SelectBox from '../common/SelectBox';
import Button from '../common/Button';

const RELATIONSHIP_OPTIONS = ['친구', '지인', '동료', '가족'];
const FONT_OPTIONS = ['Noto Sans', 'Pretendard', '나눔명조', '나눔손글씨 손편지체'];

function SendMessageForm({ reciipientId }) {
  const [error, setError] = useState({
    error: false,
    message: '값을 입력해 주세요.',
  });

  const [values, setValues] = useState({
    from: '',
    profileImageURL: 'https://picsum.photos/id/547/100/100',
    relationship: '친구',
    content: '',
    font: 'Noto Sans',
  });

  const handleBlur = (e) => {
    if (!values.from) {
      setError((prev) => ({
        ...prev,
        error: true,
      }))
    } else {
      setError((prev) => ({
        ...prev,
        error: false,
      }))
    }
  }

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
      <Input
        id={'from'}
        name={'from'}
        value={values.from}
        label={'From.'}
        placeholder={'이름을 입력해 주세요.'}
        error={error}
        handleChange={handleChange}
        handleBlur={handleBlur} />
      <div>
        <label htmlFor="profileImageURL">프로필 이미지</label>
        <input id="profileImageURL" name="profileImageURL" value={values.profileImageURL} onChange={handleChange} />
      </div>
      <SelectBox
        id={'relationship'}
        name={'relationship'}
        label={'상대와의 관계'}
        options={RELATIONSHIP_OPTIONS.map((e, idx)=> ({ id: idx, value: e, label: e }))}
        handleChange={handleChange} />
      <div>
        <label htmlFor="content">내용을 입력해 주세요.</label>
        <textarea id="content" name="content" value={values.content} onChange={handleChange} />
      </div>
      <SelectBox
        id={'font'}
        name={'font'}
        label={'폰트 선택'}
        options={FONT_OPTIONS.map((e, idx)=> ({ id: idx, value: e, label: e }))}
        selectedOption={values.font}
        handleChange={handleChange} />
      <Button type='submit'>생성하기</Button>
    </form>
  );
}

export default SendMessageForm;
