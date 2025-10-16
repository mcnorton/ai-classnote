# 기여 가이드 (Contributing Guide)

AI ClassNote 프로젝트에 기여해주셔서 감사합니다! 🎉

## 목차

- [행동 강령](#행동-강령)
- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [Pull Request 프로세스](#pull-request-프로세스)
- [코딩 스타일](#코딩-스타일)
- [커밋 메시지 가이드](#커밋-메시지-가이드)

## 행동 강령

이 프로젝트는 모든 기여자가 환영받고 존중받는 환경을 조성하기 위해 노력합니다. 참여함으로써 여러분은 이 강령을 준수할 것으로 기대됩니다.

- 다른 사람의 의견을 존중하세요
- 건설적인 피드백을 제공하세요
- 프로젝트와 커뮤니티의 최선의 이익에 집중하세요

## 기여 방법

### 버그 리포트

버그를 발견하셨나요? 다음 정보를 포함하여 Issue를 생성해주세요:

- **버그 설명**: 무엇이 잘못되었는지 명확하게 설명
- **재현 방법**: 버그를 재현하는 단계별 설명
- **예상 동작**: 어떻게 동작해야 하는지
- **실제 동작**: 실제로 어떻게 동작하는지
- **환경**: 브라우저 종류 및 버전, OS 정보
- **스크린샷**: 가능하다면 스크린샷 첨부

### 기능 제안

새로운 기능을 제안하고 싶으신가요?

1. 먼저 [Issue](https://github.com/YOUR_USERNAME/ai-classnote/issues)를 검색하여 중복 제안이 없는지 확인
2. 새 Issue를 생성하고 다음 내용을 포함:
   - 제안하는 기능의 설명
   - 이 기능이 필요한 이유
   - 가능하다면 구현 방법 제안

### 문서 개선

- 오타 수정
- 더 명확한 설명 추가
- 예제 코드 추가
- 번역 기여

## 개발 환경 설정

1. **저장소 Fork**
   ```bash
   # GitHub에서 Fork 버튼 클릭
   ```

2. **로컬에 클론**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-classnote.git
   cd ai-classnote
   ```

3. **원본 저장소를 upstream으로 추가**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ai-classnote.git
   ```

4. **브라우저에서 테스트**
   ```bash
   # index.html 파일을 브라우저에서 열기
   # 별도의 빌드 과정이 필요 없습니다!
   ```

## Pull Request 프로세스

1. **새 브랜치 생성**
   ```bash
   git checkout -b feature/your-feature-name
   # 또는
   git checkout -b fix/your-bug-fix
   ```

2. **변경사항 작성**
   - 코드를 작성하고 테스트하세요
   - 코딩 스타일 가이드를 따라주세요

3. **커밋**
   ```bash
   git add .
   git commit -m "타입: 간단한 설명"
   ```

4. **최신 코드와 동기화**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Pull Request 생성**
   - GitHub에서 Pull Request 생성
   - 변경사항을 명확하게 설명
   - 관련 Issue가 있다면 연결

7. **리뷰 대응**
   - 리뷰어의 피드백에 응답
   - 필요한 수정사항 반영

## 코딩 스타일

### JavaScript

```javascript
// 함수는 명확한 이름을 사용
function addStudent(name) {
    // 들여쓰기는 공백 4칸
    if (isEmpty(name)) {
        showError('학생 이름을 입력해주세요.');
        return null;
    }
    
    // const/let 사용 (var 사용 금지)
    const newStudent = {
        id: generateId(),
        name: name.trim(),
        isDeleted: false
    };
    
    return newStudent;
}

// 화살표 함수 사용 가능
const sortStudents = (students) => {
    return students.sort((a, b) => a.name.localeCompare(b.name));
};
```

### HTML/CSS

- 들여쓰기는 공백 4칸
- 속성은 큰따옴표 사용
- Tailwind CSS 클래스 우선 사용

### 주석

```javascript
// 단일 라인 주석은 이렇게

/**
 * 여러 줄 주석은 이렇게
 * 함수 설명, 파라미터, 반환값을 명시
 * 
 * @param {string} name - 학생 이름
 * @returns {Object|null} 생성된 학생 객체 또는 null
 */
function addStudent(name) {
    // ...
}
```

## 커밋 메시지 가이드

커밋 메시지는 다음 형식을 따라주세요:

```
타입: 간단한 설명 (50자 이내)

상세한 설명 (선택사항, 72자마다 줄바꿈)

연관된 Issue: #123
```

### 타입

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 추가 등 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스, 도구 설정 등

### 예시

```
feat: 학생 이름 인라인 편집 기능 추가

더블클릭 또는 F2 키로 학생 이름을 즉시 수정할 수 있는
인라인 편집 기능을 추가했습니다.

관련 Issue: #45
```

## 테스트

새로운 기능을 추가하거나 버그를 수정할 때는 다음을 확인해주세요:

- [ ] 브라우저에서 정상 동작 확인
- [ ] 다양한 브라우저에서 테스트 (Chrome, Firefox, Safari, Edge)
- [ ] 모바일 환경에서 테스트
- [ ] 기존 기능이 여전히 작동하는지 확인
- [ ] 콘솔에 오류가 없는지 확인

## 질문이 있으신가요?

- [GitHub Discussions](https://github.com/YOUR_USERNAME/ai-classnote/discussions)에서 질문하기
- [Issue](https://github.com/YOUR_USERNAME/ai-classnote/issues)로 문의하기

---

다시 한번 기여해주셔서 감사합니다! 🙏

