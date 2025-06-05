import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AiRecommend.css';

function AiRecommend() {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    eduOfficeCode: 'B10',
    adminZone: ''
  });
  const [selectedLevel, setSelectedLevel] = useState('보습');
  const [userSubjects, setUserSubjects] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const courseList = {
    '보습': ['보습', '진학상담지도', '진학지도', '독서실', '독서실(유아/초·중·고)', '독서실(중)', '독서실(일반인)', '속셈', '속독', '주산'],
    '입시·논술': ['보습·논술', '입시', '입시·논술'],
    '예체능·취미': ['음악', '미술', '무용', '댄스', '연극', '영화', '사진', '연기', '서예', '도예', '꽃꽂이', '애견미용'],
    '외국어·어학': ['영어회화', '일본어', '중국어', '프랑스어', '독일어', '스페인어'],
    'IT·컴퓨터': ['컴퓨터', '소프트웨어', '정보처리', '게임', '통계', '로봇', '전자상거래'],
    '기술·기능·기타': ['요리', '미용', '바리스타', '제과제빵', '자동차', '기계', '건축', '토목', '전기', '전자', '조경', '환경', '청소', '안전관리', '광업자원'],
    '경영·사무·서비스': ['경영', '경리', '방송', '출판', '모델', '행정'],
    '기타·특화': ['바둑', '마술', '속기', '주산', '방송', '모델', '국제', '독서실', '학교교과교습학원', '특수학교과정']
  };

  // ✅ 시·도 (교육청 코드) 리스트
  const eduOffices = [
    { name: '서울특별시', code: 'B10' },
    { name: '부산광역시', code: 'C10' },
    { name: '대구광역시', code: 'D10' },
    { name: '인천광역시', code: 'E10' },
    { name: '광주광역시', code: 'F10' },
    { name: '대전광역시', code: 'G10' },
    { name: '울산광역시', code: 'H10' },
    { name: '세종특별자치시', code: 'I10' },
    { name: '경기도', code: 'J10' },
    { name: '강원도', code: 'K10' },
    { name: '충청북도', code: 'M10' },
    { name: '충청남도', code: 'N10' },
    { name: '전라북도', code: 'P10' },
    { name: '전라남도', code: 'Q10' },
    { name: '경상북도', code: 'R10' },
    { name: '경상남도', code: 'S10' },
    { name: '제주특별자치도', code: 'T10' }
  ];

  // ✅ 각 시·도별 행정구역 리스트 (샘플)
  const adminZones = {
    'B10': ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'],
    'C10': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
    'D10': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
    'E10': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
    'F10': ['동구', '서구', '남구', '북구', '광산구'],
    'G10': ['동구', '중구', '서구', '유성구', '대덕구'],
    'H10': ['중구', '남구', '동구', '북구', '울주군'],
    'I10': ['세종시'],
    'J10': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '여주시', '양평군', '고양시', '연천군', '포천시', '가평군'],
    'K10': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    'M10': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    'N10': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    'P10': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    'Q10': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    'R10': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    'S10': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    'T10': ['제주시', '서귀포시']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'eduOfficeCode') {
      setForm(prev => ({
        ...prev,
        adminZone: adminZones[value]?.[0] || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, eduOfficeCode, adminZone } = form;
    const subject = selectedLevel === '보습' ? userSubjects : form.subject;

    if (!name.trim() || !adminZone.trim() || !subject.trim()) {
      alert('이름, 행정구역, 과목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setGptResponse('');

    try {
      const apiData = await axios.get('https://open.neis.go.kr/hub/acaInsTiInfo', {
        params: {
          KEY: process.env.REACT_APP_NEIS_API_KEY,
          Type: 'json',
          pIndex: 1,
          pSize: 10,
          ATPT_OFCDC_SC_CODE: eduOfficeCode,
          ADMST_ZONE_NM: adminZone,
          LE_CRSE_NM: selectedLevel === '보습' ? '보습' : form.subject
        }
      });

      if (!apiData.data.acaInsTiInfo || apiData.data.acaInsTiInfo.length < 2 || apiData.data.acaInsTiInfo[1].row.length === 0) {
        setGptResponse(`'${adminZone}' 지역에 '${subject}' 교습과정 학원이 없습니다.`);
        setLoading(false);
        return;
      }

      const academyList = apiData.data.acaInsTiInfo[1].row.map(a => (
        `- ${a.ACA_NM} (주소: ${a.FA_RDNMA}, 전화번호: ${a.FA_TELNO || '없음'})`
      )).join('\n');

      const prompt = `
사용자 이름: ${name}
카테고리: ${selectedLevel}
사용자가 입력한 과목: ${subject}
행정구역명: ${adminZone}

아래 학원 목록 중에서 사용자가 입력한 과목(${subject})에 맞는 학원 3곳 정도를 추천해줘.
추천할 때는 학원명, 주소, 전화번호를 꼭 함께 표기해줘.
각 학원에 대한 간단한 추천 이유도 작성해줘.

학원 목록:
${academyList}
`;

      const gptRes = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: '너는 학원 추천 전문가야.' },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = gptRes.data.choices?.[0]?.message?.content || '추천 결과를 가져올 수 없습니다.';
      setGptResponse(content);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-recommend-container">
      <h2>🤖 AI 학원 추천 받기</h2>
      <form onSubmit={handleSubmit} className="ai-form">
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
        />
        {/* ✅ 카테고리 선택 */}
        <select value={selectedLevel} onChange={(e) => {
          const level = e.target.value;
          setSelectedLevel(level);
          // ✅ "보습"이 아닐 때만 과목 초기화
          if (level !== '보습') {
            setForm(prev => ({
              ...prev,
              subject: courseList[level][0]
            }));
          }
        }}>
          {Object.keys(courseList).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {/* ✅ 과목 입력/선택 */}
        {selectedLevel === '보습' ? (
          <input
            placeholder="보습 과목 (예: 국어, 영어, 수학)"
            value={userSubjects}
            onChange={(e) => setUserSubjects(e.target.value)}
          />
        ) : (
          <select name="subject" value={form.subject} onChange={handleChange}>
            {(courseList[selectedLevel] || []).map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        )}
        {/* ✅ 시·도 */}
        <select name="eduOfficeCode" value={form.eduOfficeCode} onChange={handleChange}>
          {eduOffices.map((office) => (
            <option key={office.code} value={office.code}>{office.name}</option>
          ))}
        </select>
        {/* ✅ 행정구역 */}
        <select name="adminZone" value={form.adminZone} onChange={handleChange}>
          {(adminZones[form.eduOfficeCode] || []).map(zone => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? '추천 중...' : 'AI 추천 받기'}
        </button>
      </form>

      {gptResponse && (
        <div className="ai-response">
          <h3>✨ AI 추천 결과</h3>
          <textarea
            readOnly
            rows={10}
            value={gptResponse}
            style={{ width: '100%', whiteSpace: 'pre-line' }}
          />
        </div>
      )}
    </div>
  );
}

export default AiRecommend;
