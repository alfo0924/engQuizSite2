document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const introSection = document.getElementById('intro');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentQuestionSpan = document.getElementById('current-question');
    const quizContent = document.getElementById('quiz-content');
    const levelBtns = document.querySelectorAll('.level-btn');

    // 結果頁面元素
    const finalScoreSpan = document.getElementById('final-score');
    const correctCountSpan = document.getElementById('correct-count');
    const incorrectCountSpan = document.getElementById('incorrect-count');
    const toeicScoreSpan = document.getElementById('toeic-score');
    const toeflScoreSpan = document.getElementById('toefl-score');
    const weaknessChart = document.getElementById('weakness-chart');
    const resultsList = document.getElementById('results-list');

    // 測驗狀態
    let currentQuestion = 0;
    let selectedLevel = 'medium'; // 預設中級
    let userAnswers = [];
    let questions = [];

    // 文法類型
    const grammarTypes = {
        verb: '動詞時態與語態',
        noun: '名詞與冠詞',
        adj: '形容詞與副詞',
        prep: '介系詞',
        conj: '連接詞',
        pron: '代名詞',
        cond: '條件句',
        modal: '情態動詞',
        comp: '比較級與最高級',
        clause: '子句'
    };

    // 初始化事件監聽器
    function initEventListeners() {
        startBtn.addEventListener('click', startQuiz);
        prevBtn.addEventListener('click', goToPrevQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        submitBtn.addEventListener('click', submitQuiz);
        restartBtn.addEventListener('click', restartQuiz);

        // 難度選擇按鈕
        levelBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                levelBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedLevel = this.dataset.level;
            });
        });

        // 預設選中中級難度
        document.querySelector('[data-level="medium"]').classList.add('active');
    }

    // 開始測驗
    function startQuiz() {
        // 根據選擇的難度載入題目
        loadQuestions(selectedLevel);

        // 初始化用戶答案陣列
        userAnswers = Array(questions.length).fill(null);

        // 顯示測驗區塊，隱藏介紹區塊
        introSection.classList.add('hidden');
        quizContainer.classList.remove('hidden');

        // 顯示第一題
        showQuestion(0);
    }

    // 載入題目
    function loadQuestions(level) {
        // 這裡應該根據難度等級載入不同的題目
        // 以下為示範用的題目
        questions = generateQuestions(level);
    }

    // 顯示當前題目
    function showQuestion(index) {
        const question = questions[index];
        currentQuestion = index;

        // 更新進度條和題號
        updateProgress();

        // 清空並填充題目內容
        quizContent.innerHTML = '';

        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `${index + 1}. ${question.question}`;
        questionContainer.appendChild(questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';

        // 創建選項
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement('div');
            optionItem.className = 'option-item';
            if (userAnswers[index] === optionIndex) {
                optionItem.classList.add('selected');
            }

            optionItem.addEventListener('click', () => {
                selectOption(index, optionIndex);
            });

            const optionLabel = document.createElement('span');
            optionLabel.className = 'option-label';
            optionLabel.textContent = String.fromCharCode(65 + optionIndex); // A, B, C, D

            const optionText = document.createElement('span');
            optionText.className = 'option-text';
            optionText.textContent = option;

            optionItem.appendChild(optionLabel);
            optionItem.appendChild(optionText);
            optionsContainer.appendChild(optionItem);
        });

        questionContainer.appendChild(optionsContainer);
        quizContent.appendChild(questionContainer);

        // 更新按鈕狀態
        updateButtonState();
    }

    // 選擇選項
    function selectOption(questionIndex, optionIndex) {
        userAnswers[questionIndex] = optionIndex;

        // 更新選中狀態
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach((item, index) => {
            if (index === optionIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // 更新按鈕狀態
        updateButtonState();
    }

    // 更新進度條和題號
    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        currentQuestionSpan.textContent = currentQuestion + 1;
    }

    // 更新按鈕狀態
    function updateButtonState() {
        // 上一題按鈕
        prevBtn.disabled = currentQuestion === 0;

        // 下一題和提交按鈕
        if (currentQuestion === questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');

            // 檢查是否所有題目都已回答
            const allAnswered = userAnswers.every(answer => answer !== null);
            submitBtn.disabled = !allAnswered;
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    // 前往上一題
    function goToPrevQuestion() {
        if (currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    }

    // 前往下一題
    function goToNextQuestion() {
        if (currentQuestion < questions.length - 1) {
            showQuestion(currentQuestion + 1);
        }
    }

    // 提交測驗
    function submitQuiz() {
        // 計算分數
        const results = calculateResults();

        // 顯示結果
        displayResults(results);

        // 隱藏測驗區塊，顯示結果區塊
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
    }

    // 計算測驗結果
    function calculateResults() {
        let correctCount = 0;
        const weaknesses = {};

        // 計算正確答案數量和弱點
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                correctCount++;
            } else {
                // 記錄弱點
                if (!weaknesses[question.type]) {
                    weaknesses[question.type] = 0;
                }
                weaknesses[question.type]++;
            }
        });

        // 計算分數 (100分制)
        const score = Math.round((correctCount / questions.length) * 100);

        // 估算多益和托福分數
        const toeicScore = estimateToeicScore(score, selectedLevel);
        const toeflScore = estimateToeflScore(score, selectedLevel);

        return {
            score,
            correctCount,
            incorrectCount: questions.length - correctCount,
            toeicScore,
            toeflScore,
            weaknesses
        };
    }

    // 估算多益分數
    function estimateToeicScore(score, level) {
        let baseScore;

        switch (level) {
            case 'easy':
                baseScore = 250;
                return Math.min(550, baseScore + score * 3);
            case 'medium':
                baseScore = 550;
                return Math.min(750, baseScore + score * 2);
            case 'hard':
                baseScore = 750;
                return Math.min(990, baseScore + score * 2.4);
            default:
                return 0;
        }
    }

    // 估算托福分數
    function estimateToeflScore(score, level) {
        let baseScore;

        switch (level) {
            case 'easy':
                baseScore = 10;
                return Math.min(40, baseScore + score * 0.3);
            case 'medium':
                baseScore = 40;
                return Math.min(70, baseScore + score * 0.3);
            case 'hard':
                baseScore = 70;
                return Math.min(100, baseScore + score * 0.3);
            default:
                return 0;
        }
    }

    // 顯示測驗結果
    function displayResults(results) {
        // 更新分數摘要
        finalScoreSpan.textContent = results.score;
        correctCountSpan.textContent = results.correctCount;
        incorrectCountSpan.textContent = results.incorrectCount;
        toeicScoreSpan.textContent = results.toeicScore;
        toeflScoreSpan.textContent = results.toeflScore;

        // 顯示弱點分析
        displayWeaknesses(results.weaknesses);

        // 顯示詳細答題結果
        displayDetailedResults();
    }

    // 顯示弱點分析
    function displayWeaknesses(weaknesses) {
        weaknessChart.innerHTML = '';

        // 按錯誤數量排序
        const sortedWeaknesses = Object.entries(weaknesses)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // 只顯示前5個弱點

        if (sortedWeaknesses.length === 0) {
            const perfectMessage = document.createElement('p');
            perfectMessage.textContent = '恭喜！您沒有明顯的弱點。';
            weaknessChart.appendChild(perfectMessage);
            return;
        }

        sortedWeaknesses.forEach(([type, count]) => {
            const weaknessItem = document.createElement('div');
            weaknessItem.className = 'weakness-item';

            const weaknessName = document.createElement('span');
            weaknessName.textContent = grammarTypes[type] || type;

            const weaknessCount = document.createElement('span');
            weaknessCount.className = 'weakness-count';
            weaknessCount.textContent = count;

            weaknessItem.appendChild(weaknessName);
            weaknessItem.appendChild(weaknessCount);
            weaknessChart.appendChild(weaknessItem);
        });
    }

    // 顯示詳細答題結果
    function displayDetailedResults() {
        resultsList.innerHTML = '';

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            // 題目
            const resultQuestion = document.createElement('div');
            resultQuestion.className = 'result-question';

            const resultStatus = document.createElement('span');
            resultStatus.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
            resultStatus.innerHTML = isCorrect ? '✓' : '✗';

            const questionText = document.createElement('span');
            questionText.textContent = `${index + 1}. ${question.question}`;

            resultQuestion.appendChild(resultStatus);
            resultQuestion.appendChild(questionText);
            resultItem.appendChild(resultQuestion);

            // 選項
            const resultOptions = document.createElement('div');
            resultOptions.className = 'result-options';

            question.options.forEach((option, optionIndex) => {
                const resultOption = document.createElement('div');
                resultOption.className = 'result-option';

                if (optionIndex === userAnswer && !isCorrect) {
                    resultOption.classList.add('user-answer');
                }

                if (optionIndex === question.correctAnswer) {
                    resultOption.classList.add('correct-answer');
                }

                const optionLabel = document.createElement('span');
                optionLabel.className = 'option-label';
                optionLabel.textContent = String.fromCharCode(65 + optionIndex); // A, B, C, D

                const optionText = document.createElement('span');
                optionText.textContent = option;

                resultOption.appendChild(optionLabel);
                resultOption.appendChild(optionText);
                resultOptions.appendChild(resultOption);
            });

            resultItem.appendChild(resultOptions);

            // 解釋
            if (!isCorrect) {
                const explanation = document.createElement('div');
                explanation.className = 'explanation';

                const explanationTitle = document.createElement('div');
                explanationTitle.className = 'explanation-title';
                explanationTitle.textContent = '解析：';

                const explanationText = document.createElement('div');
                explanationText.textContent = question.explanation;

                explanation.appendChild(explanationTitle);
                explanation.appendChild(explanationText);
                resultItem.appendChild(explanation);
            }

            resultsList.appendChild(resultItem);
        });
    }

    // 重新開始測驗
    function restartQuiz() {
        // 重置狀態
        currentQuestion = 0;
        userAnswers = [];

        // 顯示介紹區塊，隱藏結果區塊
        resultsContainer.classList.add('hidden');
        introSection.classList.remove('hidden');
    }

    // 生成測驗題目 (根據難度)
    function generateQuestions(level) {
        // 這裡應該從資料庫或API獲取題目
        // 以下為示範用的題目

        // 基本題庫
        const easyQuestions = [
            {
                question: "She _____ to the store yesterday.",
                options: ["go", "goes", "went", "going"],
                correctAnswer: 2,
                type: "verb",
                explanation: "過去式應使用went，因為yesterday表示過去時間。"
            },
            {
                question: "There _____ some books on the table.",
                options: ["is", "are", "be", "been"],
                correctAnswer: 1,
                type: "verb",
                explanation: "複數名詞books作主詞，應使用複數動詞are。"
            },
            {
                question: "I have _____ apple.",
                options: ["a", "an", "the", "no article"],
                correctAnswer: 1,
                type: "noun",
                explanation: "apple開頭是母音，應使用冠詞an。"
            },
            {
                question: "He speaks English _____.",
                options: ["good", "well", "nice", "fine"],
                correctAnswer: 1,
                type: "adj",
                explanation: "修飾動詞speaks應使用副詞well，而非形容詞good。"
            },
            {
                question: "The book is _____ the table.",
                options: ["in", "on", "at", "by"],
                correctAnswer: 1,
                type: "prep",
                explanation: "表示物體在平面上，應使用介系詞on。"
            },
            {
                question: "I like coffee _____ I don't like tea.",
                options: ["but", "and", "or", "so"],
                correctAnswer: 0,
                type: "conj",
                explanation: "表示轉折關係，應使用連接詞but。"
            },
            {
                question: "This is _____ book.",
                options: ["I", "me", "my", "mine"],
                correctAnswer: 2,
                type: "pron",
                explanation: "修飾名詞book應使用形容詞性物主代名詞my。"
            },
            {
                question: "If it rains tomorrow, I _____ at home.",
                options: ["stay", "stays", "will stay", "staying"],
                correctAnswer: 2,
                type: "cond",
                explanation: "條件句中，主句應使用will + 動詞原形表示將來。"
            },
            {
                question: "You _____ smoke in the hospital.",
                options: ["can", "must", "should", "must not"],
                correctAnswer: 3,
                type: "modal",
                explanation: "表示禁止，應使用must not。"
            },
            {
                question: "This building is _____ than that one.",
                options: ["tall", "taller", "tallest", "more tall"],
                correctAnswer: 1,
                type: "comp",
                explanation: "比較兩個物體，應使用比較級taller。"
            }
        ];

        const mediumQuestions = [
            {
                question: "By the time we arrived, the movie _____.",
                options: ["already started", "has already started", "had already started", "was already starting"],
                correctAnswer: 2,
                type: "verb",
                explanation: "過去完成式表示在過去某時間點之前已經完成的動作，應使用had already started。"
            },
            {
                question: "I wish I _____ more time to finish this project.",
                options: ["have", "had", "would have", "will have"],
                correctAnswer: 1,
                type: "verb",
                explanation: "wish後接虛擬語氣，表示與現在事實相反的假設，應使用had。"
            },
            {
                question: "The committee _____ divided on this issue.",
                options: ["is", "are", "has", "have"],
                correctAnswer: 0,
                type: "noun",
                explanation: "committee是集合名詞，視為單數，因此用is。"
            },
            {
                question: "She spoke _____ quietly that nobody could hear her.",
                options: ["so", "such", "very", "too"],
                correctAnswer: 0,
                type: "adj",
                explanation: "so + 副詞 + that結構，表示程度，應使用so。"
            },
            {
                question: "The report was submitted _____ May 15th.",
                options: ["in", "on", "at", "by"],
                correctAnswer: 1,
                type: "prep",
                explanation: "特定日期前應使用介系詞on。"
            },
            {
                question: "_____ it was raining, we decided to go for a walk.",
                options: ["Although", "Because", "Since", "Unless"],
                correctAnswer: 0,
                type: "conj",
                explanation: "表示讓步關係，應使用連接詞Although。"
            },
            {
                question: "The manager asked _____ to finish the report by Friday.",
                options: ["I", "me", "myself", "mine"],
                correctAnswer: 1,
                type: "pron",
                explanation: "作為動詞asked的賓語，應使用賓格me。"
            },
            {
                question: "If I _____ rich, I would travel around the world.",
                options: ["am", "was", "were", "had been"],
                correctAnswer: 2,
                type: "cond",
                explanation: "虛擬條件句表示與現在事實相反的假設，應使用were。"
            },
            {
                question: "You _____ have seen John yesterday; he's been in New York all week.",
                options: ["must", "can't", "should", "might"],
                correctAnswer: 1,
                type: "modal",
                explanation: "表示不可能，應使用can't have seen。"
            },
            {
                question: "The project was _____ challenging than we expected.",
                options: ["less", "more", "most", "least"],
                correctAnswer: 1,
                type: "comp",
                explanation: "比較級表示程度超過預期，應使用more。"
            }
        ];

        const hardQuestions = [
            {
                question: "Had I known about the problem earlier, I _____ it.",
                options: ["would solve", "would have solved", "will solve", "had solved"],
                correctAnswer: 1,
                type: "verb",
                explanation: "虛擬條件句表示與過去事實相反的假設，主句應使用would have + 過去分詞。"
            },
            {
                question: "Not only _____ the exam, but he also got the highest score.",
                options: ["he passed", "did he pass", "passed he", "he did pass"],
                correctAnswer: 1,
                type: "verb",
                explanation: "Not only位於句首時，需要倒裝結構，應使用did he pass。"
            },
            {
                question: "The data _____ carefully before being published.",
                options: ["was analyzed", "were analyzed", "was analyzing", "were analyzing"],
                correctAnswer: 0,
                type: "noun",
                explanation: "data雖源自複數，但在現代英語中常視為單數，因此用was analyzed。"
            },
            {
                question: "The novel was _____ written that it won several literary awards.",
                options: ["so well", "such well", "so good", "such good"],
                correctAnswer: 0,
                type: "adj",
                explanation: "so + 副詞 + 過去分詞結構，應使用so well。"
            },
            {
                question: "The findings of the study are consistent _____ previous research.",
                options: ["to", "with", "for", "by"],
                correctAnswer: 1,
                type: "prep",
                explanation: "consistent搭配介系詞with。"
            },
            {
                question: "_____ the economy improves, unemployment rates will continue to rise.",
                options: ["Unless", "While", "Because", "Since"],
                correctAnswer: 0,
                type: "conj",
                explanation: "表示條件關係，應使用連接詞Unless。"
            },
            {
                question: "The issue to _____ she referred has been resolved.",
                options: ["who", "whom", "which", "whose"],
                correctAnswer: 2,
                type: "pron",
                explanation: "關係代名詞指代非人的issue，且在介系詞to後作賓語，應使用which。"
            },
            {
                question: "Were the resources to be allocated differently, the outcome _____ more favorable.",
                options: ["will be", "would be", "will have been", "would have been"],
                correctAnswer: 1,
                type: "cond",
                explanation: "虛擬條件句倒裝結構，主句應使用would be。"
            },
            {
                question: "The regulations stipulate that all participants _____ submit their applications by the deadline.",
                options: ["must", "should", "can", "may"],
                correctAnswer: 0,
                type: "modal",
                explanation: "表示強制性要求，應使用must。"
            },
            {
                question: "The implications of this theory are far _____ than initially anticipated.",
                options: ["more reaching", "more reached", "further reaching", "further reached"],
                correctAnswer: 2,
                type: "comp",
                explanation: "慣用表達為far further reaching。"
            }
        ];

        // 根據難度選擇題目
        let baseQuestions;
        switch (level) {
            case 'easy':
                baseQuestions = easyQuestions;
                break;
            case 'medium':
                baseQuestions = mediumQuestions;
                break;
            case 'hard':
                baseQuestions = hardQuestions;
                break;
            default:
                baseQuestions = mediumQuestions;
        }

        // 生成35題
        let selectedQuestions = [];

        // 首先加入基本題庫
        selectedQuestions = [...baseQuestions];

        // 如果基本題庫不足35題，從其他難度補充
        if (selectedQuestions.length < 35) {
            let additionalQuestions = [];

            if (level === 'easy') {
                additionalQuestions = [...mediumQuestions];
            } else if (level === 'hard') {
                additionalQuestions = [...mediumQuestions];
            } else {
                additionalQuestions = [...easyQuestions, ...hardQuestions];
            }

            // 隨機選擇額外題目直到達到35題
            while (selectedQuestions.length < 35 && additionalQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * additionalQuestions.length);
                selectedQuestions.push(additionalQuestions[randomIndex]);
                additionalQuestions.splice(randomIndex, 1);
            }
        }

        // 如果還是不足35題，重複使用基本題庫
        while (selectedQuestions.length < 35) {
            const randomIndex = Math.floor(Math.random() * baseQuestions.length);
            const question = {...baseQuestions[randomIndex]};
            // 稍微修改題目以避免完全重複
            question.question = `[複習] ${question.question}`;
            selectedQuestions.push(question);
        }

        // 只取前35題
        return selectedQuestions.slice(0, 35);
    }

    // 初始化
    initEventListeners();
});
