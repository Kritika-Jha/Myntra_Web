document.addEventListener("DOMContentLoaded", function () {
    let poll = {
        question: "",
        answers: [],
        images: [],
        pollCount: 0,
        answersWeight: [],
        selectedAnswer: -1
    };

    let pollDOM = {
        question: document.querySelector(".poll .question"),
        answers: document.querySelector(".poll .answers"),
    };

    // Function to add new option input fields dynamically
    window.addOption = function () {
        const optionContainer = document.getElementById('options-container');
        const optionCount = optionContainer.children.length + 1;
        const div = document.createElement('div');
        div.className = 'option-input';
        div.innerHTML = `
            <input type="url" placeholder="Product Link ${optionCount}" class="option-url" required />
            <input type="file" accept="image/*" class="option-image" onchange="previewImage(this, ${optionCount})" required>
            <img id="preview-image-${optionCount}" src="#" alt="Preview" style="display:none;max-width:100px;max-height:100px;">
        `;
        optionContainer.appendChild(div);
    };

    // Function to preview image selected for each option
    window.previewImage = function(input, imgId) {
        const file = input.files[0];
        const img = document.getElementById(`preview-image-${imgId}`);
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    };

    // Function to create and display the poll
    window.createPoll = function () {
        const questionInput = document.getElementById('question-input');
        const optionUrls = document.querySelectorAll('.option-url');
        const optionImages = document.querySelectorAll('.option-image');

        poll.question = questionInput.value;
        poll.answers = [];
        poll.images = [];
        poll.answersWeight = [];
        poll.pollCount = 0;

        optionUrls.forEach((input, index) => {
            poll.answers.push(input.value);
            poll.answersWeight.push(0);

            const imageInput = optionImages[index];
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    poll.images[index] = e.target.result;
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                poll.images[index] = "";
            }
        });

        // Display poll after a short delay for visual effect
        setTimeout(() => {
            pollDOM.question.innerText = poll.question;
            pollDOM.answers.innerHTML = poll.answers.map((answer, i) => {
                return `
                    <div class="answer" onclick="markAnswer(${i})">
                        <a href="${answer}" target="_blank">${answer}</a>
                        ${poll.images[i] ? `<img src="${poll.images[i]}" alt="Option Image">` : ""}
                        <span class="percentage-bar"></span>
                        <span class="percentage-value"></span>
                    </div>
                `;
            }).join("");
            document.querySelector('.poll').style.display = 'block';
            document.querySelector('.poll-form').style.display = 'none'; // Hide poll form after displaying poll
        }, 500);
    };

    // Function to mark selected answer and update result display
    window.markAnswer = function(i) {
        poll.selectedAnswer = +i;
        try {
            document.querySelector(".poll .answers .answer.selected").classList.remove("selected");
        } catch (msg) { }
        document.querySelectorAll(".poll .answers .answer")[+i].classList.add("selected");
        showResults();
    };

    // Function to show results with animated percentage bars
    function showResults() {
        let answers = document.querySelectorAll(".poll .answers .answer");
        for (let i = 0; i < answers.length; i++) {
            let percentage = 0;
            if (i === poll.selectedAnswer) {
                percentage = Math.round(
                    (poll.answersWeight[i] + 1) * 100 / (poll.pollCount + 1)
                );
            } else {
                percentage = Math.round(
                    poll.answersWeight[i] * 100 / (poll.pollCount + 1)
                );
            }
            answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
            answers[i].querySelector(".percentage-value").innerText = percentage + "%";
        }
    };

    // Function to add poll option dynamically from item button
    const addPollOption = (imageSrc) => {
        const optionContainer = document.getElementById('options-container');
        const optionCount = optionContainer.children.length + 1;
        const div = document.createElement('div');
        div.className = 'option-input';
        div.innerHTML = `
            <input type="url" placeholder="Product Link ${optionCount}" class="option-url" required />
            <input type="hidden" class="option-image-src" value="${imageSrc}">
            <img id="preview-image-${optionCount}" src="${imageSrc}" alt="Preview" style="display:block;max-width:100px;max-height:100px;">
        `;
        optionContainer.appendChild(div);
    };

    // Event listener for "Add to Poll" buttons
    const pollButtons = document.querySelectorAll('.btn-add-poll-option');
    pollButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            addPollOption(imageSrc);
        });
    });
});
