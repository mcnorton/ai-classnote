// UI 렌더링 함수들

// 메인 앱 렌더링
function renderApp() {
    const app = document.getElementById('app');
    if (!app) {
        console.error('앱 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    app.innerHTML = `
        ${renderHeader()}
        <div class="flex-grow flex overflow-hidden">
            ${renderSidebar()}
            ${renderMain()}
        </div>
        ${renderModals()}
    `;
    
    attachEventListeners();
}

// 헤더 렌더링
function renderHeader() {
    const primaryStudent = getPrimaryStudent();
    return `
        <header class="flex-shrink-0 bg-white shadow-md">
            <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fas fa-child text-3xl text-blue-600 mr-4"></i>
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">${appState.settings.appTitle}</h1>
                        ${(appState.settings.classInfo || appState.settings.teacherName) ? `
                            <div class="text-sm text-slate-500 mt-1">
                                ${appState.settings.classInfo ? `<span>${appState.settings.classInfo}</span>` : ''}
                                ${appState.settings.classInfo && appState.settings.teacherName ? '<span class="mx-2">|</span>' : ''}
                                ${appState.settings.teacherName ? `<span>${appState.settings.teacherName}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="openStudentModal()" class="mobile-student-btn hidden items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" title="학생 관리">
                        <i class="fas fa-users mr-2"></i>
                        <span class="text-sm">${primaryStudent ? primaryStudent.name : '학생 선택'}</span>
                    </button>
                    <button onclick="openSettings()" class="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100 no-print" title="설정">
                        <i class="fas fa-cog text-xl"></i>
                    </button>
                    <button onclick="testApiConnectionEvent()" class="text-slate-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-slate-100 no-print" title="API 연결 테스트">
                        <i class="fas fa-wifi text-xl"></i>
                    </button>
                </div>
            </div>
        </header>
    `;
}

// 사이드바 렌더링
function renderSidebar() {
    const activeStudents = getActiveStudents();
    const deletedStudents = getDeletedStudents();
    const studentsToDisplay = appState.viewMode === 'active' ? activeStudents : deletedStudents;

    return `
        <aside class="w-72 flex-shrink-0 bg-white h-full border-r border-slate-200 flex flex-col no-print">
            <div class="p-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-700 mb-3">학생 관리</h2>
                <div class="flex border-b border-gray-200">
                    <button onclick="setViewMode('active')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}">
                        현재 학생 (${activeStudents.length})
                    </button>
                    <button onclick="setViewMode('deleted')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'deleted' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}">
                        삭제된 학생 (${deletedStudents.length})
                    </button>
                </div>
            </div>
            <div class="flex-grow overflow-y-auto">
                 ${studentsToDisplay.length === 0 ? `
                     <div class="p-4 text-center text-slate-500 pt-10">
                         ${appState.viewMode === 'active' ? 
                             '<div class="space-y-2"><p class="text-lg font-medium">학생이 없습니다</p><p class="text-sm">아래 버튼을 눌러 첫 번째 학생을 추가하세요.</p></div>' : 
                             '<div class="space-y-2"><p class="text-lg font-medium">삭제된 학생이 없습니다</p><p class="text-sm">현재 학생 목록에서 학생을 삭제하면 여기에 표시됩니다.</p></div>'
                         }
                     </div>
                 ` : `
                    <ul>
                        ${studentsToDisplay.map(student => renderStudentItem(student)).join('')}
                    </ul>
                `}
            </div>
             ${appState.viewMode === 'active' ? `
                 <div class="p-4 border-t border-slate-200">
                     <button onclick="showAddStudentForm()" class="w-full flex items-center justify-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                         <i class="fas fa-plus mr-2"></i> 학생 추가하기
                     </button>
                 </div>
             ` : `
                 <div class="p-4 border-t border-slate-200 bg-slate-50">
                     <div class="text-center text-sm text-slate-600">
                         <p class="mb-2"><i class="fas fa-info-circle mr-1"></i>삭제된 학생 관리</p>
                         <p class="text-xs text-slate-500">복원하거나 영구 삭제할 수 있습니다</p>
                     </div>
                 </div>
             `}
        </aside>
    `;
}

// 학생 아이템 렌더링
function renderStudentItem(student) {
    const isPrimary = appState.selectedStudentIds[0] === student.id;
    const isSelected = appState.selectedStudentIds.includes(student.id);
    
    return `
        <li class="flex justify-between items-center text-slate-600 transition-colors duration-200 ${isSelected ? 'bg-blue-50' : 'hover:bg-blue-50'}">
            <div class="flex items-center p-3 flex-grow overflow-hidden">
                ${appState.viewMode === 'active' && !isSelected ? `
                    <button onclick="addTargetStudent('${student.id}')" class="mr-3 text-slate-400 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors flex-shrink-0" title="${student.name}님을 관찰 대상에 추가">
                        <i class="fas fa-plus"></i>
                    </button>
                ` : ''}
                ${appState.viewMode === 'active' && isSelected ? '<div class="mr-3 w-6 h-6 flex-shrink-0"></div>' : ''}
                <input 
                    type="text"
                    id="student-name-${student.id}"
                    value="${student.name}"
                    data-original-name="${student.name}"
                    readonly
                    onclick="selectStudent('${student.id}')" 
                    ondblclick="startEditStudentName('${student.id}')"
                    onblur="saveStudentNameEdit('${student.id}')"
                    onkeydown="handleStudentNameKeydown(event, '${student.id}')"
                    class="cursor-pointer bg-transparent border-none outline-none px-0 flex-grow min-w-0 ${isPrimary ? 'text-blue-700 font-semibold' : ''} focus:cursor-text focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2"
                    title="더블클릭하여 이름 수정"
                />
            </div>
            <div class="space-x-3 pr-3 flex-shrink-0">
                ${appState.viewMode === 'active' ? `
                    <button onclick="softDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity" title="삭제 목록으로 이동">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : `
                    <button onclick="restoreStudent('${student.id}')" class="text-slate-400 hover:text-green-600 opacity-50 hover:opacity-100 transition-opacity" title="복원하기">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button onclick="permanentDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-600 opacity-50 hover:opacity-100 transition-opacity" title="영구 삭제">
                        <i class="fas fa-eraser"></i>
                    </button>
                `}
            </div>
        </li>
    `;
}

// 메인 영역 렌더링
function renderMain() {
    const primaryStudent = getPrimaryStudent();
    
    // 삭제된 학생 목록 모드이고 선택된 학생이 없을 때
    if (appState.viewMode === 'deleted' && !primaryStudent) {
        return renderEmptyDeletedStudentsMessage();
    }
    
    // 일반적인 경우 (학생이 없을 때)
    if (!primaryStudent) {
        return renderWelcomeMessage();
    }

    const studentData = appState.studentData[primaryStudent.id] || { observations: [], summary: '', summaryTimestamp: null };
    const isDeletedStudentSelected = appState.selectedStudentIds.some(id => appState.students.find(s => s.id === id)?.isDeleted);

    return `
        <main class="flex-grow p-6 h-full flex flex-col bg-slate-50 overflow-y-auto">
            ${isDeletedStudentSelected && appState.selectedStudentIds.length === 1 ? renderDeletedStudentWarning(primaryStudent) : ''}

            <div class="bg-white p-4 rounded-lg shadow-sm mb-6 ${isDeletedStudentSelected ? 'opacity-50 pointer-events-none' : ''}">
                ${renderObservationForm(primaryStudent, isDeletedStudentSelected)}
            </div>
            
            <div class="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${renderObservationPanel(studentData.observations)}
                ${renderSummaryPanel(studentData, primaryStudent.isDeleted)}
            </div>
        </main>
    `;
}

// 환영 메시지
function renderWelcomeMessage() {
    return `
        <main class="flex-grow flex items-center justify-center h-full bg-slate-50 text-slate-500">
            <div class="text-center">
                <i class="fas fa-user-plus text-5xl mb-4"></i>
                <h2 class="text-2xl font-semibold">시작하기</h2>
                <p>왼쪽 메뉴에서 학생을 추가하거나 선택하여 관찰 기록을 시작하세요.</p>
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 class="text-lg font-semibold text-blue-800 mb-2">사용법</h3>
                    <ol class="text-left text-sm text-blue-700 space-y-1">
                        <li>1. "학생 추가하기" 버튼으로 학생을 등록하세요</li>
                        <li>2. 학생을 선택하여 관찰 기록을 작성하세요</li>
                        <li>3. "AI 요약 생성" 버튼으로 종합 분석을 받으세요</li>
                        <li>4. 설정에서 API 키를 입력하세요</li>
                    </ol>
                </div>
            </div>
        </main>
    `;
}

// 삭제된 학생 목록이 비어있을 때의 안내 메시지
function renderEmptyDeletedStudentsMessage() {
    return `
        <div class="flex-grow flex items-center justify-center h-full bg-slate-50 text-slate-500">
            <div class="text-center">
                <i class="fas fa-trash-alt text-5xl mb-4 text-slate-300"></i>
                <h2 class="text-2xl font-semibold">삭제된 학생이 없습니다</h2>
                <p>현재 학생 목록에서 학생을 삭제하면 여기에 표시됩니다.</p>
                <div class="mt-6 p-4 bg-amber-50 rounded-lg">
                    <h3 class="text-lg font-semibold text-amber-800 mb-2">삭제된 학생 관리</h3>
                    <ul class="text-left text-sm text-amber-700 space-y-1">
                        <li>• 삭제된 학생은 복원하거나 영구 삭제할 수 있습니다</li>
                        <li>• 복원된 학생은 현재 학생 목록으로 이동됩니다</li>
                        <li>• 영구 삭제된 학생은 복구할 수 없습니다</li>
                        <li>• 삭제된 학생의 관찰 기록은 조회만 가능합니다</li>
                    </ul>
                </div>
                <div class="mt-4">
                    <button onclick="setViewMode('active')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <i class="fas fa-list mr-2"></i>현재 학생 목록으로
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 삭제된 학생 경고
function renderDeletedStudentWarning(student) {
    return `
        <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
            <div class="flex justify-between items-center">
                <div><p class="font-bold">삭제된 학생</p><p>이 학생의 기록은 현재 조회만 가능합니다.</p></div>
                <button onclick="restoreStudent('${student.id}')" class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">복원하기</button>
            </div>
        </div>
    `;
}

// 관찰 기록 폼
function renderObservationForm(primaryStudent, isDeletedStudentSelected) {
    // 임시 저장된 값 또는 기본값 사용
    const savedText = appState.tempObservation.text || '';
    const savedDate = appState.tempObservation.date || getCurrentDate();
    
    return `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-slate-800">${primaryStudent.name} 관찰 기록 추가</h3>
            <input type="date" id="observationDate" value="${savedDate}" class="p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 no-print" ${isDeletedStudentSelected ? 'disabled' : ''}>
        </div>
        
        <div class="mb-4 no-print">
            <label class="block text-sm font-medium text-slate-700 mb-2">관찰 대상 학생</label>
            <div class="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-md min-h-[40px]">
                ${appState.selectedStudentIds.map(id => {
                    const student = appState.students.find(s => s.id === id);
                    return `
                        <span class="bg-blue-100 text-blue-800 text-sm font-semibold pl-3 pr-2 py-1 rounded-full flex items-center">
                            ${student.name}
                            ${id !== primaryStudent.id && !isDeletedStudentSelected ? `
                                <button onclick="removeTargetStudent('${id}')" class="ml-2 text-blue-500 hover:text-blue-800 w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors" title="${student.name}님을 대상에서 제외">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            ` : ''}
                        </span>
                    `;
                }).join('')}
            </div>
        </div>

        <textarea id="observationText" rows="4" class="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-print" placeholder="${isDeletedStudentSelected ? '삭제된 학생의 기록은 추가할 수 없습니다.' : '학생의 구체적인 행동이나 발언을 기록하세요. 예: (국어) 수업 중 적극적으로 발표함.'}" ${isDeletedStudentSelected ? 'disabled' : ''}>${savedText}</textarea>
        <div class="flex justify-end mt-3 no-print">
            <button onclick="handleAddObservation()" class="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors" ${isDeletedStudentSelected ? 'disabled' : ''}>기록하기</button>
        </div>
    `;
}

// 관찰 기록 패널
function renderObservationPanel(observations) {
    const primaryStudent = getPrimaryStudent();
    const studentId = primaryStudent ? primaryStudent.id : null;
    
    return `
        <div id="observationPanel" class="bg-white p-4 rounded-lg shadow-sm flex flex-col">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">누가 기록</h3>
            <div class="flex-grow overflow-y-auto pr-2">
                ${observations.length > 0 ? `
                    <ul class="space-y-4">
                        ${sortObservationsByDate(observations).map(obs => `
                            <li class="p-3 bg-slate-50 rounded-md" id="obs-item-${obs.id}">
                                <div class="flex items-start gap-2">
                                    <input 
                                        type="text" 
                                        id="obs-text-${obs.id}" 
                                        value="${obs.text.replace(/"/g, '&quot;')}" 
                                        readonly
                                        class="flex-grow text-sm text-slate-800 bg-transparent border-none outline-none px-0 cursor-default focus:cursor-text focus:bg-white focus:border focus:border-blue-500 focus:rounded focus:px-2 focus:py-1"
                                    />
                                </div>
                                <div class="flex items-center justify-between mt-2">
                                    <p class="text-xs text-slate-500">${formatDate(obs.timestamp)}</p>
                                    <div class="flex items-center gap-2" id="obs-actions-${obs.id}">
                                        <button 
                                            onclick="startEditObservation('${studentId}', '${obs.id}')" 
                                            class="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                            title="수정"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            onclick="deleteObservationEvent('${studentId}', '${obs.id}')" 
                                            class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            title="삭제"
                                        >
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                ` : `
                    <div class="flex items-center justify-center h-full text-slate-500">
                        <p>기록된 관찰 내용이 없습니다.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// 요약 패널
function renderSummaryPanel(studentData, isStudentDeleted) {
    const observations = studentData.observations || [];
    const summary = studentData.summary || '';
    const summaryTimestamp = studentData.summaryTimestamp;
    
    let buttonText = '요약 생성';
    let buttonClass = 'bg-indigo-600 hover:bg-indigo-700';
    
    if (summary) {
        const hasNewObservations = summaryTimestamp && observations.length > 0 && 
            new Date(observations.reduce((latest, obs) => (new Date(obs.timestamp) > new Date(latest) ? obs.timestamp : latest), observations[0].timestamp)) > new Date(summaryTimestamp);
        
        if (!summaryTimestamp || hasNewObservations) {
            buttonText = '업데이트';
            buttonClass = 'bg-green-600 hover:bg-green-700';
        } else {
            buttonText = '다시분석';
            buttonClass = 'bg-blue-600 hover:bg-blue-700';
        }
    }
    
    const isActionDisabled = observations.length === 0 || appState.isLoadingSummary || isStudentDeleted;

    return `
        <div class="bg-white p-4 rounded-lg shadow-sm flex flex-col">
            <div class="flex justify-between items-center mb-3 border-b pb-2">
                <h3 class="text-lg font-semibold text-slate-800">AI 요약 및 분석</h3>
                ${summaryTimestamp ? `
                    <span class="text-xs text-slate-500 ml-auto mr-4" title="마지막 분석: ${formatDate(summaryTimestamp)}">
                        ${formatDateShort(summaryTimestamp)}
                    </span>
                ` : ''}
                <button onclick="generateSummaryEvent()" class="no-print flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed ${buttonClass}" ${isActionDisabled ? 'disabled' : ''}>
                    <i class="fas fa-magic-sparkles mr-2"></i> ${appState.isLoadingSummary ? '생성 중...' : buttonText}
                </button>
            </div>
            <div class="flex-grow overflow-y-auto pr-2">
                ${appState.isLoadingSummary ? `
                    <div class="flex flex-col items-center justify-center h-full text-slate-500">
                        <div class="loading-spinner"></div>
                        <p class="mt-4">AI가 관찰 기록을 분석하고 있습니다...</p>
                    </div>
                ` : summary ? `
                    <div class="prose prose-sm max-w-none text-slate-700">
                        ${parseMarkdown(summary)}
                    </div>
                ` : `
                    <div class="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                        <i class="fas fa-lightbulb text-4xl mb-4 text-indigo-300"></i>
                        <p>관찰 기록을 바탕으로 AI가</p>
                        <p>학생의 종합적인 분석을 제공합니다.</p>
                        <p class="text-xs mt-2">(기록이 3개 이상일 때 가장 효과적입니다.)</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// 설정 모달 렌더링
function renderSettingsModal() {
    return `
        <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 p-4" style="display: none;">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col transform transition-all duration-300 animate-fade-in-scale">
                <div class="flex-shrink-0 p-6 border-b border-slate-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mr-3">
                                <i class="fas fa-cog text-blue-600 text-xl"></i>
                            </div>
                            <h3 class="text-lg leading-6 font-bold text-slate-900">앱 설정</h3>
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="closeSettings()" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                취소
                            </button>
                            <button onclick="saveSettings()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                저장
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700">앱 타이틀</label>
                                <input type="text" id="appTitle" value="${appState.settings.appTitle}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="예: AI ClassNote">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">학급 정보</label>
                                <input type="text" id="classInfo" value="${appState.settings.classInfo}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="예: OO초등학교 1학년 2반">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">교사 정보</label>
                                <input type="text" id="teacherName" value="${appState.settings.teacherName}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="예: 담임교사 홍길동">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">Gemini API 키</label>
                                <div class="flex gap-2">
                                    <input type="password" id="apiKey" value="${getApiKey() || ''}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="API 키를 입력하세요">
                                    <button onclick="toggleApiKeyVisibility()" class="mt-1 px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 flex-shrink-0" title="표시/숨김">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="deleteApiKey()" class="mt-1 px-3 py-2 border border-red-300 rounded-md bg-red-50 hover:bg-red-100 text-red-600 flex-shrink-0" title="API 키 삭제">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <p class="mt-2 text-xs text-slate-500">
                                    💡 API 키는 브라우저에 저장됩니다. 공용 컴퓨터에서는 사용 후 [삭제] 버튼을 눌러주세요.
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-200">
                            <h4 class="text-base font-bold text-slate-800 mb-3">사용자 프롬프트</h4>
                            <p class="text-sm text-slate-600 mb-3">
                                ${appState.settings.customPrompt ? 
                                    '<span class="text-blue-600"><i class="fas fa-check-circle mr-1"></i>사용자 프롬프트 사용 중</span>' : 
                                    '<span class="text-slate-500"><i class="fas fa-info-circle mr-1"></i>기본 프롬프트 사용 중</span>'
                                }
                            </p>
                            <button onclick="openPromptEditor()" class="w-full inline-flex justify-center items-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <i class="fas fa-edit mr-2"></i> AI 요약 프롬프트 편집
                            </button>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-200">
                            <h4 class="text-base font-bold text-slate-800 mb-3">데이터 관리</h4>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="exportData()" class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-600 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                                    <i class="fas fa-file-export mr-2"></i> 데이터 내보내기
                                </button>
                                <button onclick="showImportDialog()" class="w-full inline-flex justify-center items-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <i class="fas fa-file-import mr-2"></i> 데이터 가져오기
                                </button>
                            </div>
                            <input type="file" id="importFile" accept="application/json" style="display: none;" onchange="handleFileImport(event)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 프롬프트 편집 모달 렌더링
function renderPromptEditorModal() {
    return `
        <div id="promptEditorModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] transition-opacity duration-300" style="display: none;">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 flex flex-col max-h-[90vh] transform transition-all duration-300 animate-fade-in-scale">
                <div class="flex items-center justify-between p-6 border-b border-slate-200">
                    <div class="flex items-center">
                        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mr-3">
                            <i class="fas fa-edit text-blue-600 text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-slate-900">AI 요약 프롬프트 편집</h3>
                            <p class="text-xs text-slate-500 mt-0.5">{{STUDENT_NAME}}, {{OBSERVATIONS}} 변수를 사용할 수 있습니다.</p>
                        </div>
                    </div>
                    <button onclick="closePromptEditor()" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="flex-grow overflow-y-auto p-6">
                    <textarea id="promptEditorText" rows="20" class="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs resize-none" placeholder="사용자 정의 프롬프트를 입력하세요..."></textarea>
                </div>
                
                <div class="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
                    <button onclick="loadDefaultPromptToPromptEditor()" class="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-undo mr-2"></i> 초기값으로
                    </button>
                    <div class="flex space-x-3">
                        <button onclick="closePromptEditor()" class="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            닫기
                        </button>
                        <button onclick="savePromptFromEditor()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <i class="fas fa-save mr-2"></i> 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 학생 선택 모달 렌더링
function renderStudentModal() {
    const activeStudents = getActiveStudents();
    const deletedStudents = getDeletedStudents();
    const studentsToDisplay = appState.viewMode === 'active' ? activeStudents : deletedStudents;

    return `
        <div id="studentModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 p-4" style="display: none;">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col transform transition-all duration-300 animate-fade-in-scale">
                <div class="flex-shrink-0 p-4 border-b border-slate-200">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-bold text-slate-900">학생 관리</h3>
                        <button onclick="closeStudentModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="flex border-b border-gray-200">
                        <button onclick="setViewMode('active')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}">
                            현재 학생 (${activeStudents.length})
                        </button>
                        <button onclick="setViewMode('deleted')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'deleted' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}">
                            삭제된 학생 (${deletedStudents.length})
                        </button>
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto p-4">
                    ${studentsToDisplay.length === 0 ? `
                        <div class="text-center text-slate-500 py-8">
                            ${appState.viewMode === 'active' ? 
                                '<p class="font-medium">학생이 없습니다</p><p class="text-sm mt-2">아래 버튼을 눌러 첫 번째 학생을 추가하세요.</p>' : 
                                '<p class="font-medium">삭제된 학생이 없습니다</p>'
                            }
                        </div>
                    ` : `
                        <ul class="space-y-2">
                            ${studentsToDisplay.map(student => renderStudentModalItem(student)).join('')}
                        </ul>
                    `}
                </div>
                ${appState.viewMode === 'active' ? `
                    <div class="p-4 border-t border-slate-200">
                        <button onclick="showAddStudentForm(); closeStudentModal();" class="w-full flex items-center justify-center px-4 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                            <i class="fas fa-plus mr-2"></i> 학생 추가하기
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 학생 모달 아이템 렌더링
function renderStudentModalItem(student) {
    const isPrimary = appState.selectedStudentIds[0] === student.id;
    const isSelected = appState.selectedStudentIds.includes(student.id);
    
    return `
        <li class="flex justify-between items-center p-3 rounded-md transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}">
            <div class="flex items-center flex-grow min-w-0">
                ${appState.viewMode === 'active' && !isSelected ? `
                    <button onclick="addTargetStudent('${student.id}'); updateStudentModalContent();" class="mr-3 text-slate-400 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors flex-shrink-0" title="${student.name}님을 관찰 대상에 추가">
                        <i class="fas fa-plus"></i>
                    </button>
                ` : ''}
                ${appState.viewMode === 'active' && isSelected ? '<div class="mr-3 w-6 h-6 flex-shrink-0"></div>' : ''}
                <button onclick="selectStudent('${student.id}'); closeStudentModal();" class="flex-grow text-left ${isPrimary ? 'text-blue-700 font-semibold' : 'text-slate-700'} truncate">
                    ${student.name}
                    ${isPrimary ? '<i class="fas fa-check ml-2 text-blue-600"></i>' : ''}
                </button>
            </div>
            <div class="space-x-2 flex-shrink-0 ml-2">
                ${appState.viewMode === 'active' ? `
                    <button onclick="softDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-500 p-2" title="삭제">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : `
                    <button onclick="restoreStudent('${student.id}')" class="text-slate-400 hover:text-green-600 p-2" title="복원">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button onclick="permanentDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-600 p-2" title="영구 삭제">
                        <i class="fas fa-eraser"></i>
                    </button>
                `}
            </div>
        </li>
    `;
}

// 모달 렌더링
function renderModals() {
    return renderSettingsModal() + renderPromptEditorModal() + renderStudentModal();
}

// 모달이 DOM에 존재하는지 확인하고 없으면 추가
function ensureModalExists() {
    const existingModal = document.getElementById('settingsModal');
    if (!existingModal) {
        const app = document.getElementById('app');
        if (app) {
            app.insertAdjacentHTML('beforeend', renderSettingsModal());
        }
    }
}

// 이벤트 리스너 연결 (중복 등록 방지)
let eventListenersAttached = false;

function attachEventListeners() {
    if (eventListenersAttached) return;
    
    // 모달 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            closeSettings();
        }
        if (e.target.id === 'promptEditorModal') {
            closePromptEditor();
        }
        if (e.target.id === 'studentModal') {
            closeStudentModal();
        }
    });
    
    eventListenersAttached = true;
}

// API 키 표시/숨김 토글
function toggleApiKeyVisibility() {
    try {
        const apiKeyInput = document.getElementById('apiKey');
        if (!apiKeyInput) {
            console.error('API 키 입력 필드를 찾을 수 없습니다.');
            return;
        }
        
        // 부모 요소에서 버튼 찾기
        const inputContainer = apiKeyInput.parentElement;
        if (!inputContainer) {
            console.error('API 키 입력 필드의 부모 요소를 찾을 수 없습니다.');
            return;
        }
        
        const toggleButton = inputContainer.querySelector('button');
        const icon = toggleButton ? toggleButton.querySelector('i') : null;
        
        if (!icon) {
            console.error('토글 버튼 아이콘을 찾을 수 없습니다.');
            return;
        }
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            apiKeyInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    } catch (error) {
        console.error('API 키 표시/숨김 토글 중 오류:', error);
        showError('API 키 표시/숨김 전환 중 오류가 발생했습니다.');
    }
}

// 전역 window 객체에 명시적으로 할당
window.toggleApiKeyVisibility = toggleApiKeyVisibility;

// API 키 삭제
function deleteApiKey() {
    if (!getApiKey()) {
        showToast('삭제할 API 키가 없습니다.', 'info');
        return;
    }
    
    if (confirmAction('저장된 API 키를 삭제하시겠습니까?\n삭제 후 다시 사용하려면 API 키를 재입력해야 합니다.')) {
        // API 키 완전 삭제
        setApiKey(null);
        
        // 입력 필드도 비우기
        const apiKeyEl = document.getElementById('apiKey');
        if (apiKeyEl) {
            apiKeyEl.value = '';
        }
        
        showSuccess('API 키가 삭제되었습니다.');
    }
}

// 전역 window 객체에 명시적으로 할당
window.deleteApiKey = deleteApiKey;

// 설정 모달 열기
function openSettings() {
    // 모달을 다시 렌더링하여 최신 상태 반영
    const app = document.getElementById('app');
    const existingModal = document.getElementById('settingsModal');
    
    if (existingModal) {
        existingModal.remove();
    }
    
    if (app) {
        app.insertAdjacentHTML('beforeend', renderSettingsModal());
    }
    
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
        // 현재 설정값으로 입력 필드 업데이트
        const appTitleEl = document.getElementById('appTitle');
        const classInfoEl = document.getElementById('classInfo');
        const teacherNameEl = document.getElementById('teacherName');
        const apiKeyEl = document.getElementById('apiKey');
        
        if (appTitleEl) appTitleEl.value = appState.settings.appTitle || '';
        if (classInfoEl) classInfoEl.value = appState.settings.classInfo || '';
        if (teacherNameEl) teacherNameEl.value = appState.settings.teacherName || '';
        if (apiKeyEl) apiKeyEl.value = getApiKey() || '';
        
        // API 키 필드를 다시 password 타입으로 설정
        if (apiKeyEl) {
            apiKeyEl.type = 'password';
            const toggleButton = apiKeyEl.parentElement.querySelector('button');
            if (toggleButton) {
                const icon = toggleButton.querySelector('i');
                if (icon) icon.className = 'fas fa-eye';
            }
        }
    } else {
        console.error('설정 모달을 찾을 수 없습니다.');
    }
}

// 설정 모달 닫기
function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 설정 저장
function saveSettings() {
    try {
        const appTitleEl = document.getElementById('appTitle');
        const classInfoEl = document.getElementById('classInfo');
        const teacherNameEl = document.getElementById('teacherName');
        const apiKeyEl = document.getElementById('apiKey');
        
        if (!appTitleEl || !classInfoEl || !teacherNameEl || !apiKeyEl) {
            showError('설정 폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        const newSettings = {
            appTitle: appTitleEl.value.trim() || 'AI ClassNote',
            classInfo: classInfoEl.value.trim() || '',
            teacherName: teacherNameEl.value.trim() || '',
            customPrompt: appState.settings.customPrompt || '' // 기존 프롬프트 유지
        };
        
        const apiKey = apiKeyEl.value.trim();
        if (apiKey) {
            setApiKey(apiKey);
        }
        
        updateSettings(newSettings);
        closeSettings();
        renderApp();
        showSuccess('설정이 저장되었습니다.');
    } catch (error) {
        console.error('설정 저장 중 오류:', error);
        showError('설정 저장 중 오류가 발생했습니다: ' + error.message);
    }
}

// 파일 가져오기 다이얼로그 표시
function showImportDialog() {
    try {
        const importFileEl = document.getElementById('importFile');
        if (importFileEl) {
            importFileEl.click();
        } else {
            console.error('파일 입력 요소를 찾을 수 없습니다.');
            showError('파일 선택 대화상자를 열 수 없습니다.');
        }
    } catch (error) {
        console.error('파일 가져오기 다이얼로그 표시 중 오류:', error);
        showError('파일 가져오기 다이얼로그 표시 중 오류가 발생했습니다.');
    }
}

// 전역 window 객체에 명시적으로 할당
window.showImportDialog = showImportDialog;

// 파일 가져오기 처리
function handleFileImport(event) {
    try {
        const file = event.target.files[0];
        if (file) {
            readFile(file).then(content => {
                if (importData(content)) {
                    renderApp();
                    closeSettings();
                }
            }).catch(error => {
                console.error('파일 읽기 오류:', error);
                showError('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
            });
        }
        // 파일 입력 초기화
        event.target.value = '';
    } catch (error) {
        console.error('파일 가져오기 처리 중 오류:', error);
        showError('파일 가져오기 처리 중 오류가 발생했습니다.');
    }
}

// 전역 window 객체에 명시적으로 할당
window.handleFileImport = handleFileImport;

// 프롬프트 편집기 상태 관리
let promptEditorState = {
    originalPrompt: '',
    isOpen: false
};

// 모달이 DOM에 존재하는지 확인하고 없으면 추가
function ensurePromptEditorModalExists() {
    const existingModal = document.getElementById('promptEditorModal');
    if (!existingModal) {
        const app = document.getElementById('app');
        if (app) {
            app.insertAdjacentHTML('beforeend', renderPromptEditorModal());
        }
    }
}

// 프롬프트 편집기 열기
async function openPromptEditor() {
    try {
        // 모달이 존재하지 않으면 생성
        ensurePromptEditorModalExists();
        
        const modal = document.getElementById('promptEditorModal');
        const textArea = document.getElementById('promptEditorText');
        
        if (!modal || !textArea) {
            showError('프롬프트 편집기를 찾을 수 없습니다.');
            return;
        }
        
        // 현재 프롬프트 값 불러오기
        let currentPrompt = appState.settings.customPrompt || '';
        
        // 비어있으면 기본 프롬프트 로드
        if (!currentPrompt) {
            try {
                const response = await fetch('prompt.txt');
                if (response.ok) {
                    currentPrompt = await response.text();
                    currentPrompt = currentPrompt.replace(/\/\*\*[\s\S]*?\*\//g, '').trim();
                }
            } catch (error) {
                console.log('기본 프롬프트 로드 실패, 내장 프롬프트 사용');
                currentPrompt = getDefaultPromptTemplate();
            }
        }
        
        // 편집기에 프롬프트 설정
        textArea.value = currentPrompt;
        promptEditorState.originalPrompt = currentPrompt;
        promptEditorState.isOpen = true;
        
        // 모달 표시
        modal.style.display = 'flex';
        
        // 포커스 설정
        setTimeout(() => textArea.focus(), 100);
    } catch (error) {
        console.error('프롬프트 편집기 열기 오류:', error);
        showError('프롬프트 편집기를 여는 중 오류가 발생했습니다.');
    }
}

// 프롬프트 편집기 닫기
function closePromptEditor() {
    const modal = document.getElementById('promptEditorModal');
    const textArea = document.getElementById('promptEditorText');
    
    if (!modal || !textArea) return;
    
    // 변경사항 확인
    const currentText = textArea.value.trim();
    const hasChanges = currentText !== promptEditorState.originalPrompt;
    
    if (hasChanges) {
        if (confirmAction('저장하지 않은 변경사항이 있습니다.\n닫으시겠습니까?')) {
            modal.style.display = 'none';
            promptEditorState.isOpen = false;
        }
    } else {
        modal.style.display = 'none';
        promptEditorState.isOpen = false;
    }
}

// 프롬프트 초기화 (사용자 프롬프트 삭제)
async function loadDefaultPromptToPromptEditor() {
    try {
        if (confirmAction('사용자 프롬프트를 초기화하시겠습니까?\n기본 프롬프트를 사용하게 됩니다.')) {
            // 사용자 프롬프트를 완전히 제거
            const newSettings = {
                ...appState.settings,
                customPrompt: '' // 빈 문자열로 설정하여 기본 프롬프트 사용
            };
            
            updateSettings(newSettings);
            
            showSuccess('프롬프트가 초기화되었습니다. 기본 프롬프트를 사용합니다.');
            
            // 편집기만 닫기 (설정 창은 유지)
            closePromptEditorWithoutConfirm();
            
            // 설정 모달이 열려있다면 내용만 업데이트
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal && settingsModal.style.display === 'flex') {
                // 설정 모달을 새로 렌더링하여 상태 업데이트
                settingsModal.remove();
                const app = document.getElementById('app');
                if (app) {
                    app.insertAdjacentHTML('beforeend', renderSettingsModal());
                    const newModal = document.getElementById('settingsModal');
                    if (newModal) {
                        newModal.style.display = 'flex';
                        // 입력 필드 값 복원
                        const appTitleEl = document.getElementById('appTitle');
                        const classInfoEl = document.getElementById('classInfo');
                        const teacherNameEl = document.getElementById('teacherName');
                        const apiKeyEl = document.getElementById('apiKey');
                        
                        if (appTitleEl) appTitleEl.value = appState.settings.appTitle || '';
                        if (classInfoEl) classInfoEl.value = appState.settings.classInfo || '';
                        if (teacherNameEl) teacherNameEl.value = appState.settings.teacherName || '';
                        if (apiKeyEl) {
                            apiKeyEl.value = getApiKey() || '';
                            apiKeyEl.type = 'password';
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('프롬프트 초기화 오류:', error);
        showError('프롬프트 초기화 중 오류가 발생했습니다: ' + error.message);
    }
}

// 프롬프트 저장
function savePromptFromEditor() {
    try {
        const textArea = document.getElementById('promptEditorText');
        if (!textArea) {
            showError('프롬프트 편집기를 찾을 수 없습니다.');
            return;
        }
        
        const newPrompt = textArea.value.trim();
        const hasChanges = newPrompt !== promptEditorState.originalPrompt;
        
        // 변경사항이 없으면 저장하지 않음
        if (!hasChanges) {
            showSuccess('변경사항이 없습니다.');
            closePromptEditorWithoutConfirm();
            return;
        }
        
        // 빈 문자열로 저장하려는 경우 경고
        if (newPrompt === '') {
            showError('프롬프트를 비울 수 없습니다. 기본 프롬프트를 사용하려면 "초기값으로" 버튼을 사용하세요.');
            return;
        }
        
        // 변경사항이 있으면 저장 확인
        if (confirmAction('프롬프트를 저장하시겠습니까?')) {
            // 설정 업데이트
            const newSettings = {
                ...appState.settings,
                customPrompt: newPrompt
            };
            
            updateSettings(newSettings);
            promptEditorState.originalPrompt = newPrompt;
            
            showSuccess('프롬프트가 저장되었습니다.');
            
            closePromptEditorWithoutConfirm();
            
            // 앱 전체를 다시 렌더링하여 설정 모달의 상태도 업데이트
            renderApp();
        }
    } catch (error) {
        console.error('프롬프트 저장 중 오류:', error);
        showError('프롬프트 저장 중 오류가 발생했습니다.');
    }
}

// 확인 없이 프롬프트 편집기 닫기
function closePromptEditorWithoutConfirm() {
    const modal = document.getElementById('promptEditorModal');
    if (modal) {
        modal.style.display = 'none';
        promptEditorState.isOpen = false;
    }
}

// 학생 모달 열기
function openStudentModal() {
    // 모달을 다시 렌더링하여 최신 상태 반영
    const app = document.getElementById('app');
    const existingModal = document.getElementById('studentModal');
    
    if (existingModal) {
        existingModal.remove();
    }
    
    if (app) {
        app.insertAdjacentHTML('beforeend', renderStudentModal());
    }
    
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error('학생 모달을 찾을 수 없습니다.');
    }
}

// 학생 모달 닫기
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 학생 모달 내용만 업데이트 (모달을 닫지 않음)
function updateStudentModalContent() {
    const modal = document.getElementById('studentModal');
    if (modal && modal.style.display === 'flex') {
        // 기존 모달 제거하고 다시 렌더링
        const app = document.getElementById('app');
        modal.remove();
        if (app) {
            app.insertAdjacentHTML('beforeend', renderStudentModal());
            const newModal = document.getElementById('studentModal');
            if (newModal) {
                newModal.style.display = 'flex';
            }
        }
    }
}

// 전역 window 객체에 명시적으로 할당
window.openPromptEditor = openPromptEditor;
window.closePromptEditor = closePromptEditor;
window.loadDefaultPromptToPromptEditor = loadDefaultPromptToPromptEditor;
window.savePromptFromEditor = savePromptFromEditor;
window.openStudentModal = openStudentModal;
window.closeStudentModal = closeStudentModal;
window.updateStudentModalContent = updateStudentModalContent;
