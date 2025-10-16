// 데이터 관리 및 로컬 스토리지

// 전역 상태
let appState = {
    students: [],
    studentData: {},
    settings: {
        appTitle: 'AI ClassNote',
        classInfo: '',
        teacherName: '',
        customPrompt: '' // 사용자 정의 프롬프트
    },
    selectedStudentIds: [],
    viewMode: 'active',
    isLoadingSummary: false,
    // 임시 입력 상태 (렌더링 시 복원용)
    tempObservation: {
        text: '',
        date: ''
    }
};

// 로컬 스토리지 관리
const STORAGE_KEY = 'ai-classroom-observer-data-v3';

// 데이터 로드
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appState = { ...appState, ...data };
            console.log('데이터 로드 완료:', data);
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            showError('저장된 데이터를 불러오는데 실패했습니다.');
        }
    }
}

// 데이터 저장
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        console.log('데이터 저장 완료');
    } catch (e) {
        console.error('데이터 저장 실패:', e);
        showError('데이터 저장에 실패했습니다.');
    }
}

// 학생 관리
function addStudent(name) {
    if (isEmpty(name)) {
        showError('학생 이름을 입력해주세요.');
        return null;
    }
    
    const newStudent = {
        id: generateId(),
        name: name.trim(),
        isDeleted: false
    };
    
    appState.students.push(newStudent);
    appState.studentData[newStudent.id] = {
        observations: [],
        summary: '',
        summaryTimestamp: null
    };
    
    // 첫 번째 학생이면 자동 선택
    if (appState.students.filter(s => !s.isDeleted).length === 1) {
        appState.selectedStudentIds = [newStudent.id];
    }
    appState.viewMode = 'active';
    
    saveData();
    showSuccess(`${newStudent.name} 학생이 추가되었습니다.`);
    return newStudent;
}

function performSoftDeleteStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student) {
        student.isDeleted = true;
        appState.selectedStudentIds = appState.selectedStudentIds.filter(sid => sid !== id);
        
        // 활성 학생 목록에서 다른 학생이 있다면 첫 번째 학생을 자동 선택
        const activeStudents = getActiveStudents();
        if (activeStudents.length > 0 && appState.selectedStudentIds.length === 0) {
            appState.selectedStudentIds = [activeStudents[0].id];
        }
        
        saveData();
        showSuccess(`${student.name} 학생이 삭제 목록으로 이동되었습니다.`);
        return true;
    }
    return false;
}

function performRestoreStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student) {
        student.isDeleted = false;
        appState.selectedStudentIds = [id];
        appState.viewMode = 'active';
        saveData();
        showSuccess(`${student.name} 학생이 복원되었습니다.`);
        return true;
    }
    return false;
}

function performPermanentDeleteStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student) {
        appState.students = appState.students.filter(s => s.id !== id);
        delete appState.studentData[id];
        appState.selectedStudentIds = appState.selectedStudentIds.filter(sid => sid !== id);
        
        // 삭제된 학생 목록에서 다른 학생이 있다면 첫 번째 학생을 자동 선택
        const deletedStudents = getDeletedStudents();
        if (deletedStudents.length > 0 && appState.selectedStudentIds.length === 0) {
            appState.selectedStudentIds = [deletedStudents[0].id];
        }
        
        saveData();
        showSuccess(`${student.name} 학생이 영구 삭제되었습니다.`);
        return true;
    }
    return false;
}

// 학생 이름 수정
function updateStudentName(id, newName) {
    if (isEmpty(newName)) {
        showError('학생 이름을 입력해주세요.');
        return false;
    }
    
    const student = appState.students.find(s => s.id === id);
    if (student) {
        const oldName = student.name;
        student.name = newName.trim();
        saveData();
        showSuccess(`${oldName} 학생의 이름이 ${student.name}으로 변경되었습니다.`);
        return true;
    }
    return false;
}

