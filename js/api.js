// Gemini API 호출

// API 키 관리
let geminiApiKey = null;

// API 호출 취소를 위한 AbortController
let currentAbortController = null;

// API 키 설정
function setApiKey(key) {
    geminiApiKey = key;
    // localStorage에 영구 저장
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        sessionStorage.setItem('gemini_api_key', key);
    } else {
        localStorage.removeItem('gemini_api_key');
        sessionStorage.removeItem('gemini_api_key');
    }
}

// API 키 가져오기
function getApiKey() {
    if (!geminiApiKey) {
        // 먼저 sessionStorage에서 확인, 없으면 localStorage에서 확인
        geminiApiKey = sessionStorage.getItem('gemini_api_key') || localStorage.getItem('gemini_api_key');
    }
    return geminiApiKey;
}

// API 키 요청
function requestApiKey() {
    const key = promptInput('Gemini API 키를 입력하세요:', getApiKey() || '');
    if (key) {
        setApiKey(key);
        return true;
    }
    return false;
}

// 프롬프트 캐시
let promptTemplate = null;

// 프롬프트 파일 로드
async function loadPromptTemplate() {
    // 1순위: 사용자 정의 프롬프트
    if (appState.settings.customPrompt && appState.settings.customPrompt.trim()) {
        return appState.settings.customPrompt.trim();
    }
    
    // 2순위: 캐시된 기본 프롬프트
    if (promptTemplate) {
        return promptTemplate;
    }
    
    // 3순위: prompt.txt 파일에서 로드
    try {
        const response = await fetch('prompt.txt');
        if (!response.ok) {
            throw new Error(`프롬프트 파일 로드 실패: ${response.status}`);
        }
        promptTemplate = await response.text();
        
        // 주석 제거 (/** ... */ 형식의 주석)
        promptTemplate = promptTemplate.replace(/\/\*\*[\s\S]*?\*\//g, '').trim();
        
        return promptTemplate;
    } catch (error) {
        console.error('프롬프트 파일 로드 중 오류:', error);
        // 4순위: 기본 프롬프트 사용
        return getDefaultPromptTemplate();
    }
}

// 기본 프롬프트 템플릿 (파일 로드 실패 시 사용)
function getDefaultPromptTemplate() {
    return `당신은 아동 발달에 대한 깊은 이해를 가진 숙련된 초등학교 교사입니다.
아래는 '{{STUDENT_NAME}}' 학생의 교실 활동에 대한 관찰 기록입니다.

[관찰 기록]
{{OBSERVATIONS}}

[요구사항]
1. 위 관찰 기록을 면밀히 분석하여 아래에 명시된 **[보고서 구조]**를 **반드시** 준수하여 요약 보고서를 작성해 주십시오.
2. 보고서의 모든 문장은 '~임.', '~함.', '~로 보임.'과 같은 개조식으로 간결하게 끝맺어야 합니다.
3. 존댓말('~입니다', '~합니다')은 절대 사용하지 마십시오.
4. 보고서는 마크다운(Markdown) 형식을 사용해야 합니다.
5. **분석적 접근**: 관찰 기록을 단순히 재서술하는 것이 아니라, 여러 기록에 나타난 행동들을 종합하여 학생의 특성과 경향성을 해석해야 합니다.

[보고서 구조]
# '{{STUDENT_NAME}}' 학생 관찰기록

## I. 일반 요약
- 학생의 전반적인 모습에 대해 2~3문장으로 핵심을 요약.

## II. 세부 분석
### 1. 행동 패턴
- 관찰된 학생의 일관된 행동 방식이나 습관.
### 2. 사회적 상호작용
- 친구 및 교사와의 관계, 의사소통 방식.
### 3. 학습 태도
- 수업 참여도, 과제 수행, 학습에 대한 흥미나 어려움.
### 4. 강점
- 학생이 두드러지게 보이는 긍정적인 특성이나 능력.
### 5. 잠재적 관심 영역
- 추가적인 관찰이나 지도가 필요할 수 있는 부분.

## III. 교과학습 발달상황
- **중요**: 관찰 기록에 '(국어)', '(수학)' 등과 같이 괄호 안에 과목명이 명시된 경우에만 이 섹션을 작성합니다.
- 하위 제목으로 과목명을 사용합니다. (예: ### 국어)
- 관찰된 과목마다 누가기록이 포함되도록 자연스럽게 연결합니다.
- 중요한 내용을 중심으로 최대 2문단으로 요약하여 작성합니다.
- 해당하는 기록이 없으면 이 섹션은 보고서에 포함하지 않습니다.

## IV. 종합의견
- 'I, II, III'의 모든 분석 내용을 종합하여, 학생의 성장 가능성과 긍정적인 측면을 강조하는 종합적인 의견을 상세히 작성합니다.

[요약 보고서 (위 구조를 엄격히 준수할 것)]`;
}

// API 호출 취소 함수
function cancelCurrentApiCall() {
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
}

// Gemini API 호출
async function generateSummary(studentName, observations) {
    if (observations.length === 0) {
        return "요약할 관찰 기록이 없습니다.";
    }
    
    // API 키 확인
    if (!getApiKey()) {
        if (!requestApiKey()) {
            return "API 키가 필요합니다. 설정에서 API 키를 입력해주세요.";
        }
    }
    
    // 관찰 기록 포맷팅
    const formattedObservations = observations
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(obs => `- ${formatDate(obs.timestamp)}: ${obs.text}`)
        .join('\n');

    // 프롬프트 템플릿 로드 및 변수 치환
    const template = await loadPromptTemplate();
    const prompt = template
        .replace(/\{\{STUDENT_NAME\}\}/g, studentName)
        .replace(/\{\{OBSERVATIONS\}\}/g, formattedObservations);

    // 새로운 AbortController 생성
    currentAbortController = new AbortController();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${getApiKey()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }),
            signal: currentAbortController.signal
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 호출 실패: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API 호출 중 오류 발생:", error);
        
        // 사용자가 취소한 경우
        if (error.name === 'AbortError') {
            throw new Error('CANCELLED');
        }
        
        if (error.message.includes('API_KEY_INVALID')) {
            return "API 키가 유효하지 않습니다. 올바른 API 키를 입력해주세요.";
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
            return "API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes('PERMISSION_DENIED')) {
            return "API 접근 권한이 없습니다. API 키 권한을 확인해주세요.";
        } else if (error.message.includes('UNAVAILABLE')) {
            return "API 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
        } else {
            return `AI 요약 생성에 실패했습니다: ${error.message}`;
        }
    } finally {
        currentAbortController = null;
    }
}

