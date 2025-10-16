// 유틸리티 함수들

// 마크다운 파서
function parseMarkdown(text) {
    return text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// 날짜 포맷팅 (클라이언트 로컬 시각 기준)
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('ko-KR', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
}

function formatDateShort(dateString) {
    return new Date(dateString).toLocaleString('ko-KR', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
}

// UUID 생성
function generateId() {
    return crypto.randomUUID();
}

// 학생 이름 정렬
function sortStudentsByName(students) {
    return students.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
}

// 관찰 기록 정렬 (최신순)
function sortObservationsByDate(observations) {
    return observations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// 확인 대화상자
function confirmAction(message) {
    return confirm(message);
}

// 프롬프트 입력
function promptInput(message, defaultValue = '') {
    return prompt(message, defaultValue);
}

// 로딩 스피너 표시/숨김
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-slate-500">
                <div class="loading-spinner"></div>
                <p class="mt-4">처리 중...</p>
            </div>
        `;
    }
}

// 에러 메시지 표시
function showError(message) {
    alert(`오류: ${message}`);
}

// 성공 메시지 표시
function showSuccess(message) {
    showToast(message, 'success');
}

// 토스트 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg z-50 transform transition-all duration-300`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 애니메이션 효과
    setTimeout(() => {
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 현재 날짜를 YYYY-MM-DD 형식으로 반환 (클라이언트 로컬 시각 기준)
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 현재 날짜와 시간을 YYYY-MM-DD-HHMM 형식으로 반환 (클라이언트 로컬 시각 기준, 24시간제)
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}-${hours}${minutes}`;
}

// 텍스트가 비어있는지 확인
function isEmpty(text) {
    return !text || text.trim() === '';
}

// 배열에서 중복 제거
function removeDuplicates(array) {
    return [...new Set(array)];
}

// 객체 깊은 복사
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 로컬 스토리지 키 생성 (클라이언트 로컬 시각 기준)
function createStorageKey(prefix, suffix = '') {
    const timestamp = getCurrentDate();
    return `${prefix}-${timestamp}${suffix ? '-' + suffix : ''}`;
}

// 파일 다운로드
function downloadFile(content, filename, contentType = 'application/json') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 파일 읽기
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