// 관찰 기록 관리
function addObservationToData(text, date, studentIds) {
    if (isEmpty(text) || studentIds.length === 0) {
        showError('관찰 내용과 대상 학생을 확인해주세요.');
        return null;
    }

    const now = new Date();
    const [year, month, day] = date.split('-').map(Number);
    const observationTimestamp = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
    
    const newObservation = {
        id: generateId(),
        text: text.trim(),
        timestamp: observationTimestamp.toISOString(),
    };

    studentIds.forEach(studentId => {
        if (!appState.studentData[studentId]) {
            appState.studentData[studentId] = { observations: [], summary: '', summaryTimestamp: null };
        }
        appState.studentData[studentId].observations.unshift(newObservation);
    });

    saveData();
    showSuccess('관찰 기록이 추가되었습니다.');
    return newObservation;
}

// 요약 관리
function updateSummary(studentId, summary, timestamp) {
    if (!appState.studentData[studentId]) {
        appState.studentData[studentId] = { observations: [], summary: '', summaryTimestamp: null };
    }
    
    appState.studentData[studentId].summary = summary;
    appState.studentData[studentId].summaryTimestamp = timestamp;
    saveData();
}

// 설정 관리
function updateSettings(newSettings) {
    appState.settings = { ...appState.settings, ...newSettings };
    saveData();
    showSuccess('설정이 저장되었습니다.');
}

// 데이터 내보내기
function exportData() {
    try {
        // 백업 데이터 생성 (사용자 프롬프트 포함)
        const exportDataObj = {
            ...appState,
            exportDate: new Date().toISOString(),
            version: '3.0.0',
            appInfo: {
                name: 'AI ClassNote',
                version: '3.0.0',
                description: '교실에서 학생들의 교과평가와 학교생활을 관찰기록하고, AI를 활용해 분석하는 도구'
            }
        };
        
        const dataStr = JSON.stringify(exportDataObj, null, 2);
        const filename = `ai-classnote-data-${getCurrentDateTime()}.json`;
        downloadFile(dataStr, filename, 'application/json');
        showSuccess('데이터가 내보내기되었습니다.');
    } catch (e) {
        console.error('데이터 내보내기 실패:', e);
        showError('데이터 내보내기에 실패했습니다: ' + e.message);
    }
}

// 전역 window 객체에 명시적으로 할당
window.exportData = exportData;

// 데이터 가져오기
function importData(jsonData) {
    try {
        const importedData = JSON.parse(jsonData);
        
        // 데이터 유효성 검사
        if (!importedData.students || !importedData.studentData || !importedData.settings) {
            showError('유효하지 않은 데이터 형식입니다. 올바른 백업 파일인지 확인해주세요.');
            return false;
        }
        
        // 버전 호환성 확인
        if (importedData.version && importedData.version !== '3.0.0') {
            if (!confirmAction(`이 데이터는 버전 ${importedData.version}에서 생성되었습니다. 현재 버전(3.0.0)과 호환되지 않을 수 있습니다. 계속하시겠습니까?`)) {
                return false;
            }
        }
        
        // 기존 데이터 백업
        const backup = createBackup();
        
        // 데이터 가져오기 (사용자 프롬프트 포함)
        appState = { 
            ...appState, 
            students: importedData.students || [],
            studentData: importedData.studentData || {},
            settings: { 
                ...appState.settings, 
                ...importedData.settings,
                customPrompt: importedData.settings?.customPrompt || ''
            },
            selectedStudentIds: [],
            viewMode: 'active',
            isLoadingSummary: false,
            tempObservation: {
                text: '',
                date: ''
            }
        };
        
        saveData();
        showSuccess('데이터가 성공적으로 가져와졌습니다.');
        return true;
    } catch (e) {
        console.error('데이터 가져오기 실패:', e);
        showError('데이터 가져오기에 실패했습니다: ' + e.message);
    }
    return false;
}

// 필터링 함수들
function getActiveStudents() {
    return sortStudentsByName(appState.students.filter(s => !s.isDeleted));
}

function getDeletedStudents() {
    return sortStudentsByName(appState.students.filter(s => s.isDeleted));
}

function getSelectedStudents() {
    return appState.selectedStudentIds.map(id => appState.students.find(s => s.id === id)).filter(s => s);
}

function getPrimaryStudent() {
    return appState.students.find(s => s.id === appState.selectedStudentIds[0]);
}

