import style from '../../../styles/Layout/TopReactions.module.css';

const TopReactions = ({ topReactions }) => {
	return (
		<div className={style.reaction__wrap}>
			{topReactions?.map((item) => {
				return (
					<>
						<div key={item.id} className={style.emoji__wrap}>
							<span>{item.emoji}</span>
							<span className={style.emoji__count}>{item.count}</span>
						</div>
					</>
				);
			})}
		</div>
	);
};

export default TopReactions;
