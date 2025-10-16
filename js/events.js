// 이벤트 핸들러들

// 학생 관리 이벤트
function selectStudent(id) {
    // 분석 생성 중이면 확인
    if (appState.isLoadingSummary) {
        if (confirmAction('AI 분석이 진행 중입니다.\n다른 학생을 선택하면 분석이 중단됩니다.\n계속하시겠습니까?')) {
            // API 호출 취소
            cancelCurrentApiCall();
            setLoadingSummary(false);
        } else {
            // 이동 취소
            return;
        }
    }
    
    appState.selectedStudentIds = [id];
    renderApp();
}

function addTargetStudent(id) {
    // 분석 생성 중이면 확인
    if (appState.isLoadingSummary) {
        if (confirmAction('AI 분석이 진행 중입니다.\n학생을 추가하면 분석이 중단됩니다.\n계속하시겠습니까?')) {
            // API 호출 취소
            cancelCurrentApiCall();
            setLoadingSummary(false);
        } else {
            // 이동 취소
            return;
        }
    }
    
    if (!appState.selectedStudentIds.includes(id)) {
        // 입력 중인 내용 저장
        saveTempObservation();
        appState.selectedStudentIds.push(id);
    }
    renderApp();
    // 입력 내용 복원
    restoreTempObservation();
    
    // 학생 모달이 열려있으면 업데이트
    updateStudentModalIfOpen();
}

function removeTargetStudent(id) {
    // 분석 생성 중이면 확인
    if (appState.isLoadingSummary) {
        if (confirmAction('AI 분석이 진행 중입니다.\n학생을 제거하면 분석이 중단됩니다.\n계속하시겠습니까?')) {
            // API 호출 취소
            cancelCurrentApiCall();
            setLoadingSummary(false);
        } else {
            // 이동 취소
            return;
        }
    }
    
    // 입력 중인 내용 저장
    saveTempObservation();
    appState.selectedStudentIds = appState.selectedStudentIds.filter(studentId => studentId !== id);
    renderApp();
    // 입력 내용 복원
    restoreTempObservation();
    
    // 학생 모달이 열려있으면 업데이트
    updateStudentModalIfOpen();
}

function setViewMode(mode) {
    // 분석 생성 중이면 확인
    if (appState.isLoadingSummary) {
        if (confirmAction('AI 분석이 진행 중입니다.\n뷰 모드를 변경하면 분석이 중단됩니다.\n계속하시겠습니까?')) {
            // API 호출 취소
            cancelCurrentApiCall();
            setLoadingSummary(false);
        } else {
            // 이동 취소
            return;
        }
    }
    
    appState.viewMode = mode;
    
    // 새로운 뷰 모드에 맞는 학생 목록 가져오기
    const studentsInNewMode = mode === 'active' ? getActiveStudents() : getDeletedStudents();
    
    // 학생이 없는 경우
    if (studentsInNewMode.length === 0) {
        appState.selectedStudentIds = [];
        renderApp();
        // 학생 모달이 열려있으면 업데이트
        updateStudentModalIfOpen();
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
    
    renderApp();
    // 학생 모달이 열려있으면 업데이트
    updateStudentModalIfOpen();
}

// 학생 모달이 열려있으면 업데이트하는 헬퍼 함수
function updateStudentModalIfOpen() {
    const modal = document.getElementById('studentModal');
    if (modal && modal.style.display === 'flex') {
        // 모달을 다시 열어서 업데이트
        if (typeof openStudentModal === 'function') {
            openStudentModal();
        }
    }
}

function showAddStudentForm() {
    const name = promptInput('학생 이름을 입력하세요:');
    if (name) {
        addStudent(name);
        renderApp();
        // 학생 모달이 열려있으면 업데이트
        updateStudentModalIfOpen();
    }
}

function softDeleteStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student && confirmAction(`정말로 ${student.name} 학생을 삭제 목록으로 옮기시겠습니까?`)) {
        performSoftDeleteStudent(id);
        renderApp();
        // 학생 모달이 열려있으면 업데이트
        updateStudentModalIfOpen();
    }
}

function restoreStudent(id) {
    performRestoreStudent(id);
    renderApp();
    // 학생 모달이 열려있으면 업데이트
    updateStudentModalIfOpen();
}

function permanentDeleteStudent(id) {
    const student = appState.students.find(s => s.id === id);
    if (student && confirmAction(`정말로 ${student.name} 학생을 영구적으로 삭제하시겠습니까?\n모든 관찰 기록이 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.`)) {
        performPermanentDeleteStudent(id);
        renderApp();
        // 학생 모달이 열려있으면 업데이트
        updateStudentModalIfOpen();
    }
}