// API 연결 테스트
async function testApiConnection() {
    if (!getApiKey()) {
        return { success: false, message: "API 키가 설정되지 않았습니다." };
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${getApiKey()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "안녕하세요. 연결 테스트입니다."
                    }]
                }]
            })
        });

        if (response.ok) {
            return { success: true, message: "API 연결이 성공했습니다." };
        } else {
            const errorData = await response.json();
            return { success: false, message: `API 연결 실패: ${errorData.error?.message || 'Unknown error'}` };
        }
    } catch (error) {
        return { success: false, message: `API 연결 테스트 실패: ${error.message}` };
    }
}

// API 사용량 확인 (간단한 구현)
async function checkApiUsage() {
    // 실제 구현에서는 Gemini API의 사용량 확인 엔드포인트를 사용해야 합니다.
    // 현재는 기본적인 정보만 반환합니다.
    return {
        hasApiKey: !!getApiKey(),
        lastUsed: sessionStorage.getItem('last_api_call') || '사용 기록 없음'
    };
}

// API 호출 기록 저장
function recordApiCall() {
    sessionStorage.setItem('last_api_call', new Date().toLocaleString('ko-KR'));
}

// API 키 유효성 검사
function validateApiKey(key) {
    // Gemini API 키는 보통 39자리 문자열입니다.
    return key && key.length >= 30 && key.startsWith('AI');
}

// 환경변수에서 API 키 로드 (개발용)
function loadApiKeyFromEnv() {
    // 브라우저에서는 환경변수를 직접 읽을 수 없으므로,
    // 서버에서 전달받거나 다른 방법을 사용해야 합니다.
    // 현재는 주석 처리
    /*
    if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
        setApiKey(process.env.GEMINI_API_KEY);
        return true;
    }
    */
    return false;
}

// API 설정 초기화
function initializeApiSettings() {
    // localStorage에서 API 키 복원 (영구 저장된 키 우선)
    const savedKey = localStorage.getItem('gemini_api_key') || sessionStorage.getItem('gemini_api_key');
    if (savedKey) {
        setApiKey(savedKey);
    }
    
    // 환경변수에서 로드 시도
    loadApiKeyFromEnv();
}