// 학생 선택 관리
function selectStudent(id) {
    appState.selectedStudentIds = [id];
}

function addTargetStudent(id) {
    if (!appState.selectedStudentIds.includes(id)) {
        appState.selectedStudentIds.push(id);
    }
}

function removeTargetStudent(id) {
    appState.selectedStudentIds = appState.selectedStudentIds.filter(studentId => studentId !== id);
}

function setViewMode(mode) {
    appState.viewMode = mode;
    
    // 새로운 뷰 모드에 맞는 학생 목록 가져오기
    const studentsInNewMode = mode === 'active' ? getActiveStudents() : getDeletedStudents();
    
    // 학생이 없는 경우
    if (studentsInNewMode.length === 0) {
        appState.selectedStudentIds = [];
        return;
    }
    
    // 현재 선택된 학생이 새 모드의 학생 목록에 있는지 확인
    const currentPrimaryStudent = getPrimaryStudent();
    const isPrimaryStudentInNewMode = currentPrimaryStudent && 
        studentsInNewMode.some(s => s.id === currentPrimaryStudent.id);
    
    if (isPrimaryStudentInNewMode) {
        // 이미 활성화된 학생이 새 모드에 있으면 그대로 유지
        // (단, 다중 선택된 다른 학생들은 제거)
        appState.selectedStudentIds = [currentPrimaryStudent.id];
    } else {
        // 활성화된 학생이 없거나 새 모드에 없으면 첫 번째 학생을 자동 선택
        appState.selectedStudentIds = [studentsInNewMode[0].id];
    }
}

// 로딩 상태 관리
function setLoadingSummary(loading) {
    appState.isLoadingSummary = loading;
}

// 임시 관찰 기록 저장 (렌더링 전 입력 내용 보존)
function saveTempObservation() {
    const textEl = document.getElementById('observationText');
    const dateEl = document.getElementById('observationDate');
    
    if (textEl && dateEl) {
        appState.tempObservation.text = textEl.value;
        appState.tempObservation.date = dateEl.value;
    }
}

// 임시 관찰 기록 복원 (렌더링 후 입력 내용 복원)
function restoreTempObservation() {
    const textEl = document.getElementById('observationText');
    const dateEl = document.getElementById('observationDate');
    
    if (textEl && appState.tempObservation.text) {
        textEl.value = appState.tempObservation.text;
    }
    
    if (dateEl && appState.tempObservation.date) {
        dateEl.value = appState.tempObservation.date;
    }
}

// 임시 관찰 기록 초기화
function clearTempObservation() {
    appState.tempObservation.text = '';
    appState.tempObservation.date = '';
}

// 통계 정보
function getStatistics() {
    const activeStudents = getActiveStudents();
    const deletedStudents = getDeletedStudents();
    const totalObservations = Object.values(appState.studentData).reduce((total, data) => total + data.observations.length, 0);
    const studentsWithSummary = Object.values(appState.studentData).filter(data => data.summary).length;
    
    return {
        activeStudents: activeStudents.length,
        deletedStudents: deletedStudents.length,
        totalObservations,
        studentsWithSummary,
        totalStudents: appState.students.length
    };
}

// 데이터 초기화
function resetData() {
    if (confirmAction('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        appState = {
            students: [],
            studentData: {},
            settings: {
                appTitle: 'AI ClassNote',
                classInfo: '',
                teacherName: '',
                customPrompt: ''
            },
            selectedStudentIds: [],
            viewMode: 'active',
            isLoadingSummary: false,
            tempObservation: {
                text: '',
                date: ''
            }
        };
        saveData();
        showSuccess('모든 데이터가 초기화되었습니다.');
    }
}

// 데이터 백업 생성
function createBackup() {
    const backup = {
        ...appState,
        backupDate: new Date().toISOString(),
        version: '3.0'
    };
    return backup;
}

// 백업에서 복원
function restoreFromBackup(backup) {
    if (backup && backup.students && backup.studentData && backup.settings) {
        appState = { ...appState, ...backup };
        saveData();
        showSuccess('백업에서 복원되었습니다.');
        return true;
    }
    return false;
}
