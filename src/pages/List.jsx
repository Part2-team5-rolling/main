import { useEffect, useState } from 'react';
import { fetchRollingList } from '../api/list'; // 경로만 맞으면 OK

function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1);
        setList(data.results); // 더미 데이터에서도 results 사용하니까 OK
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, []);

  return (
    <div>
      <h2>인기 롤링 페이퍼</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>
          {list.map((item) => (
            <li key={item.id}>{item.title} - {item.recipient}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default List;
