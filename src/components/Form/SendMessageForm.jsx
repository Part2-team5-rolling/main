import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMessage } from '../../api/messages-api';
import Input from '../common/Input';
import SelectBox from '../common/SelectBox';
import Button from '../common/Button';
import style from '../../styles/Form/SendMessageForm.module.css';
import TextEditor from '../../styles/Form/TextEditor';
import ProfileImages from './ProfileImages';

const RELATIONSHIP_OPTIONS = ['친구', '지인', '동료', '가족'];
const FONT_OPTIONS = ['Noto Sans', 'Pretendard', '나눔명조', '나눔손글씨 손편지체'];
const IMAGE_URLS = [
  'https://learn-codeit-kr-static.s3.ap-northeast-2.amazonaws.com/sprint-proj-image/default_avatar.png',
  'https://picsum.photos/id/522/100/100',
  'https://picsum.photos/id/547/100/100',
  'https://picsum.photos/id/268/100/100',
  'https://picsum.photos/id/1082/100/100',
  'https://picsum.photos/id/571/100/100',
  'https://picsum.photos/id/494/100/100',
  'https://picsum.photos/id/859/100/100',
  'https://picsum.photos/id/437/100/100',
  'https://picsum.photos/id/1064/100/100'
]

function SendMessageForm({ reciipientId }) {
  const [error, setError] = useState({
    error: false,
    message: '값을 입력해 주세요.',
  });
  const [contentError, setContentError] = useState(true);
  const [values, setValues] = useState({
    from: '',
    profileImageURL: IMAGE_URLS[0],
    relationship: RELATIONSHIP_OPTIONS[0],
    content: '',
    font: FONT_OPTIONS[0],
  });
  const navigate = useNavigate();


  const validateValue = (value, constraint, errorCallback) => {
    const { error, message } = constraint(value);
    errorCallback(error, message);
  }

  const stringLengthConstraint = (value, min, max) => {
    if (min && value.length < min) return { error: true, message: min === 1 ? '값을 입력해 주세요.' : `최소 ${min}자는 입력해야 합니다.`};
    if (max && value.length > max) return { error: true, message: `최대 ${max}자까지만 입력 가능합니다.` };
    return { error: false, message: '' };
  };

  const fromConstraint = (value) => stringLengthConstraint(value, 1, 40);
  const fromErrorCallback = (isError, errorMessage) => {
    if (error !== isError) {
      setError((prev) => ({
        ...prev,
        error: isError,
        message: errorMessage,
      }));
    };
  };

  const cententConstraint = (value) => stringLengthConstraint(value, 1);
  const contentErrorCallback = (isError) => {
    if (contentError !== isError) {
      setContentError(isError);
    };
  };

  const handleBlur = (e) => {
    validateValue(e.target.value, fromConstraint, fromErrorCallback);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };
      validateValue(newValues.from, fromConstraint, fromErrorCallback);
      validateValue(newValues.content, cententConstraint, contentErrorCallback);
      return newValues;
    });
  };

  const handleImageChange = (name, src) => {
    setValues((prev) => ({ ...prev, [name]: src}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiParams = {
      ...values,
    };
    const result = await createMessage(reciipientId, apiParams);
    navigate(`/post/${reciipientId}`);
  };
    
  return (
    <form className={style.send__message__form} onSubmit={handleSubmit}>
      <div>
        <Input
          id={'from'}
          name={'from'}
          value={values.from}
          label={'From.'}
          placeholder={'이름을 입력해 주세요.'}
          error={error}
          className={style.input__container}
          handleChange={handleChange}
          handleBlur={handleBlur} />
        <ProfileImages
          id={'profileImageURL'}
          name={'profileImageURL'}
          images={IMAGE_URLS}
          selectedImage={values.profileImageURL}
          label={'프로필 이미지'}
          className={style.profile__container}
          handleChange={handleImageChange} />
        <SelectBox
          id={'relationship'}
          name={'relationship'}
          label={'상대와의 관계'}
          className={style.select__container}
          options={RELATIONSHIP_OPTIONS.map((e, idx)=> ({ id: idx, value: e, label: e }))}
          handleChange={handleChange} />
        <div>
          <label htmlFor='content'>내용을 입력해 주세요.</label>
          <TextEditor className={style.editor__container} handleChange={(data) => handleChange({target: { name: 'content', value: data }})} />
        </div>
        <SelectBox
          id={'font'}
          name={'font'}
          label={'폰트 선택'}
          options={FONT_OPTIONS.map((e, idx)=> ({ id: idx, value: e, label: e }))}
          className={style.select__container}
          selectedOption={values.font}
          handleChange={handleChange} />
      </div>
      <Button className={`button--primary`} type='submit' disabled={error.error || contentError}>생성하기</Button>
    </form>
  );
}

export default SendMessageForm;
