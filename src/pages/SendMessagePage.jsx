import { useParams } from 'react-router-dom';
import SendMessageForm from '../components/Form/SendMessageForm';
import style from '../styles/Pages/SendMessagePage.module.css';
import Header from '../components/common/Header';

function SendMessagePage() {
	const { id } = useParams();
	const reciipientId = id ?? Number(id);
	return (
    <>
      <Header />
      <div className={style.content}>
        {isNaN(reciipientId) ? <div>error</div> : <SendMessageForm reciipientId={reciipientId} />}
      </div>
    </>
  );
}

export default SendMessagePage;
