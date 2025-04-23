import { useParams } from 'react-router-dom';
import SendMessageForm from '../components/Form/SendMessageForm';
import style from '../styles/Pages/SendMessagePage.module.css';

function SendMessagePage() {
	const { id } = useParams();
	const reciipientId = id ?? Number(id);
	return (
  <div className={style.content}>
    {isNaN(reciipientId) ? <div>error</div> : <SendMessageForm reciipientId={reciipientId} />}
  </div>
  );
}

export default SendMessagePage;
