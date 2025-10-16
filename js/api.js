// Gemini API 호출

// API 키 관리
let geminiApiKey = null;

// API 호출 취소를 위한 AbortController
let currentAbortController = null;

// API 키 설정
function setApiKey(key) {
    geminiApiKey = key;
    // localStorage에만 영구 저장
    if (key) {
        localStorage.setItem('gemini_api_key', key);
    } else {
        localStorage.removeItem('gemini_api_key');
        sessionStorage.removeItem('gemini_api_key'); // 혹시 있을 수 있는 세션 데이터도 정리
    }
}

// API 키 가져오기
function getApiKey() {
    if (!geminiApiKey) {
        // localStorage에서만 가져오기
        geminiApiKey = localStorage.getItem('gemini_api_key');
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

/**
 * 프롬프트 템플릿 로드
 * 
 * 프롬프트 로드 우선순위:
 * 1. 사용자 정의 프롬프트 (설정에서 직접 입력한 경우)
 * 2. 기본 프롬프트 (prompt.js에서 로드)
 * 
 * @returns {string} 프롬프트 템플릿 문자열
 */
function loadPromptTemplate() {
    // 1순위: 사용자 정의 프롬프트
    if (appState.settings.customPrompt && appState.settings.customPrompt.trim()) {
        return appState.settings.customPrompt.trim();
    }
    
    // 2순위: prompt.js의 기본 프롬프트
    return getDefaultPromptTemplate();
}

/**
 * 기본 프롬프트 템플릿 가져오기
 * prompt.js에서 정의된 기본 프롬프트를 반환합니다.
 * 
 * @returns {string} 기본 프롬프트 템플릿 문자열
 */
function getDefaultPromptTemplate() {
    // prompt.js에서 정의된 함수 호출
    if (typeof getDefaultPrompt === 'function') {
        return getDefaultPrompt();
    }
    
    // fallback: prompt.js가 로드되지 않은 경우
    console.error('prompt.js가 로드되지 않았습니다!');
    return `'{{STUDENT_NAME}}' 학생의 관찰 기록을 분석하여 요약해주세요.

[관찰 기록]
{{OBSERVATIONS}}

위 관찰 기록을 바탕으로 학생의 특성과 발달 상황을 요약해주세요.`;
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
        // API 키 안내 모달 표시
        if (typeof openApiKeyGuide === 'function') {
            openApiKeyGuide();
        }
        throw new Error('API 키가 필요합니다. API Key를 먼저 등록해주세요.');
    }
    
    // 관찰 기록 포맷팅
    const formattedObservations = observations
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(obs => `- ${formatDate(obs.timestamp)}: ${obs.text}`)
        .join('\n');

    // 프롬프트 템플릿 로드 및 변수 치환
    const template = loadPromptTemplate();
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

// API 호출 기록 저장 (클라이언트 로컬 시각 기준)
function recordApiCall() {
    const timestamp = new Date().toLocaleString('ko-KR', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    sessionStorage.setItem('last_api_call', timestamp);
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
    // localStorage에서만 API 키 복원
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        geminiApiKey = savedKey;
    }
    
    // 환경변수에서 로드 시도
    loadApiKeyFromEnv();
}
