import { useContext, useEffect } from 'react';
import style from '../../../styles/ShareMenu.module.css';
import { ToastContext } from '../../../hooks/ToastContextProvider';

const { Kakao } = window;
const ShareMenu = ({ onClick, commentCount }) => {
	const currentUrl = window.location.href;
	const { showToast } = useContext(ToastContext);

	const handleCopyUrl = () => {
		navigator.clipboard
			.writeText(currentUrl)
			.then(() => {
				showToast('URL이 복사되었습니다.');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

  const handleKakaoShare = () => {
    const appURL = import.meta.env.VITE_KAKAO_APP_KEY;
    const link = {
      webUrl: appURL,
    }
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '롤링페이퍼',
        description: '#롤링페이퍼',
        link,
      },
      social: {
        commentCount,
      },
      buttons: [
        {
          title: '웹으로 보기',
          link,
        },
      ],
    });
  };

  useEffect(() => {
    Kakao.cleanup();
    const appKey = import.meta.env.VITE_KAKAO_APP_KEY; 
    Kakao.init(appKey);
    console.log(Kakao.isInitialized());
  }, []);

	return (
		<>
			<ul className={style.share__text__wrap}>
				<li className={style.share__text} onClick={(e) => { 
            handleKakaoShare();
            onClick(e);
          }}>
					카카오톡 공유
				</li>
				<li
					className={style.share__text__desc}
					onClick={() => {
						onClick();
						handleCopyUrl();
					}}>
					URL 공유
				</li>
			</ul>
		</>
	);
};

export default ShareMenu;