// 관찰 기록 이벤트
function handleAddObservation() {
    try {
        const textEl = document.getElementById('observationText');
        const dateEl = document.getElementById('observationDate');
        
        if (!textEl || !dateEl) {
            showError('관찰 기록 폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        const text = textEl.value.trim();
        const date = dateEl.value;
        
        if (isEmpty(text)) {
            showError('관찰 내용을 입력해주세요.');
            textEl.focus();
            return;
        }
        
        if (appState.selectedStudentIds.length === 0) {
            showError('관찰 대상 학생을 선택해주세요.');
            return;
        }

        // data.js의 addObservationToData 함수 호출
        addObservationToData(text, date, appState.selectedStudentIds);
        textEl.value = '';
        
        // 임시 입력 내용 초기화 (저장 완료됨)
        clearTempObservation();
        
        renderApp();
    } catch (error) {
        console.error('관찰 기록 추가 중 오류:', error);
        showError('관찰 기록 추가 중 오류가 발생했습니다.');
    }
}

// AI 요약 이벤트
async function generateSummaryEvent() {
    try {
        const primaryStudent = getPrimaryStudent();
        if (!primaryStudent) {
            showError('학생을 선택해주세요.');
            return;
        }
        
        const studentObservations = appState.studentData[primaryStudent.id]?.observations || [];
        if (studentObservations.length === 0) {
            showError('관찰 기록이 없습니다. 먼저 관찰 기록을 추가해주세요.');
            return;
        }
        
        setLoadingSummary(true);
        renderApp();
        
        const result = await generateSummary(primaryStudent.name, studentObservations);
        const generationTimestamp = new Date().toISOString();
        updateSummary(primaryStudent.id, result, generationTimestamp);
        recordApiCall();
        showSuccess('AI 요약이 생성되었습니다.');
    } catch (error) {
        console.error('요약 생성 중 오류:', error);
        
        // 사용자가 취소한 경우
        if (error.message === 'CANCELLED') {
            showToast('AI 분석이 취소되었습니다.', 'info');
        } else {
            showError('요약 생성 중 오류가 발생했습니다: ' + error.message);
        }
    } finally {
        setLoadingSummary(false);
        renderApp();
    }
}

// 설정 이벤트 - ui.js의 함수들을 직접 호출
// 중복 정의를 피하기 위해 이벤트 핸들러만 유지

// exportData, showImportDialog, handleFileImport, toggleApiKeyVisibility 함수들은
// data.js와 ui.js에 정의되어 있으므로 events.js에서 별도로 래핑할 필요가 없습니다.
// 이 함수들은 HTML onclick 속성에서 직접 호출됩니다.

// 학생 이름 수정 기능
function startEditStudentName(studentId) {
    const inputElement = document.getElementById(`student-name-${studentId}`);
    if (!inputElement || !inputElement.readOnly) return;
    
    // readonly 속성 해제하여 편집 가능하게 만들기
    inputElement.readOnly = false;
    inputElement.focus();
    inputElement.select();
}

// 학생 이름 수정 저장
function saveStudentNameEdit(studentId) {
    const inputElement = document.getElementById(`student-name-${studentId}`);
    if (!inputElement || inputElement.readOnly) return;
    
    const newName = inputElement.value.trim();
    const originalName = inputElement.getAttribute('data-original-name');
    
    // 이름이 비어있으면 원래 이름으로 복원
    if (!newName) {
        inputElement.value = originalName;
        inputElement.readOnly = true;
        showError('학생 이름은 비어있을 수 없습니다.');
        return;
    }
    
    // 이름이 변경되었는지 확인
    if (newName !== originalName) {
        // 사용자에게 확인
        if (confirmAction(`${originalName}의 이름을 ${newName}(으)로 변경하시겠습니까?`)) {
            updateStudentName(studentId, newName);
            renderApp();
        } else {
            // 취소하면 원래 이름으로 복원
            inputElement.value = originalName;
            inputElement.readOnly = true;
        }
    } else {
        // 변경사항이 없으면 readonly로 복원
        inputElement.readOnly = true;
    }
}

// 학생 이름 입력 필드 키보드 이벤트
function handleStudentNameKeydown(event, studentId) {
    const inputElement = document.getElementById(`student-name-${studentId}`);
    if (!inputElement || inputElement.readOnly) return;
    
    if (event.key === 'Enter') {
        event.preventDefault();
        inputElement.blur(); // blur 이벤트가 저장을 처리
    } else if (event.key === 'Escape') {
        event.preventDefault();
        // 원래 이름으로 복원하고 readonly로 변경
        const originalName = inputElement.getAttribute('data-original-name');
        inputElement.value = originalName;
        inputElement.readOnly = true;
    }
}

// API 연결 테스트 이벤트 핸들러
async function testApiConnectionEvent() {
    try {
        // api.js의 testApiConnection 함수 호출
        const result = await window.testApiConnection();
        if (result.success) {
            showSuccess(result.message);
        } else {
            showError(result.message);
        }
    } catch (error) {
        console.error('API 연결 테스트 중 오류:', error);
        showError('API 연결 테스트 중 오류가 발생했습니다: ' + error.message);
    }
}

// 키보드 단축키
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S: 설정 열기
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // ui.js의 openSettings 함수 직접 호출
        if (typeof openSettings === 'function') {
            openSettings();
        }
    }
    
    // Ctrl/Cmd + N: 새 학생 추가
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showAddStudentForm();
    }
    
    // Ctrl/Cmd + E: 데이터 내보내기
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
    
    // Ctrl/Cmd + G: AI 요약 생성
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        generateSummaryEvent();
    }
    
    // F2: 학생 이름 수정 (선택된 학생이 있을 때)
    if (e.key === 'F2') {
        e.preventDefault();
        const primaryStudent = getPrimaryStudent();
        if (primaryStudent) {
            startEditStudentName(primaryStudent.id);
        }
    }
    
    // Escape: 모달 닫기
    if (e.key === 'Escape') {
        // 프롬프트 편집기가 열려있으면 먼저 닫기
        const promptEditorModal = document.getElementById('promptEditorModal');
        if (promptEditorModal && promptEditorModal.style.display === 'flex') {
            if (typeof closePromptEditor === 'function') {
                closePromptEditor();
            }
            return;
        }
        
        // 학생 모달이 열려있으면 닫기
        const studentModal = document.getElementById('studentModal');
        if (studentModal && studentModal.style.display === 'flex') {
            if (typeof closeStudentModal === 'function') {
                closeStudentModal();
            }
            return;
        }
        
        // 설정 모달 닫기
        if (typeof closeSettings === 'function') {
            closeSettings();
        }
    }
}

