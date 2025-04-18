import { useParams } from "react-router-dom";
import SendMessageForm from "../components/Form/SendMessageForm";

function SendMessagePage() {
  const { id } = useParams();
  const reciipientId = id ?? Number(id);
  return <>{isNaN(reciipientId) ? <div>error</div> : <SendMessageForm reciipientId={reciipientId} />}</>;
}

export default SendMessagePage;
