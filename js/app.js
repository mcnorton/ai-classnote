// 메인 애플리케이션 초기화

// 애플리케이션 초기화
function initializeApp() {
    console.log('AI ClassNote 초기화 중...');
    
    // 데이터 로드
    loadData();
    
    // API 설정 초기화
    initializeApiSettings();
    
    // 첫 번째 활성 학생 자동 선택
    const activeStudents = getActiveStudents();
    if (activeStudents.length > 0 && appState.selectedStudentIds.length === 0) {
        appState.selectedStudentIds = [activeStudents[0].id];
    }
    
    // 전역 이벤트 리스너 등록
    registerGlobalEventListeners();
    
    // 앱 렌더링
    renderApp();
    
    // 초기화 완료 메시지
    console.log('애플리케이션 초기화 완료');
    
    // 환영 메시지 표시 (첫 실행 시)
    if (appState.students.length === 0) {
        setTimeout(() => {
            showToast('환영합니다! 학생을 추가하여 관찰 기록을 시작하세요.', 'success');
        }, 1000);
    }
}

// 전역 함수들 등록 (이벤트 핸들러에서 사용)
window.selectStudent = selectStudent;
window.addTargetStudent = addTargetStudent;
window.removeTargetStudent = removeTargetStudent;
window.setViewMode = setViewMode;
window.showAddStudentForm = showAddStudentForm;
window.softDeleteStudent = softDeleteStudent;
window.restoreStudent = restoreStudent;
window.permanentDeleteStudent = permanentDeleteStudent;
window.handleAddObservation = handleAddObservation;
window.addObservationToData = addObservationToData;
window.startEditObservation = startEditObservation;
window.saveEditObservation = saveEditObservation;
window.deleteObservationEvent = deleteObservationEvent;
window.generateSummaryEvent = generateSummaryEvent;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.exportData = exportData;
window.showImportDialog = showImportDialog;
window.handleFileImport = handleFileImport;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.testApiConnectionEvent = testApiConnectionEvent;
window.startEditStudentName = startEditStudentName;
window.saveStudentNameEdit = saveStudentNameEdit;
window.handleStudentNameKeydown = handleStudentNameKeydown;

// 유틸리티 함수들도 전역으로 등록
window.confirmAction = confirmAction;
window.promptInput = promptInput;
window.showError = showError;
window.showSuccess = showSuccess;
window.showToast = showToast;

// 데이터 관리 함수들 전역 등록
window.addStudent = addStudent;
window.performSoftDeleteStudent = performSoftDeleteStudent;
window.performRestoreStudent = performRestoreStudent;
window.performPermanentDeleteStudent = performPermanentDeleteStudent;
window.updateStudentName = updateStudentName;
window.addObservationToData = addObservationToData;
window.updateObservation = updateObservation;
window.deleteObservation = deleteObservation;
window.updateSummary = updateSummary;
window.updateSettings = updateSettings;
window.exportData = exportData;
window.importData = importData;
window.getActiveStudents = getActiveStudents;
window.getDeletedStudents = getDeletedStudents;
window.getSelectedStudents = getSelectedStudents;
window.getPrimaryStudent = getPrimaryStudent;
window.setLoadingSummary = setLoadingSummary;
window.saveTempObservation = saveTempObservation;
window.restoreTempObservation = restoreTempObservation;
window.clearTempObservation = clearTempObservation;

// API 함수들 전역 등록
window.setApiKey = setApiKey;
window.getApiKey = getApiKey;
window.requestApiKey = requestApiKey;
window.generateSummary = generateSummary;
window.testApiConnection = testApiConnection;
window.initializeApiSettings = initializeApiSettings;
window.loadPromptTemplate = loadPromptTemplate;
window.getDefaultPromptTemplate = getDefaultPromptTemplate;
window.cancelCurrentApiCall = cancelCurrentApiCall;

