// 메시지 및 다국어 지원 시스템

// 현재 언어 설정
let currentLanguage = 'ko';

// 메시지 상수 정의
const MESSAGES = {
    ko: {
        // 일반 메시지
        welcome: '환영합니다! 학생을 추가하여 관찰 기록을 시작하세요.',
        
        // 데이터 관리
        data: {
            loadError: '저장된 데이터를 불러오는데 실패했습니다.',
            saveError: '데이터 저장에 실패했습니다.',
            exportSuccess: '데이터가 내보내기되었습니다.',
            exportError: '데이터 내보내기에 실패했습니다',
            importSuccess: '데이터가 성공적으로 가져와졌습니다.',
            importError: '데이터 가져오기에 실패했습니다',
            importInvalidFormat: '유효하지 않은 데이터 형식입니다. 올바른 백업 파일인지 확인해주세요.',
            importCancelled: '데이터 가져오기가 취소되었습니다.',
            importConfirm: '데이터를 가져오면 현재 데이터가 모두 덮어써집니다.\n계속하시겠습니까?\n\n현재 데이터:\n- 학생 수: {studentCount}명\n- 관찰 기록 수: {observationCount}개',
            versionWarning: '이 데이터는 버전 {version}에서 생성되었습니다. 현재 버전(3.0.0)과 호환되지 않을 수 있습니다. 계속하시겠습니까?',
            resetConfirm: '모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            resetSuccess: '모든 데이터가 초기화되었습니다.',
            backupRestored: '백업에서 복원되었습니다.',
        },
        
        // 학생 관리
        student: {
            nameRequired: '학생 이름을 입력해주세요.',
            added: '{name} 학생이 추가되었습니다.',
            softDeleted: '{name} 학생이 삭제 목록으로 이동되었습니다.',
            restored: '{name} 학생이 복원되었습니다.',
            permanentDeleted: '{name} 학생이 영구 삭제되었습니다.',
            nameChanged: '{oldName} 학생의 이름이 {newName}으로 변경되었습니다.',
            nameEmpty: '학생 이름은 비어있을 수 없습니다.',
            selectStudent: '학생을 선택해주세요.',
            softDeleteConfirm: '정말로 {name} 학생을 삭제 목록으로 옮기시겠습니까?',
            permanentDeleteConfirm: '정말로 {name} 학생을 영구적으로 삭제하시겠습니까?\n모든 관찰 기록이 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.',
            nameChangeConfirm: '{oldName}의 이름을 {newName}(으)로 변경하시겠습니까?',
        },
        
        // 관찰 기록
        observation: {
            contentRequired: '관찰 내용을 입력해주세요.',
            targetRequired: '관찰 대상 학생을 선택해주세요.',
            bothRequired: '관찰 내용과 대상 학생을 확인해주세요.',
            noRecords: '관찰 기록이 없습니다. 먼저 관찰 기록을 추가해주세요.',
            added: '관찰 기록이 추가되었습니다.',
            updated: '관찰 기록이 수정되었습니다.',
            deleted: '관찰 기록이 삭제되었습니다.',
            deleteConfirm: '이 관찰 기록을 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없습니다.',
            notFound: '관찰 기록을 찾을 수 없습니다.',
            studentDataNotFound: '학생 데이터를 찾을 수 없습니다.',
            formNotFound: '관찰 기록 폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.',
            contentEmpty: '관찰 내용은 비어있을 수 없습니다.',
            addError: '관찰 기록 추가 중 오류가 발생했습니다.',
            editStartError: '관찰 기록 수정 시작 중 오류가 발생했습니다.',
            saveError: '관찰 기록 저장 중 오류가 발생했습니다.',
            deleteError: '관찰 기록 삭제 중 오류가 발생했습니다.',
        },
        
        // AI 요약
        summary: {
            generated: 'AI 요약이 생성되었습니다.',
            cancelled: 'AI 분석이 취소되었습니다.',
            error: '요약 생성 중 오류가 발생했습니다',
            cancelConfirm: 'AI 분석이 진행 중입니다.\n{action}\n계속하시겠습니까?',
            actions: {
                selectStudent: '다른 학생을 선택하면 분석이 중단됩니다.',
                addStudent: '학생을 추가하면 분석이 중단됩니다.',
                removeStudent: '학생을 제거하면 분석이 중단됩니다.',
                changeViewMode: '뷰 모드를 변경하면 분석이 중단됩니다.',
            }
        },
        
        // 설정
        settings: {
            saved: '설정이 저장되었습니다.',
            formNotFound: '설정 폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.',
            saveError: '설정 저장 중 오류가 발생했습니다',
        },
        
        // API Key
        apiKey: {
            saved: 'API Key가 저장되었습니다. 이제 AI 분석을 사용할 수 있습니다!',
            deleted: 'API 키가 삭제되었습니다.',
            deleteConfirm: '저장된 API 키를 삭제하시겠습니까?\n삭제 후 다시 사용하려면 API 키를 재입력해야 합니다.',
            noKeyToDelete: '삭제할 API 키가 없습니다.',
            required: 'API Key를 입력해주세요.',
            invalidFormat: '올바른 API Key 형식이 아닙니다. API Key는 보통 "AI"로 시작하는 30자 이상의 문자열입니다.',
            inputNotFound: '입력 필드를 찾을 수 없습니다.',
            toggleError: 'API 키 표시/숨김 전환 중 오류가 발생했습니다.',
            testError: 'API 연결 테스트 중 오류가 발생했습니다',
        },
        
        // 프롬프트 편집기
        prompt: {
            notFound: '프롬프트 편집기를 찾을 수 없습니다.',
            openError: '프롬프트 편집기를 여는 중 오류가 발생했습니다.',
            saved: '프롬프트가 저장되었습니다.',
            saveConfirm: '프롬프트를 저장하시겠습니까?',
            saveError: '프롬프트 저장 중 오류가 발생했습니다.',
            noChanges: '변경사항이 없습니다.',
            closeConfirm: '저장하지 않은 변경사항이 있습니다.\n닫으시겠습니까?',
            resetConfirm: '편집기를 기본 프롬프트로 초기화하시겠습니까?\n현재 편집 중인 내용은 사라지며, 저장은 직접 하셔야 합니다.',
            resetSuccess: '편집기가 기본 프롬프트로 초기화되었습니다. 저장 버튼을 눌러 적용하세요.',
            resetError: '프롬프트 초기화 중 오류가 발생했습니다',
            emptyNotAllowed: '프롬프트를 비울 수 없습니다. 기본 프롬프트를 사용하려면 "초기값으로" 버튼을 사용하세요.',
        },
        
        // 파일 관리
        file: {
            selectDialogError: '파일 선택 대화상자를 열 수 없습니다.',
            importDialogError: '파일 가져오기 다이얼로그 표시 중 오류가 발생했습니다.',
            importError: '파일 가져오기 처리 중 오류가 발생했습니다.',
            readError: '파일을 읽는 중 오류가 발생했습니다',
            jsonOnly: 'JSON 파일만 가져올 수 있습니다.',
        },
        
        // 네트워크
        network: {
            online: '인터넷 연결이 복구되었습니다.',
            offline: '인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.',
            unexpectedError: '예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.',
            networkError: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
        },
        
        // UI 요소
        ui: {
            sidebar: {
                title: '학생 관리',
                activeStudents: '현재 학생 ({count})',
                deletedStudents: '삭제된 학생 ({count})',
                noStudents: '학생이 없습니다',
                noStudentsDesc: '아래 버튼을 눌러 첫 번째 학생을 추가하세요.',
                noDeletedStudents: '삭제된 학생이 없습니다',
                noDeletedStudentsDesc: '현재 학생 목록에서 학생을 삭제하면 여기에 표시됩니다.',
                addStudent: '학생 추가하기',
                deletedStudentsManagement: '삭제된 학생 관리',
                deletedStudentsManageDesc: '복원하거나 영구 삭제할 수 있습니다'
            },
            welcome: {
                title: '시작하기',
                description: '왼쪽 메뉴에서 학생을 추가하거나 선택하여 관찰 기록을 시작하세요.',
                howToUseTitle: '사용법',
                step1: '"학생 추가하기" 버튼으로 학생을 등록하세요',
                step2: '학생을 선택하여 관찰 기록을 작성하세요',
                step3: '"AI 요약 생성" 버튼으로 종합 분석을 받으세요',
                step4: '설정에서 API 키를 입력하세요'
            },
            deletedStudents: {
                title: '삭제된 학생이 없습니다',
                description: '현재 학생 목록에서 학생을 삭제하면 여기에 표시됩니다.',
                managementTitle: '삭제된 학생 관리',
                point1: '삭제된 학생은 복원하거나 영구 삭제할 수 있습니다',
                point2: '복원된 학생은 현재 학생 목록으로 이동됩니다',
                point3: '영구 삭제된 학생은 복구할 수 없습니다',
                point4: '삭제된 학생의 관찰 기록은 조회만 가능합니다',
                backToActive: '현재 학생 목록으로'
            },
            deletedWarning: {
                title: '삭제된 학생',
                description: '이 학생의 기록은 현재 조회만 가능합니다.',
                restoreButton: '복원하기'
            },
            observation: {
                formTitle: '{name} 관찰 기록 추가',
                targetStudents: '관찰 대상 학생',
                placeholder: '학생의 구체적인 행동이나 발언을 기록하세요. 예: (국어) 수업 중 적극적으로 발표함.',
                placeholderDeleted: '삭제된 학생의 기록은 추가할 수 없습니다.',
                addButton: '기록하기',
                panelTitle: '누가 기록',
                noRecordsDisplay: '기록된 관찰 내용이 없습니다.',
                editButton: '수정',
                saveButton: '저장',
                deleteButton: '삭제'
            },
            summary: {
                title: 'AI 요약 및 분석',
                generateButton: '요약 생성',
                updateButton: '업데이트',
                regenerateButton: '다시분석',
                generating: '생성 중...',
                loading: 'AI가 관찰 기록을 분석하고 있습니다...',
                emptyLine1: '관찰 기록을 바탕으로 AI가',
                emptyLine2: '학생의 종합적인 분석을 제공합니다.',
                emptyLine3: '(기록이 3개 이상일 때 가장 효과적입니다.)'
            },
            settings: {
                title: '앱 설정',
                cancel: '취소',
                save: '저장',
                appTitleLabel: '앱 타이틀',
                appTitlePlaceholder: '예: AI ClassNote',
                classInfoLabel: '학급 정보',
                classInfoPlaceholder: '예: OO초등학교 1학년 2반',
                teacherNameLabel: '교사 정보',
                teacherNamePlaceholder: '예: 담임교사 홍길동',
                languageLabel: '언어 / Language',
                languageKorean: '한국어 (Korean)',
                languageEnglish: 'English',
                languageNote: '💡 언어 변경 시 앱의 모든 메시지가 선택한 언어로 표시됩니다.',
                apiKeyLabel: 'Gemini API 키',
                apiKeyHowTo: '받는 방법',
                apiKeyPlaceholder: 'API 키를 입력하세요',
                apiKeyNote: '💡 API 키는 브라우저에 저장됩니다. 공용 컴퓨터에서는 사용 후 [삭제] 버튼을 눌러주세요.',
                promptTitle: 'AI 요약 프롬프트',
                promptDesc1: '프롬프트는',
                promptDesc2: '파일에서 관리됩니다.',
                promptDesc3: '직접 파일을 수정하거나 아래 버튼으로 편집할 수 있습니다.',
                promptCustom: '사용자 커스텀 프롬프트 사용 중',
                promptDefault: '기본 프롬프트 (prompt.js) 사용 중',
                editPrompt: '프롬프트 편집하기',
                dataManagementTitle: '데이터 관리',
                exportData: '데이터 내보내기',
                importData: '데이터 가져오기'
            },
            promptEditor: {
                title: 'AI 요약 프롬프트 편집',
                variableNote: '{{STUDENT_NAME}}, {{OBSERVATIONS}} 변수를 사용할 수 있습니다.',
                howToTitle: '프롬프트 관리 방법',
                howToDefault: '<strong>기본 사용:</strong> <code class="px-1 py-0.5 bg-blue-100 rounded">prompt.js</code> 파일의 기본 프롬프트가 자동으로 로드됩니다',
                howToCustom: '<strong>커스텀 프롬프트:</strong> 여기서 수정하고 저장하면 사용자 커스텀 프롬프트로 적용됩니다',
                howToReset: '<strong>초기화:</strong> \'초기값으로\' 버튼을 누르면 편집기가 기본 프롬프트로 초기화됩니다 (저장 필요)',
                placeholder: '사용자 정의 프롬프트를 입력하세요...',
                resetButton: '초기값으로',
                closeButton: '닫기',
                saveButton: '저장'
            },
            studentModal: {
                title: '학생 관리',
                activeTab: '현재 학생 ({count})',
                deletedTab: '삭제된 학생 ({count})',
                noStudents: '학생이 없습니다',
                noStudentsDesc: '아래 버튼을 눌러 첫 번째 학생을 추가하세요.',
                noDeletedStudents: '삭제된 학생이 없습니다',
                addStudent: '학생 추가하기'
            },
            apiKeyGuide: {
                title: 'Gemini API Key 받는 방법',
                step1Title: 'Google AI Studio 접속',
                step1Desc: '아래 링크를 클릭하여 Google AI Studio에 접속하세요.',
                step1Button: 'AI Studio 열기',
                step2Title: 'Google 계정으로 로그인',
                step2Desc: 'Google 계정으로 로그인하세요. 계정이 없다면 새로 만들 수 있습니다.',
                step3Title: 'API Key 생성',
                step3Desc: '왼쪽 아래 "Get API Key" 메뉴의 "API 키 만들기" 버튼을 클릭하세요.',
                step3Tip: '<strong>팁:</strong>',
                step3Tip1: '1. 키 이름 : \'ai-classnote\' 입력',
                step3Tip2: '2. 가져온 프로젝트 : +Create a New Project 선택',
                step3Tip3: '3. 프로젝트 이름: \'ai-classnote\' 입력',
                step3Tip4: '4. 키 생성 : [키 만들기] 버튼 클릭',
                step4Title: 'API Key 복사',
                step4Desc: '생성된 API Key를 복사하세요. (보통 "AI"로 시작하는 긴 문자열입니다)',
                step4Tip1: '1. 생성된 키 목록의 프로젝트 이름 \'ai-classnote\' 를 확인하세요.',
                step4Tip2: '2. 오른쪽 \'Copy API Key\' 버튼을 클릭하여 복사하세요.',
                step4Warning: '<strong>주의:</strong> API Key는 안전하게 보관하세요. 다른 사람과 공유하지 마세요!',
                step5Title: '아래에 API Key 입력',
                step5Desc: '복사한 API Key를 아래 입력란에 붙여넣고 저장하세요.',
                placeholder: 'AIza... 로 시작하는 API Key를 입력하세요',
                freeQuota: '무료 할당량: 월 15 RPM (분당 요청 수)',
                laterButton: '나중에',
                saveButton: '저장하고 시작하기'
            },
            buttons: {
                close: '닫기',
                save: '저장',
                cancel: '취소',
                reset: '초기값으로',
                later: '나중에',
                saveAndStart: '저장하고 시작하기',
                delete: '삭제',
                restore: '복원',
                edit: '수정'
            },
            tooltips: {
                doubleClickToEdit: '더블클릭하여 이름 수정',
                moveToDeleted: '삭제 목록으로 이동',
                restore: '복원하기',
                permanentDelete: '영구 삭제',
                toggleVisibility: '표시/숨김',
                deleteApiKey: 'API 키 삭제',
                addToTarget: '{name}님을 관찰 대상에 추가',
                removeFromTarget: '{name}님을 대상에서 제외'
            }
        }
    },
    
    en: {
        // 일반 메시지
        welcome: 'Welcome! Add students to start recording observations.',
        
        // 데이터 관리
        data: {
            loadError: 'Failed to load saved data.',
            saveError: 'Failed to save data.',
            exportSuccess: 'Data has been exported.',
            exportError: 'Failed to export data',
            importSuccess: 'Data has been imported successfully.',
            importError: 'Failed to import data',
            importInvalidFormat: 'Invalid data format. Please check if the backup file is correct.',
            importCancelled: 'Data import has been cancelled.',
            importConfirm: 'Importing data will overwrite all current data.\nContinue?\n\nCurrent data:\n- Students: {studentCount}\n- Observations: {observationCount}',
            versionWarning: 'This data was created in version {version}. It may not be compatible with current version (3.0.0). Continue?',
            resetConfirm: 'Delete all data? This action cannot be undone.',
            resetSuccess: 'All data has been reset.',
            backupRestored: 'Restored from backup.',
        },
        
        // 학생 관리
        student: {
            nameRequired: 'Please enter student name.',
            added: 'Student {name} has been added.',
            softDeleted: 'Student {name} has been moved to deleted list.',
            restored: 'Student {name} has been restored.',
            permanentDeleted: 'Student {name} has been permanently deleted.',
            nameChanged: 'Student name changed from {oldName} to {newName}.',
            nameEmpty: 'Student name cannot be empty.',
            selectStudent: 'Please select a student.',
            softDeleteConfirm: 'Are you sure you want to move {name} to the deleted list?',
            permanentDeleteConfirm: 'Are you sure you want to permanently delete {name}?\nAll observation records will be deleted. This action cannot be undone.',
            nameChangeConfirm: 'Change student name from {oldName} to {newName}?',
        },
        
        // 관찰 기록
        observation: {
            contentRequired: 'Please enter observation content.',
            targetRequired: 'Please select target student.',
            bothRequired: 'Please check observation content and target student.',
            noRecords: 'No observation records. Please add observation records first.',
            added: 'Observation record has been added.',
            updated: 'Observation record has been updated.',
            deleted: 'Observation record has been deleted.',
            deleteConfirm: 'Delete this observation record?\nDeleted records cannot be recovered.',
            notFound: 'Observation record not found.',
            studentDataNotFound: 'Student data not found.',
            formNotFound: 'Observation form not found. Please refresh the page.',
            contentEmpty: 'Observation content cannot be empty.',
            addError: 'An error occurred while adding observation record.',
            editStartError: 'An error occurred while starting to edit observation record.',
            saveError: 'An error occurred while saving observation record.',
            deleteError: 'An error occurred while deleting observation record.',
        },
        
        // AI 요약
        summary: {
            generated: 'AI summary has been generated.',
            cancelled: 'AI analysis has been cancelled.',
            error: 'An error occurred while generating summary',
            cancelConfirm: 'AI analysis is in progress.\n{action}\nContinue?',
            actions: {
                selectStudent: 'Selecting another student will stop the analysis.',
                addStudent: 'Adding a student will stop the analysis.',
                removeStudent: 'Removing a student will stop the analysis.',
                changeViewMode: 'Changing view mode will stop the analysis.',
            }
        },
        
        // 설정
        settings: {
            saved: 'Settings have been saved.',
            formNotFound: 'Settings form not found. Please refresh the page.',
            saveError: 'An error occurred while saving settings',
        },
        
        // API Key
        apiKey: {
            saved: 'API Key has been saved. You can now use AI analysis!',
            deleted: 'API key has been deleted.',
            deleteConfirm: 'Delete saved API key?\nYou will need to re-enter the API key to use it again.',
            noKeyToDelete: 'No API key to delete.',
            required: 'Please enter API Key.',
            invalidFormat: 'Invalid API Key format. API Key usually starts with "AI" and is 30+ characters long.',
            inputNotFound: 'Input field not found.',
            toggleError: 'An error occurred while toggling API key visibility.',
            testError: 'An error occurred while testing API connection',
        },
        
        // 프롬프트 편집기
        prompt: {
            notFound: 'Prompt editor not found.',
            openError: 'An error occurred while opening prompt editor.',
            saved: 'Prompt has been saved.',
            saveConfirm: 'Save prompt?',
            saveError: 'An error occurred while saving prompt.',
            noChanges: 'No changes to save.',
            closeConfirm: 'You have unsaved changes.\nClose anyway?',
            resetConfirm: 'Reset editor to default prompt?\nCurrent content will be lost, and you need to save manually.',
            resetSuccess: 'Editor has been reset to default prompt. Click save button to apply.',
            resetError: 'An error occurred while resetting prompt',
            emptyNotAllowed: 'Prompt cannot be empty. Use "Reset to default" button to use default prompt.',
        },
        
        // 파일 관리
        file: {
            selectDialogError: 'Cannot open file selection dialog.',
            importDialogError: 'An error occurred while showing import dialog.',
            importError: 'An error occurred while importing file.',
            readError: 'An error occurred while reading file',
            jsonOnly: 'Only JSON files can be imported.',
        },
        
        // 네트워크
        network: {
            online: 'Internet connection restored.',
            offline: 'Internet connection lost. Some features may be limited.',
            unexpectedError: 'An unexpected error occurred. Please refresh the page.',
            networkError: 'Network error occurred. Please check your internet connection.',
        },
        
        // UI 요소
        ui: {
            sidebar: {
                title: 'Student Management',
                activeStudents: 'Current Students ({count})',
                deletedStudents: 'Deleted Students ({count})',
                noStudents: 'No students',
                noStudentsDesc: 'Click the button below to add your first student.',
                noDeletedStudents: 'No deleted students',
                noDeletedStudentsDesc: 'Students deleted from the current list will appear here.',
                addStudent: 'Add Student',
                deletedStudentsManagement: 'Deleted Students Management',
                deletedStudentsManageDesc: 'You can restore or permanently delete them'
            },
            welcome: {
                title: 'Getting Started',
                description: 'Add or select students from the left menu to start recording observations.',
                howToUseTitle: 'How to Use',
                step1: 'Register students using the "Add Student" button',
                step2: 'Select a student to write observation records',
                step3: 'Get comprehensive analysis using the "Generate AI Summary" button',
                step4: 'Enter your API key in settings'
            },
            deletedStudents: {
                title: 'No deleted students',
                description: 'Students deleted from the current list will appear here.',
                managementTitle: 'Deleted Students Management',
                point1: 'Deleted students can be restored or permanently deleted',
                point2: 'Restored students will be moved to the current student list',
                point3: 'Permanently deleted students cannot be recovered',
                point4: 'Observation records of deleted students can only be viewed',
                backToActive: 'Back to Current Students'
            },
            deletedWarning: {
                title: 'Deleted Student',
                description: 'This student\'s records are currently view-only.',
                restoreButton: 'Restore'
            },
            observation: {
                formTitle: 'Add Observation Record for {name}',
                targetStudents: 'Target Students',
                placeholder: 'Record specific behaviors or statements of the student. Example: (Korean) Actively participated in class discussions.',
                placeholderDeleted: 'Cannot add records for deleted students.',
                addButton: 'Record',
                panelTitle: 'Observation Records',
                noRecordsDisplay: 'No observation records.',
                editButton: 'Edit',
                saveButton: 'Save',
                deleteButton: 'Delete'
            },
            summary: {
                title: 'AI Summary & Analysis',
                generateButton: 'Generate Summary',
                updateButton: 'Update',
                regenerateButton: 'Regenerate',
                generating: 'Generating...',
                loading: 'AI is analyzing observation records...',
                emptyLine1: 'AI provides comprehensive analysis',
                emptyLine2: 'of students based on observation records.',
                emptyLine3: '(Most effective with 3 or more records.)'
            },
            settings: {
                title: 'App Settings',
                cancel: 'Cancel',
                save: 'Save',
                appTitleLabel: 'App Title',
                appTitlePlaceholder: 'e.g., AI ClassNote',
                classInfoLabel: 'Class Information',
                classInfoPlaceholder: 'e.g., ABC Elementary School Grade 1 Class 2',
                teacherNameLabel: 'Teacher Information',
                teacherNamePlaceholder: 'e.g., Homeroom Teacher John Doe',
                languageLabel: 'Language / 언어',
                languageKorean: '한국어 (Korean)',
                languageEnglish: 'English',
                languageNote: '💡 All messages in the app will be displayed in the selected language.',
                apiKeyLabel: 'Gemini API Key',
                apiKeyHowTo: 'How to Get',
                apiKeyPlaceholder: 'Enter your API key',
                apiKeyNote: '💡 The API key is stored in your browser. On shared computers, use the [Delete] button after use.',
                promptTitle: 'AI Summary Prompt',
                promptDesc1: 'Prompts are managed in the',
                promptDesc2: 'file.',
                promptDesc3: 'You can edit the file directly or use the button below.',
                promptCustom: 'Using custom user prompt',
                promptDefault: 'Using default prompt (prompt.js)',
                editPrompt: 'Edit Prompt',
                dataManagementTitle: 'Data Management',
                exportData: 'Export Data',
                importData: 'Import Data'
            },
            promptEditor: {
                title: 'Edit AI Summary Prompt',
                variableNote: 'You can use {{STUDENT_NAME}} and {{OBSERVATIONS}} variables.',
                howToTitle: 'How to Manage Prompts',
                howToDefault: '<strong>Default:</strong> Default prompt from <code class="px-1 py-0.5 bg-blue-100 rounded">prompt.js</code> file is automatically loaded',
                howToCustom: '<strong>Custom Prompt:</strong> Editing and saving here will apply your custom prompt',
                howToReset: '<strong>Reset:</strong> Clicking \'Reset to Default\' will reset the editor to the default prompt (requires saving)',
                placeholder: 'Enter your custom prompt...',
                resetButton: 'Reset to Default',
                closeButton: 'Close',
                saveButton: 'Save'
            },
            studentModal: {
                title: 'Student Management',
                activeTab: 'Current Students ({count})',
                deletedTab: 'Deleted Students ({count})',
                noStudents: 'No students',
                noStudentsDesc: 'Click the button below to add your first student.',
                noDeletedStudents: 'No deleted students',
                addStudent: 'Add Student'
            },
            apiKeyGuide: {
                title: 'How to Get Gemini API Key',
                step1Title: 'Access Google AI Studio',
                step1Desc: 'Click the link below to access Google AI Studio.',
                step1Button: 'Open AI Studio',
                step2Title: 'Sign in with Google Account',
                step2Desc: 'Sign in with your Google account. You can create one if you don\'t have an account.',
                step3Title: 'Generate API Key',
                step3Desc: 'Click the "Create API Key" button in the "Get API Key" menu at the bottom left.',
                step3Tip: '<strong>Tip:</strong>',
                step3Tip1: '1. Key name: Enter \'ai-classnote\'',
                step3Tip2: '2. Import project: Select +Create a New Project',
                step3Tip3: '3. Project name: Enter \'ai-classnote\'',
                step3Tip4: '4. Generate key: Click [Create Key] button',
                step4Title: 'Copy API Key',
                step4Desc: 'Copy the generated API Key. (Usually a long string starting with "AI")',
                step4Tip1: '1. Verify the project name \'ai-classnote\' in the generated key list.',
                step4Tip2: '2. Click the \'Copy API Key\' button on the right to copy.',
                step4Warning: '<strong>Warning:</strong> Keep your API Key safe. Do not share it with others!',
                step5Title: 'Enter API Key Below',
                step5Desc: 'Paste the copied API Key in the input field below and save.',
                placeholder: 'Enter API Key starting with AIza...',
                freeQuota: 'Free quota: 15 RPM per month (Requests Per Minute)',
                laterButton: 'Later',
                saveButton: 'Save and Start'
            },
            buttons: {
                close: 'Close',
                save: 'Save',
                cancel: 'Cancel',
                reset: 'Reset to Default',
                later: 'Later',
                saveAndStart: 'Save and Start',
                delete: 'Delete',
                restore: 'Restore',
                edit: 'Edit'
            },
            tooltips: {
                doubleClickToEdit: 'Double-click to edit name',
                moveToDeleted: 'Move to deleted list',
                restore: 'Restore',
                permanentDelete: 'Permanent delete',
                toggleVisibility: 'Toggle visibility',
                deleteApiKey: 'Delete API key',
                addToTarget: 'Add {name} to observation targets',
                removeFromTarget: 'Remove {name} from targets'
            }
        }
    }
};