// 드래그 앤 드롭 이벤트
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/json') {
            readFile(file).then(content => {
                if (importData(content)) {
                    renderApp();
                }
            }).catch(error => {
                showError('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
            });
        } else {
            showError('JSON 파일만 가져올 수 있습니다.');
        }
    }
}

// 창 크기 변경 이벤트
function handleResize() {
    // 반응형 레이아웃 조정
    const app = document.getElementById('app');
    if (app) {
        // 필요시 레이아웃 재조정 로직 추가
    }
}

// 페이지 언로드 이벤트
function handleBeforeUnload(e) {
    // 데이터 자동 저장은 이미 saveData()에서 처리됨
    // 필요시 추가 확인 로직 구현
}

// 전역 이벤트 리스너 등록
function registerGlobalEventListeners() {
    // 키보드 이벤트
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 창 크기 변경
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // 페이지 언로드
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 드래그 앤 드롭 (전체 페이지)
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
}

// 이벤트 리스너 해제
function unregisterGlobalEventListeners() {
    document.removeEventListener('keydown', handleKeyboardShortcuts);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('drop', handleDrop);
}

// 폼 유효성 검사
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (isEmpty(field.value)) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// 입력 필드 실시간 유효성 검사
function setupFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (isEmpty(input.value) && input.hasAttribute('required')) {
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        input.addEventListener('input', () => {
            if (!isEmpty(input.value)) {
                input.classList.remove('border-red-500');
            }
        });
    });
}

// 토스트 메시지 표시 (utils.js의 함수 사용)
// showToast 함수는 utils.js에서 정의되므로 여기서는 제거

// 모달 관리
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('animate-fade-in-scale');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('animate-fade-out-scale');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('animate-fade-out-scale');
        }, 300);
    }
}

// 확인 대화상자 (커스텀)
function showConfirmDialog(title, message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50';
    dialog.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div class="flex items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-bold text-slate-900">${title}</h3>
                    <div class="mt-2">
                        <div class="text-sm text-slate-500">${message}</div>
                    </div>
                </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button id="confirmBtn" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    확인
                </button>
                <button id="cancelBtn" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    취소
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('confirmBtn').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (onConfirm) onConfirm();
    });
    
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (onCancel) onCancel();
    });
    
    // ESC 키로 닫기
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(dialog);
            document.removeEventListener('keydown', handleEsc);
            if (onCancel) onCancel();
        }
    };
    document.addEventListener('keydown', handleEsc);
}