// UI 함수들 전역 등록
window.renderApp = renderApp;
window.renderHeader = renderHeader;
window.renderSidebar = renderSidebar;
window.renderMain = renderMain;
window.renderWelcomeMessage = renderWelcomeMessage;
window.renderStudentItem = renderStudentItem;
window.renderObservationForm = renderObservationForm;
window.renderObservationPanel = renderObservationPanel;
window.renderSummaryPanel = renderSummaryPanel;
window.renderSettingsModal = renderSettingsModal;
window.renderModals = renderModals;
window.attachEventListeners = attachEventListeners;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.showImportDialog = showImportDialog;
window.handleFileImport = handleFileImport;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;

// 유틸리티 함수들 전역 등록
window.parseMarkdown = parseMarkdown;
window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.generateId = generateId;
window.sortStudentsByName = sortStudentsByName;
window.sortObservationsByDate = sortObservationsByDate;
window.getCurrentDate = getCurrentDate;
window.isEmpty = isEmpty;
window.removeDuplicates = removeDuplicates;
window.deepClone = deepClone;
window.downloadFile = downloadFile;
window.readFile = readFile;
window.debounce = debounce;
window.throttle = throttle;

// 이벤트 핸들러 함수들 전역 등록
window.handleKeyboardShortcuts = handleKeyboardShortcuts;
window.handleDragOver = handleDragOver;
window.handleDrop = handleDrop;
window.handleResize = handleResize;
window.handleBeforeUnload = handleBeforeUnload;
window.registerGlobalEventListeners = registerGlobalEventListeners;
window.unregisterGlobalEventListeners = unregisterGlobalEventListeners;
window.validateForm = validateForm;
window.setupFormValidation = setupFormValidation;
window.showConfirmDialog = showConfirmDialog;

// 개발자 도구용 함수들
window.getAppState = () => appState;
window.getStatistics = getStatistics;
window.resetData = resetData;
window.createBackup = createBackup;
window.restoreFromBackup = restoreFromBackup;

// 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
    showError('예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 거부:', event.reason);
    showError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
});

// 서비스 워커 등록 (PWA 지원을 위해)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 서비스 워커 파일이 있다면 등록
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW 등록 성공:', registration))
        //     .catch(registrationError => console.log('SW 등록 실패:', registrationError));
    });
}

// 오프라인 감지
window.addEventListener('online', () => {
    showToast('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', () => {
    showToast('인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.', 'warning');
});

// 페이지 가시성 변경 감지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 페이지가 숨겨질 때 데이터 저장
        saveData();
    } else {
        // 페이지가 다시 보일 때 데이터 새로고침
        loadData();
    }
});

// DOM이 완전히 로드된 후 초기화 실행
document.addEventListener('DOMContentLoaded', () => {
    // 약간의 지연을 두고 초기화 (모든 스크립트가 로드되도록)
    setTimeout(initializeApp, 100);
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 데이터 저장
    saveData();
    
    // 이벤트 리스너 정리
    unregisterGlobalEventListeners();
});

// 개발 모드 확인
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.protocol === 'file:';

if (isDevelopment) {
    console.log('개발 모드에서 실행 중');
    // 개발 모드에서만 사용할 수 있는 기능들
    window.devMode = {
        clearAllData: () => {
            if (confirm('모든 데이터를 삭제하시겠습니까?')) {
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
            }
        },
        exportDebugInfo: () => {
            const debugInfo = {
                appState,
                localStorage: { ...localStorage },
                sessionStorage: { ...sessionStorage },
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            downloadFile(JSON.stringify(debugInfo, null, 2), 'debug-info.json');
        },
        testApiKey: async (key) => {
            const originalKey = getApiKey();
            setApiKey(key);
            const result = await testApiConnection();
            setApiKey(originalKey);
            return result;
        }
    };
}

// 애플리케이션 정보
const APP_INFO = {
    name: 'AI ClassNote',
    version: '3.3.0',
    description: '교실에서 학생들의 교과평가와 학교생활을 관찰기록하고, AI를 활용해 분석하는 도구',
    author: 'AI Assistant',
    buildDate: new Date().toISOString()
};

// 앱 정보를 전역으로 노출
window.APP_INFO = APP_INFO;

console.log(`${APP_INFO.name} v${APP_INFO.version} 로드 완료`);
