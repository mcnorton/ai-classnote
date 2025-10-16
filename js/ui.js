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
                    ${!getApiKey() ? `
                        <a onclick="openApiKeyGuide()" class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors no-print" title="${getMessage('ui.header.getApiKeyTooltip')}">
                            <i class="fas fa-key mr-2"></i>
                            <span>${getMessage('ui.header.getApiKey')}</span>
                        </a>
                    ` : ''}
                    <button onclick="openStudentModal()" class="mobile-student-btn hidden items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" title="${getMessage('ui.header.studentManagement')}">
                        <i class="fas fa-users mr-2"></i>
                        <span class="text-sm">${primaryStudent ? primaryStudent.name : getMessage('ui.header.selectStudent')}</span>
                    </button>
                    <button onclick="openSettings()" class="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100 no-print" title="${getMessage('ui.header.settings')}">
                        <i class="fas fa-cog text-xl"></i>
                    </button>
                    <button onclick="testApiConnectionEvent()" class="text-slate-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-slate-100 no-print" title="${getMessage('ui.header.testApi')}">
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
                <h2 class="text-lg font-semibold text-slate-700 mb-3">${getMessage('ui.sidebar.title')}</h2>
                <div class="flex border-b border-gray-200">
                    <button onclick="setViewMode('active')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}">
                        ${getMessage('ui.sidebar.activeStudents', { count: activeStudents.length })}
                    </button>
                    <button onclick="setViewMode('deleted')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'deleted' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}">
                        ${getMessage('ui.sidebar.deletedStudents', { count: deletedStudents.length })}
                    </button>
                </div>
            </div>
            <div class="flex-grow overflow-y-auto">
                 ${studentsToDisplay.length === 0 ? `
                     <div class="p-4 text-center text-slate-500 pt-10">
                         ${appState.viewMode === 'active' ? 
                             `<div class="space-y-2"><p class="text-lg font-medium">${getMessage('ui.sidebar.noStudents')}</p><p class="text-sm">${getMessage('ui.sidebar.noStudentsDesc')}</p></div>` : 
                             `<div class="space-y-2"><p class="text-lg font-medium">${getMessage('ui.sidebar.noDeletedStudents')}</p><p class="text-sm">${getMessage('ui.sidebar.noDeletedStudentsDesc')}</p></div>`
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
                         <i class="fas fa-plus mr-2"></i> ${getMessage('ui.sidebar.addStudent')}
                     </button>
                 </div>
             ` : `
                 <div class="p-4 border-t border-slate-200 bg-slate-50">
                     <div class="text-center text-sm text-slate-600">
                         <p class="mb-2"><i class="fas fa-info-circle mr-1"></i>${getMessage('ui.sidebar.deletedStudentsManagement')}</p>
                         <p class="text-xs text-slate-500">${getMessage('ui.sidebar.deletedStudentsManageDesc')}</p>
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
                    <button onclick="addTargetStudent('${student.id}')" class="mr-3 text-slate-400 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors flex-shrink-0" title="${getMessage('ui.tooltips.addToTarget', { name: student.name })}">
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
                    title="${getMessage('ui.tooltips.doubleClickToEdit')}"
                />
            </div>
            <div class="space-x-3 pr-3 flex-shrink-0">
                ${appState.viewMode === 'active' ? `
                    <button onclick="softDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity" title="${getMessage('ui.tooltips.moveToDeleted')}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : `
                    <button onclick="restoreStudent('${student.id}')" class="text-slate-400 hover:text-green-600 opacity-50 hover:opacity-100 transition-opacity" title="${getMessage('ui.tooltips.restore')}">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button onclick="permanentDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-600 opacity-50 hover:opacity-100 transition-opacity" title="${getMessage('ui.tooltips.permanentDelete')}">
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
                <h2 class="text-2xl font-semibold">${getMessage('ui.welcome.title')}</h2>
                <p>${getMessage('ui.welcome.description')}</p>
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 class="text-lg font-semibold text-blue-800 mb-2">${getMessage('ui.welcome.howToUseTitle')}</h3>
                    <ol class="text-left text-sm text-blue-700 space-y-1">
                        <li>1. ${getMessage('ui.welcome.step1')}</li>
                        <li>2. ${getMessage('ui.welcome.step2')}</li>
                        <li>3. ${getMessage('ui.welcome.step3')}</li>
                        <li>4. ${getMessage('ui.welcome.step4')}</li>
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
                <h2 class="text-2xl font-semibold">${getMessage('ui.deletedStudents.title')}</h2>
                <p>${getMessage('ui.deletedStudents.description')}</p>
                <div class="mt-6 p-4 bg-amber-50 rounded-lg">
                    <h3 class="text-lg font-semibold text-amber-800 mb-2">${getMessage('ui.deletedStudents.managementTitle')}</h3>
                    <ul class="text-left text-sm text-amber-700 space-y-1">
                        <li>• ${getMessage('ui.deletedStudents.point1')}</li>
                        <li>• ${getMessage('ui.deletedStudents.point2')}</li>
                        <li>• ${getMessage('ui.deletedStudents.point3')}</li>
                        <li>• ${getMessage('ui.deletedStudents.point4')}</li>
                    </ul>
                </div>
                <div class="mt-4">
                    <button onclick="setViewMode('active')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <i class="fas fa-list mr-2"></i>${getMessage('ui.deletedStudents.backToActive')}
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
                <div><p class="font-bold">${getMessage('ui.deletedWarning.title')}</p><p>${getMessage('ui.deletedWarning.description')}</p></div>
                <button onclick="restoreStudent('${student.id}')" class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">${getMessage('ui.deletedWarning.restoreButton')}</button>
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
            <h3 class="text-lg font-bold text-slate-800">${getMessage('ui.observation.formTitle', { name: primaryStudent.name })}</h3>
            <input type="date" id="observationDate" value="${savedDate}" class="p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 no-print" ${isDeletedStudentSelected ? 'disabled' : ''}>
        </div>
        
        <div class="mb-4 no-print">
            <label class="block text-sm font-medium text-slate-700 mb-2">${getMessage('ui.observation.targetStudents')}</label>
            <div class="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-md min-h-[40px]">
                ${appState.selectedStudentIds.map(id => {
                    const student = appState.students.find(s => s.id === id);
                    return `
                        <span class="bg-blue-100 text-blue-800 text-sm font-semibold pl-3 pr-2 py-1 rounded-full flex items-center">
                            ${student.name}
                            ${id !== primaryStudent.id && !isDeletedStudentSelected ? `
                                <button onclick="removeTargetStudent('${id}')" class="ml-2 text-blue-500 hover:text-blue-800 w-5 h-5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors" title="${getMessage('ui.tooltips.removeFromTarget', { name: student.name })}">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            ` : ''}
                        </span>
                    `;
                }).join('')}
            </div>
        </div>

        <textarea id="observationText" rows="4" class="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 no-print" placeholder="${isDeletedStudentSelected ? getMessage('ui.observation.placeholderDeleted') : getMessage('ui.observation.placeholder')}" ${isDeletedStudentSelected ? 'disabled' : ''}>${savedText}</textarea>
        <div class="flex justify-end mt-3 no-print">
            <button onclick="handleAddObservation()" class="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors" ${isDeletedStudentSelected ? 'disabled' : ''}>${getMessage('ui.observation.addButton')}</button>
        </div>
    `;
}

// 관찰 기록 패널
function renderObservationPanel(observations) {
    const primaryStudent = getPrimaryStudent();
    const studentId = primaryStudent ? primaryStudent.id : null;
    
    return `
        <div id="observationPanel" class="bg-white p-4 rounded-lg shadow-sm flex flex-col">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">${getMessage('ui.observation.panelTitle')}</h3>
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
                                            title="${getMessage('ui.observation.editButton')}"
                                        >
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            onclick="deleteObservationEvent('${studentId}', '${obs.id}')" 
                                            class="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            title="${getMessage('ui.observation.deleteButton')}"
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
                        <p>${getMessage('ui.observation.noRecordsDisplay')}</p>
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
    
    let buttonText = getMessage('ui.summary.generateButton');
    let buttonClass = 'bg-indigo-600 hover:bg-indigo-700';
    
    if (summary) {
        const hasNewObservations = summaryTimestamp && observations.length > 0 && 
            new Date(observations.reduce((latest, obs) => (new Date(obs.timestamp) > new Date(latest) ? obs.timestamp : latest), observations[0].timestamp)) > new Date(summaryTimestamp);
        
        if (!summaryTimestamp || hasNewObservations) {
            buttonText = getMessage('ui.summary.updateButton');
            buttonClass = 'bg-green-600 hover:bg-green-700';
        } else {
            buttonText = getMessage('ui.summary.regenerateButton');
            buttonClass = 'bg-blue-600 hover:bg-blue-700';
        }
    }
    
    const isActionDisabled = observations.length === 0 || appState.isLoadingSummary || isStudentDeleted;

    return `
        <div class="bg-white p-4 rounded-lg shadow-sm flex flex-col">
            <div class="flex justify-between items-center mb-3 border-b pb-2">
                <h3 class="text-lg font-semibold text-slate-800">${getMessage('ui.summary.title')}</h3>
                ${summaryTimestamp ? `
                    <span class="text-xs text-slate-500 ml-auto mr-4" title="마지막 분석: ${formatDate(summaryTimestamp)}">
                        ${formatDateShort(summaryTimestamp)}
                    </span>
                ` : ''}
                <button onclick="generateSummaryEvent()" class="no-print flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed ${buttonClass}" ${isActionDisabled ? 'disabled' : ''}>
                    <i class="fas fa-magic-sparkles mr-2"></i> ${appState.isLoadingSummary ? getMessage('ui.summary.generating') : buttonText}
                </button>
            </div>
            <div class="flex-grow overflow-y-auto pr-2">
                ${appState.isLoadingSummary ? `
                    <div class="flex flex-col items-center justify-center h-full text-slate-500">
                        <div class="loading-spinner"></div>
                        <p class="mt-4">${getMessage('ui.summary.loading')}</p>
                    </div>
                ` : summary ? `
                    <div class="prose prose-sm max-w-none text-slate-700">
                        ${parseMarkdown(summary)}
                    </div>
                ` : `
                    <div class="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                        <i class="fas fa-lightbulb text-4xl mb-4 text-indigo-300"></i>
                        <p>${getMessage('ui.summary.emptyLine1')}</p>
                        <p>${getMessage('ui.summary.emptyLine2')}</p>
                        <p class="text-xs mt-2">${getMessage('ui.summary.emptyLine3')}</p>
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
                        <h3 class="text-lg leading-6 font-bold text-slate-900">${getMessage('ui.settings.title')}</h3>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="closeSettings()" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            ${getMessage('ui.settings.cancel')}
                        </button>
                        <button onclick="saveSettings()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            ${getMessage('ui.settings.save')}
                        </button>
                    </div>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700">${getMessage('ui.settings.appTitleLabel')}</label>
                                <input type="text" id="appTitle" value="${appState.settings.appTitle}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="${getMessage('ui.settings.appTitlePlaceholder')}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">${getMessage('ui.settings.classInfoLabel')}</label>
                                <input type="text" id="classInfo" value="${appState.settings.classInfo}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="${getMessage('ui.settings.classInfoPlaceholder')}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">${getMessage('ui.settings.teacherNameLabel')}</label>
                                <input type="text" id="teacherName" value="${appState.settings.teacherName}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="${getMessage('ui.settings.teacherNamePlaceholder')}">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700">${getMessage('ui.settings.languageLabel')}</label>
                                <select id="languageSelect" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="ko" ${getCurrentLanguage() === 'ko' ? 'selected' : ''}>${getMessage('ui.settings.languageKorean')}</option>
                                    <option value="en" ${getCurrentLanguage() === 'en' ? 'selected' : ''}>${getMessage('ui.settings.languageEnglish')}</option>
                                </select>
                                <p class="mt-2 text-xs text-slate-500">
                                    ${getMessage('ui.settings.languageNote')}
                                </p>
                            </div>
                            <div>
                                <div class="flex items-center justify-between mb-1">
                                    <label class="block text-sm font-medium text-slate-700">${getMessage('ui.settings.apiKeyLabel')}</label>
                                    <a onclick="openApiKeyGuide()" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer flex items-center" title="${getMessage('ui.settings.apiKeyHowTo')}">
                                        <i class="fas fa-question-circle mr-1"></i>
                                        ${getMessage('ui.settings.apiKeyHowTo')}
                                    </a>
                                </div>
                                <div class="flex gap-2">
                                    <input type="password" id="apiKey" value="${getApiKey() || ''}" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="${getMessage('ui.settings.apiKeyPlaceholder')}">
                                    <button onclick="toggleApiKeyVisibility()" class="mt-1 px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 flex-shrink-0" title="${getMessage('ui.tooltips.toggleVisibility')}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="deleteApiKey()" class="mt-1 px-3 py-2 border border-red-300 rounded-md bg-red-50 hover:bg-red-100 text-red-600 flex-shrink-0" title="${getMessage('ui.tooltips.deleteApiKey')}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <p class="mt-2 text-xs text-slate-500">
                                    ${getMessage('ui.settings.apiKeyNote')}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-200">
                            <h4 class="text-base font-bold text-slate-800 mb-2">${getMessage('ui.settings.promptTitle')}</h4>
                            <p class="text-xs text-slate-500 mb-3">
                                ${getMessage('ui.settings.promptDesc1')} <code class="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">prompt.js</code> ${getMessage('ui.settings.promptDesc2')}
                                <br>${getMessage('ui.settings.promptDesc3')}
                            </p>
                            <p class="text-sm text-slate-600 mb-3">
                                ${appState.settings.customPrompt ? 
                                    `<span class="text-blue-600"><i class="fas fa-check-circle mr-1"></i>${getMessage('ui.settings.promptCustom')}</span>` : 
                                    `<span class="text-green-600"><i class="fas fa-file-code mr-1"></i>${getMessage('ui.settings.promptDefault')}</span>`
                                }
                            </p>
                            <button onclick="openPromptEditor()" class="w-full inline-flex justify-center items-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <i class="fas fa-edit mr-2"></i> ${getMessage('ui.settings.editPrompt')}
                            </button>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-200">
                            <h4 class="text-base font-bold text-slate-800 mb-3">${getMessage('ui.settings.dataManagementTitle')}</h4>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="exportData()" class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-600 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                                    <i class="fas fa-file-export mr-2"></i> ${getMessage('ui.settings.exportData')}
                                </button>
                                <button onclick="showImportDialog()" class="w-full inline-flex justify-center items-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <i class="fas fa-file-import mr-2"></i> ${getMessage('ui.settings.importData')}
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
                            <h3 class="text-lg font-bold text-slate-900">${getMessage('ui.promptEditor.title')}</h3>
                            <p class="text-xs text-slate-500 mt-0.5">${getMessage('ui.promptEditor.variableNote')}</p>
                        </div>
                    </div>
                    <button onclick="closePromptEditor()" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="flex-grow overflow-y-auto p-6">
                    <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 class="text-sm font-semibold text-blue-800 mb-1">
                            <i class="fas fa-info-circle mr-1"></i> ${getMessage('ui.promptEditor.howToTitle')}
                        </h4>
                        <ul class="text-xs text-blue-700 space-y-1 ml-5 list-disc">
                            <li>${getMessage('ui.promptEditor.howToDefault')}</li>
                            <li>${getMessage('ui.promptEditor.howToCustom')}</li>
                            <li>${getMessage('ui.promptEditor.howToReset')}</li>
                        </ul>
                    </div>
                    <textarea id="promptEditorText" rows="18" class="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs resize-none" placeholder="${getMessage('ui.promptEditor.placeholder')}"></textarea>
                </div>
                
                <div class="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
                    <button onclick="loadDefaultPromptToPromptEditor()" class="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-undo mr-2"></i> ${getMessage('ui.promptEditor.resetButton')}
                    </button>
                    <div class="flex space-x-3">
                        <button onclick="closePromptEditor()" class="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            ${getMessage('ui.promptEditor.closeButton')}
                        </button>
                        <button onclick="savePromptFromEditor()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <i class="fas fa-save mr-2"></i> ${getMessage('ui.promptEditor.saveButton')}
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
                        <h3 class="text-lg font-bold text-slate-900">${getMessage('ui.studentModal.title')}</h3>
                        <button onclick="closeStudentModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="flex border-b border-gray-200">
                        <button onclick="setViewMode('active')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}">
                            ${getMessage('ui.studentModal.activeTab', { count: activeStudents.length })}
                        </button>
                        <button onclick="setViewMode('deleted')" class="flex-1 py-2 text-sm font-medium ${appState.viewMode === 'deleted' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}">
                            ${getMessage('ui.studentModal.deletedTab', { count: deletedStudents.length })}
                        </button>
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto p-4">
                    ${studentsToDisplay.length === 0 ? `
                        <div class="text-center text-slate-500 py-8">
                            ${appState.viewMode === 'active' ? 
                                `<p class="font-medium">${getMessage('ui.studentModal.noStudents')}</p><p class="text-sm mt-2">${getMessage('ui.studentModal.noStudentsDesc')}</p>` : 
                                `<p class="font-medium">${getMessage('ui.studentModal.noDeletedStudents')}</p>`
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
                            <i class="fas fa-plus mr-2"></i> ${getMessage('ui.studentModal.addStudent')}
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
                    <button onclick="addTargetStudent('${student.id}'); updateStudentModalContent();" class="mr-3 text-slate-400 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors flex-shrink-0" title="${getMessage('ui.tooltips.addToTarget', { name: student.name })}">
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
                    <button onclick="softDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-500 p-2" title="${getMessage('ui.buttons.delete')}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : `
                    <button onclick="restoreStudent('${student.id}')" class="text-slate-400 hover:text-green-600 p-2" title="${getMessage('ui.buttons.restore')}">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button onclick="permanentDeleteStudent('${student.id}')" class="text-slate-400 hover:text-red-600 p-2" title="${getMessage('ui.tooltips.permanentDelete')}">
                        <i class="fas fa-eraser"></i>
                    </button>
                `}
            </div>
        </li>
    `;
}

// API Key 안내 모달 렌더링
function renderApiKeyGuideModal() {
    return `
        <div id="apiKeyGuideModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100] p-4" style="display: none;">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <!-- 헤더 -->
                <div class="p-6 border-b border-slate-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold text-slate-900">
                            <i class="fas fa-key text-blue-600 mr-2"></i>
                            ${getMessage('ui.apiKeyGuide.title')}
                        </h3>
                        <button onclick="closeApiKeyGuide()" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <!-- 내용 -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="space-y-6">
                        <!-- Step 1 -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 mb-2">${getMessage('ui.apiKeyGuide.step1Title')}</h4>
                                <p class="text-sm text-slate-600 mb-2">
                                    ${getMessage('ui.apiKeyGuide.step1Desc')}
                                </p>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" 
                                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors">
                                    <i class="fas fa-external-link-alt mr-2"></i>
                                    ${getMessage('ui.apiKeyGuide.step1Button')}
                                </a>
                            </div>
                        </div>
                        
                        <!-- Step 2 -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 mb-2">${getMessage('ui.apiKeyGuide.step2Title')}</h4>
                                <p class="text-sm text-slate-600">
                                    ${getMessage('ui.apiKeyGuide.step2Desc')}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Step 3 -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 mb-2">${getMessage('ui.apiKeyGuide.step3Title')}</h4>
                                <p class="text-sm text-slate-600 mb-2">
                                    ${getMessage('ui.apiKeyGuide.step3Desc')}
                                </p>
                                <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                                    <i class="fas fa-lightbulb mr-1"></i>
                                    ${getMessage('ui.apiKeyGuide.step3Tip')}
                                    <ol>
                                        <li> ${getMessage('ui.apiKeyGuide.step3Tip1')}
                                        <li> ${getMessage('ui.apiKeyGuide.step3Tip2')}
                                        <li> ${getMessage('ui.apiKeyGuide.step3Tip3')}
                                        <li> ${getMessage('ui.apiKeyGuide.step3Tip4')}
                                    </ol>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 4 -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 mb-2">${getMessage('ui.apiKeyGuide.step4Title')}</h4>
                                <p class="text-sm text-slate-600 mb-2">${getMessage('ui.apiKeyGuide.step4Desc')}</p>
                                <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                                    <i class="fas fa-lightbulb mr-1"></i>
                                    ${getMessage('ui.apiKeyGuide.step3Tip')}
                                    <ol>
                                        <li> ${getMessage('ui.apiKeyGuide.step4Tip1')}
                                        <li> ${getMessage('ui.apiKeyGuide.step4Tip2')}
                                    </ol>
                                </div>
                                <div class="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                                    <i class="fas fa-exclamation-triangle mr-1"></i>
                                    ${getMessage('ui.apiKeyGuide.step4Warning')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Step 5 -->
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 mb-2">${getMessage('ui.apiKeyGuide.step5Title')}</h4>
                                <p class="text-sm text-slate-600 mb-3">
                                    ${getMessage('ui.apiKeyGuide.step5Desc')}
                                </p>
                                <div class="space-y-2">
                                    <input type="text" id="apiKeyGuideInput" 
                                           class="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                           placeholder="${getMessage('ui.apiKeyGuide.placeholder')}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="p-6 border-t border-slate-200 bg-slate-50">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-slate-600">
                            <i class="fas fa-info-circle mr-1"></i>
                            ${getMessage('ui.apiKeyGuide.freeQuota')}
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="closeApiKeyGuide()" 
                                    class="px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                ${getMessage('ui.apiKeyGuide.laterButton')}
                            </button>
                            <button onclick="saveApiKeyFromGuide()" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                <i class="fas fa-save mr-2"></i>
                                ${getMessage('ui.apiKeyGuide.saveButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 모달 렌더링
function renderModals() {
    return renderSettingsModal() + renderPromptEditorModal() + renderStudentModal() + renderApiKeyGuideModal();
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
        if (e.target.id === 'apiKeyGuideModal') {
            closeApiKeyGuide();
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
        showError(getMessage('apiKey.toggleError'));
    }
}

// 전역 window 객체에 명시적으로 할당
window.toggleApiKeyVisibility = toggleApiKeyVisibility;

// API 키 삭제
function deleteApiKey() {
    if (!getApiKey()) {
        showToast(getMessage('apiKey.noKeyToDelete'), 'info');
        return;
    }
    
    if (confirmAction(getMessage('apiKey.deleteConfirm'))) {
        // API 키 완전 삭제
        setApiKey(null);
        
        // 입력 필드도 비우기
        const apiKeyEl = document.getElementById('apiKey');
        if (apiKeyEl) {
            apiKeyEl.value = '';
        }
        
        showSuccess(getMessage('apiKey.deleted'));
    }
}

// 전역 window 객체에 명시적으로 할당
window.deleteApiKey = deleteApiKey;

// API Key 안내 모달 열기
function openApiKeyGuide() {
    // 모달이 없으면 추가
    const app = document.getElementById('app');
    const existingModal = document.getElementById('apiKeyGuideModal');
    
    if (!existingModal) {
        app.insertAdjacentHTML('beforeend', renderApiKeyGuideModal());
    }
    
    const modal = document.getElementById('apiKeyGuideModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 입력 필드에 포커스
        setTimeout(() => {
            const input = document.getElementById('apiKeyGuideInput');
            if (input) {
                input.focus();
            }
        }, 100);
    }
}

// API Key 안내 모달 닫기
function closeApiKeyGuide() {
    const modal = document.getElementById('apiKeyGuideModal');
    if (modal) {
        modal.style.display = 'none';
        
        // 입력 필드 초기화
        const input = document.getElementById('apiKeyGuideInput');
        if (input) {
            input.value = '';
        }
    }
}

// API Key 안내 모달에서 키 저장
function saveApiKeyFromGuide() {
    const input = document.getElementById('apiKeyGuideInput');
    if (!input) {
        showError(getMessage('apiKey.inputNotFound'));
        return;
    }
    
    const key = input.value.trim();
    
    if (!key) {
        showError(getMessage('apiKey.required'));
        input.focus();
        return;
    }
    
    // API 키 유효성 검사
    if (!validateApiKey(key)) {
        showError(getMessage('apiKey.invalidFormat'));
        input.focus();
        return;
    }
    
    // API 키 저장
    setApiKey(key);
    closeApiKeyGuide();
    showSuccess(getMessage('apiKey.saved'));
    
    // UI 업데이트 (헤더의 링크 숨기기 위해)
    renderApp();
}

// 전역 window 객체에 명시적으로 할당
window.openApiKeyGuide = openApiKeyGuide;
window.closeApiKeyGuide = closeApiKeyGuide;
window.saveApiKeyFromGuide = saveApiKeyFromGuide;

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
        const languageSelectEl = document.getElementById('languageSelect');
        
        if (!appTitleEl || !classInfoEl || !teacherNameEl || !apiKeyEl || !languageSelectEl) {
            showError(getMessage('settings.formNotFound'));
            return;
        }
        
        // 언어 변경 처리
        const selectedLanguage = languageSelectEl.value;
        if (selectedLanguage !== getCurrentLanguage()) {
            setLanguage(selectedLanguage);
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
        showSuccess(getMessage('settings.saved'));
    } catch (error) {
        console.error('설정 저장 중 오류:', error);
        showError(getMessage('settings.saveError') + ': ' + error.message);
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
            showError(getMessage('file.selectDialogError'));
        }
    } catch (error) {
        console.error('파일 가져오기 다이얼로그 표시 중 오류:', error);
        showError(getMessage('file.importDialogError'));
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
                showError(getMessage('file.readError') + ': ' + error.message);
            });
        }
        // 파일 입력 초기화
        event.target.value = '';
    } catch (error) {
        console.error('파일 가져오기 처리 중 오류:', error);
        showError(getMessage('file.importError'));
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
function openPromptEditor() {
    try {
        // 모달이 존재하지 않으면 생성
        ensurePromptEditorModalExists();
        
        const modal = document.getElementById('promptEditorModal');
        const textArea = document.getElementById('promptEditorText');
        
        if (!modal || !textArea) {
            showError(getMessage('prompt.notFound'));
            return;
        }
        
        // 현재 프롬프트 값 불러오기
        // 사용자 프롬프트가 없으면 prompt.js의 기본 프롬프트를 초안으로 사용
        let currentPrompt = appState.settings.customPrompt || getDefaultPromptTemplate();
        
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
        showError(getMessage('prompt.openError'));
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
        if (confirmAction(getMessage('prompt.closeConfirm'))) {
            modal.style.display = 'none';
            promptEditorState.isOpen = false;
        }
    } else {
        modal.style.display = 'none';
        promptEditorState.isOpen = false;
    }
}

// 프롬프트 초기화 (사용자 프롬프트 삭제)
function loadDefaultPromptToPromptEditor() {
    try {
        const textArea = document.getElementById('promptEditorText');
        if (!textArea) {
            showError(getMessage('prompt.notFound'));
            return;
        }
        
        if (confirmAction(getMessage('prompt.resetConfirm'))) {
            // prompt.js의 기본 프롬프트로 텍스트 영역 덮어쓰기
            const defaultPrompt = getDefaultPromptTemplate();
            textArea.value = defaultPrompt;
            
            // originalPrompt를 업데이트하여 변경사항으로 인식되도록
            promptEditorState.originalPrompt = appState.settings.customPrompt || '';
            
            showSuccess(getMessage('prompt.resetSuccess'));
            
            // 편집 상태 유지 - 모달을 닫지 않음
            // 사용자가 직접 저장하거나 취소할 수 있도록 함
        }
    } catch (error) {
        console.error('프롬프트 초기화 오류:', error);
        showError(getMessage('prompt.resetError') + ': ' + error.message);
    }
}

// 프롬프트 저장
function savePromptFromEditor() {
    try {
        const textArea = document.getElementById('promptEditorText');
        if (!textArea) {
            showError(getMessage('prompt.notFound'));
            return;
        }
        
        const newPrompt = textArea.value.trim();
        const hasChanges = newPrompt !== promptEditorState.originalPrompt;
        
        // 변경사항이 없으면 저장하지 않음
        if (!hasChanges) {
            showSuccess(getMessage('prompt.noChanges'));
            closePromptEditorWithoutConfirm();
            return;
        }
        
        // 빈 문자열로 저장하려는 경우 경고
        if (newPrompt === '') {
            showError(getMessage('prompt.emptyNotAllowed'));
            return;
        }
        
        // 변경사항이 있으면 저장 확인
        if (confirmAction(getMessage('prompt.saveConfirm'))) {
            // 설정 업데이트
            const newSettings = {
                ...appState.settings,
                customPrompt: newPrompt
            };
            
            updateSettings(newSettings);
            promptEditorState.originalPrompt = newPrompt;
            
            showSuccess(getMessage('prompt.saved'));
            
            closePromptEditorWithoutConfirm();
            
            // 앱 전체를 다시 렌더링하여 설정 모달의 상태도 업데이트
            renderApp();
        }
    } catch (error) {
        console.error('프롬프트 저장 중 오류:', error);
        showError(getMessage('prompt.saveError'));
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