// 메시지 가져오기 함수 (변수 치환 지원)
function getMessage(key, replacements = {}) {
    const keys = key.split('.');
    let message = MESSAGES[currentLanguage];
    
    for (const k of keys) {
        if (message && typeof message === 'object') {
            message = message[k];
        } else {
            console.warn(`Message key not found: ${key}`);
            return key;
        }
    }
    
    // 변수 치환 ({name}, {count} 등)
    if (typeof message === 'string' && Object.keys(replacements).length > 0) {
        Object.keys(replacements).forEach(key => {
            message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
        });
    }
    
    return message || key;
}

// 언어 변경 함수
function setLanguage(lang) {
    if (MESSAGES[lang]) {
        currentLanguage = lang;
        localStorage.setItem('app-language', lang);
        // 언어 변경 시 앱 전체 재렌더링
        if (typeof renderApp === 'function') {
            renderApp();
        }
        return true;
    }
    return false;
}

// 현재 언어 가져오기
function getCurrentLanguage() {
    return currentLanguage;
}

// 저장된 언어 불러오기
function loadLanguage() {
    const saved = localStorage.getItem('app-language');
    if (saved && MESSAGES[saved]) {
        currentLanguage = saved;
    }
}

// 전역 함수 등록
window.getMessage = getMessage;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.loadLanguage = loadLanguage;
window.MESSAGES = MESSAGES;

// 앱 시작 시 언어 로드
loadLanguage();

console.log('Messages module loaded. Current language:', currentLanguage);

