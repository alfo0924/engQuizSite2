document.addEventListener('DOMContentLoaded', function() {
    // 測驗問題和答案
    const quizQuestions = [
        {
            question: "The report _____ by the committee last week.",
            options: ["was approved", "approved", "has approved", "approving"],
            answer: 0,
            explanation: "被動語態需要使用「be + 過去分詞」的形式。因為是過去發生的事，所以使用 'was approved'。",
            category: "動詞時態",
            difficulty: "easy"
        },
        {
            question: "If I _____ rich, I would travel around the world.",
            options: ["am", "was", "were", "had been"],
            answer: 2,
            explanation: "在虛擬條件句中，表達與現在事實相反的假設時，需使用 'were' 而非 'was'。",
            category: "條件句",
            difficulty: "medium"
        },
        {
            question: "She _____ in this company for five years now.",
            options: ["works", "is working", "has been working", "worked"],
            answer: 2,
            explanation: "表達從過去開始持續到現在的動作，應使用現在完成進行式 'has been working'。",
            category: "動詞時態",
            difficulty: "medium"
        },
        {
            question: "_____ the exam, he went out to celebrate with his friends.",
            options: ["Having passed", "Passed", "To pass", "Pass"],
            answer: 0,
            explanation: "表達在主要動作之前完成的動作，可使用現在分詞的完成式 'Having passed'。",
            category: "分詞",
            difficulty: "hard"
        },
        {
            question: "The movie was _____ boring that we left before it ended.",
            options: ["such", "so", "very", "too"],
            answer: 1,
            explanation: "修飾形容詞時，應使用 'so' 而非 'such'。'Such' 用於修飾名詞。",
            category: "修飾語",
            difficulty: "easy"
        },
        {
            question: "Neither John nor his friends _____ going to the party.",
            options: ["is", "are", "was", "were"],
            answer: 1,
            explanation: "當主詞為 'Neither...nor...' 結構時，動詞應與較接近的主詞一致。此處 'his friends' 是複數，所以用 'are'。",
            category: "主謂一致",
            difficulty: "medium"
        },
        {
            question: "The number of students in the class _____ increased this year.",
            options: ["have", "has", "are", "is"],
            answer: 1,
            explanation: "'The number of' 視為單數，因此應使用單數動詞 'has'。",
            category: "主謂一致",
            difficulty: "medium"
        },
        {
            question: "I wish I _____ able to speak French fluently.",
            options: ["am", "was", "were", "had been"],
            answer: 2,
            explanation: "在 'wish' 後面接的子句，表達與現在事實相反的願望時，應使用 'were'。",
            category: "虛擬語氣",
            difficulty: "medium"
        },
        {
            question: "She denied _____ the document without permission.",
            options: ["to access", "accessing", "accessed", "access"],
            answer: 1,
            explanation: "某些動詞（如 deny）後接動名詞，而非不定式。",
            category: "動名詞與不定式",
            difficulty: "medium"
        },
        {
            question: "It's high time we _____ home.",
            options: ["go", "went", "gone", "going"],
            answer: 1,
            explanation: "'It's high time' 後面應接過去式，表示現在該做的事情。",
            category: "慣用語",
            difficulty: "hard"
        },
        // 添加更多問題以達到35題...
        {
            question: "By the time we arrived, the movie _____.",
            options: ["already started", "has already started", "had already started", "was already starting"],
            answer: 2,
            explanation: "表達在過去某時間點之前已經完成的動作，應使用過去完成式 'had already started'。",
            category: "動詞時態",
            difficulty: "medium"
        },
        {
            question: "The teacher insisted that every student _____ the assignment on time.",
            options: ["submits", "submitted", "submit", "had submitted"],
            answer: 2,
            explanation: "在 'insist that' 後的子句中，應使用虛擬語氣，即動詞原形。",
            category: "虛擬語氣",
            difficulty: "hard"
        },
        {
            question: "_____ tired, she decided to take a nap.",
            options: ["Being", "Been", "Be", "To be"],
            answer: 0,
            explanation: "表達原因時，可使用現在分詞 'Being' 開頭的分詞構句。",
            category: "分詞",
            difficulty: "medium"
        },
        {
            question: "The book, _____ was published last year, has won several awards.",
            options: ["who", "whom", "whose", "which"],
            answer: 3,
            explanation: "關係代名詞 'which' 用來指代物品，此處指代 'book'。",
            category: "關係代名詞",
            difficulty: "easy"
        },
        {
            question: "Had I known about the traffic, I _____ earlier.",
            options: ["would leave", "had left", "would have left", "left"],
            answer: 2,
            explanation: "在倒裝的虛擬條件句中，表達與過去事實相反的假設，主句應使用 'would have + 過去分詞'。",
            category: "條件句",
            difficulty: "hard"
        }
        // 請根據需要繼續添加問題，直到達到35題
    ];

    // 初始化變數
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = Array(quizQuestions.length).fill(null);
    let quizSubmitted = false;

    // 獲取DOM元素
    const quizElement = document.getElementById('quiz');
    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const submitButton = document.getElementById('submit');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreSection = document.getElementById('score-section');
    const scoreElement = document.getElementById('score');
    const progressFill = document.getElementById('progress-fill');
    const analysisElement = document.getElementById('analysis');

    // 設置總題數
    totalQuestionsElement.textContent = quizQuestions.length;

    // 顯示當前問題
    function showQuestion(questionIndex) {
        const question = quizQuestions[questionIndex];

        // 創建問題容器
        let questionHTML = `
            <div class="question-container">
                <p class="question">${questionIndex + 1}. ${question.question}
                    <span class="difficulty ${question.difficulty}">${getDifficultyText(question.difficulty)}</span>
                </p>
                <ul class="options">
        `;

        // 添加選項
        question.options.forEach((option, index) => {
            const isSelected = userAnswers[questionIndex] === index;
            const optionClass = quizSubmitted
                ? getOptionClass(index, question.answer, userAnswers[questionIndex])
                : (isSelected ? 'selected' : '');

            questionHTML += `
                <li class="option ${optionClass}" data-index="${index}">
                    ${String.fromCharCode(65 + index)}. ${option}
                </li>
            `;
        });

        questionHTML += `</ul>`;

        // 如果已提交測驗，顯示解釋
        if (quizSubmitted) {
            const isCorrect = userAnswers[questionIndex] === question.answer;
            questionHTML += `
                <div class="feedback ${isCorrect ? 'correct' : 'incorrect'} visible">
                    <p><strong>${isCorrect ? '正確！' : '錯誤！'}</strong> ${question.explanation}</p>
                </div>
            `;
        }

        questionHTML += `</div>`;

        quizElement.innerHTML = questionHTML;

        // 如果測驗尚未提交，添加選項點擊事件
        if (!quizSubmitted) {
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', () => {
                    selectOption(option.dataset.index);
                });
            });
        }

        // 更新當前問題顯示
        currentQuestionElement.textContent = questionIndex + 1;

        // 更新按鈕狀態
        updateButtonStates();
    }

    // 選擇選項
    function selectOption(optionIndex) {
        userAnswers[currentQuestion] = parseInt(optionIndex);
        showQuestion(currentQuestion);
    }

    // 更新按鈕狀態
    function updateButtonStates() {
        previousButton.disabled = currentQuestion === 0;

        if (quizSubmitted) {
            nextButton.textContent = '下一題';
            nextButton.disabled = currentQuestion === quizQuestions.length - 1;
            submitButton.classList.add('hidden');
        } else {
            if (currentQuestion === quizQuestions.length - 1) {
                nextButton.classList.add('hidden');
                submitButton.classList.remove('hidden');
            } else {
                nextButton.textContent = '下一題';
                nextButton.classList.remove('hidden');
                submitButton.classList.add('hidden');
            }
        }
    }

    // 獲取選項的CSS類名
    function getOptionClass(optionIndex, correctAnswer, userAnswer) {
        if (optionIndex === correctAnswer) {
            return 'correct';
        } else if (optionIndex === userAnswer && userAnswer !== correctAnswer) {
            return 'incorrect';
        }
        return '';
    }

    // 獲取難度文字
    function getDifficultyText(difficulty) {
        switch(difficulty) {
            case 'easy': return '簡單';
            case 'medium': return '中等';
            case 'hard': return '困難';
            default: return '';
        }
    }

    // 計算得分並顯示結果
    function calculateAndShowResults() {
        score = 0;
        const categoryStats = {};
        const incorrectCategories = {};

        // 計算得分和統計各類別的正確率
        quizQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score++;
            }

            // 統計類別
            if (!categoryStats[question.category]) {
                categoryStats[question.category] = { total: 0, correct: 0 };
            }

            categoryStats[question.category].total++;

            if (userAnswers[index] === question.answer) {
                categoryStats[question.category].correct++;
            } else {
                if (!incorrectCategories[question.category]) {
                    incorrectCategories[question.category] = 0;
                }
                incorrectCategories[question.category]++;
            }
        });

        // 顯示得分
        scoreElement.textContent = score;
        progressFill.style.width = `${(score / quizQuestions.length) * 100}%`;

        // 生成分析報告
        let analysisHTML = `<h3>測驗分析</h3>`;

        // 類別分析
        analysisHTML += `<div class="category-analysis">`;

        for (const category in categoryStats) {
            const stats = categoryStats[category];
            const percentage = Math.round((stats.correct / stats.total) * 100);

            analysisHTML += `
                <div class="category-item">
                    <div class="category-header">
                        <span>${category}</span>
                        <span>${stats.correct}/${stats.total} (${percentage}%)</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }

        analysisHTML += `</div>`;

        // 需要加強的部分
        const sortedCategories = Object.entries(incorrectCategories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (sortedCategories.length > 0) {
            analysisHTML += `<h3>需要加強的部分</h3><ul>`;

            sortedCategories.forEach(([category, count]) => {
                analysisHTML += `<li>${category} (錯誤 ${count} 題)</li>`;
            });

            analysisHTML += `</ul>`;
        }

        // 顯示分析報告
        analysisElement.innerHTML = analysisHTML;

        // 顯示得分區域
        scoreSection.classList.remove('hidden');
    }

    // 事件監聽器
    previousButton.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });

    submitButton.addEventListener('click', () => {
        // 檢查是否所有問題都已回答
        const unansweredQuestions = userAnswers.findIndex(answer => answer === null);

        if (unansweredQuestions !== -1) {
            if (confirm(`您有尚未回答的問題。確定要提交嗎？`)) {
                quizSubmitted = true;
                calculateAndShowResults();
                showQuestion(currentQuestion);
            }
        } else {
            quizSubmitted = true;
            calculateAndShowResults();
            showQuestion(currentQuestion);
        }
    });

    // 初始化顯示第一題
    showQuestion(currentQuestion);
});
