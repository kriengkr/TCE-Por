function startQuiz() {
    const level = document.getElementById('level').value;
    const fileName = `${level}_questions.json`; // โหลดไฟล์ JSON ตามระดับ
  
    if (!level) {
      document.getElementById('quiz-container').innerHTML = "Please select a level.";
      return;
    }
  
    fetch(fileName)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error loading questions file');
        }
        return response.json();
      })
      .then(questions => {
        let html = '<form id="quiz-form"><ol>';
        questions.forEach((q, index) => {
          html += `<li>`;
  
          // ถ้าคำถามมีภาพ ก็จะแสดงภาพ
          if (q.image) {
            html += `<img src="${q.image}" alt="Question Image" style="max-width: 100%;"><br>`;
          }
  
          // แสดงคำถาม
          html += `${q.question}<br>`;
  
          // แสดงตัวเลือก
          q.options.forEach(opt => {
            html += `<label>
                        <input type="radio" name="q${index}" value="${opt}">
                        ${opt}
                     </label><br>`;
          });
          html += '</li>';
        });
        html += '</ol>';
        html += `<button type="button" onclick="checkAnswers()">Submit</button>`;
        html += '</form>';
        document.getElementById('quiz-container').innerHTML = html;
        window.currentQuestions = questions; // เก็บคำถามปัจจุบันไว้สำหรับตรวจคำตอบ
      })
      .catch(error => {
        document.getElementById('quiz-container').innerHTML = "Unable to load questions.";
        console.error(error);
      });
  }
  
  function checkAnswers() {
    const form = document.getElementById('quiz-form');
    const answers = new FormData(form);
    const questions = window.currentQuestions || [];
    let score = 0;
    let resultsHtml = '<h2>Results:</h2><ol>';
  
    questions.forEach((q, index) => {
      const userAnswer = answers.get(`q${index}`);
      const isCorrect = userAnswer === q.answer;
  
      resultsHtml += `<li>${q.question}<br>
        Your answer: ${userAnswer || "No answer"}<br>
        ${isCorrect ? 
          `<span style="color: green;">Correct</span>` : 
          `<span style="color: red;">Incorrect</span><br>
          Correct answer: ${q.answer}`
        }
      </li>`;
  
      if (isCorrect) {
        score++;
      }
    });
  
    resultsHtml += `</ol>`;
    resultsHtml += `<h3>Your score: ${score} out of ${questions.length}</h3>`;
    resultsHtml += `<button onclick="startQuiz()">Try Again</button>`;
  
    document.getElementById('quiz-container').innerHTML = resultsHtml;
  }
  