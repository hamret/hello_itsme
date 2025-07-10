// script.js 파일에 추가할 내용
document.addEventListener('DOMContentLoaded', () => {

    // --- 다크 모드 토글 기능 (이전과 동일) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const emojiSpan = themeToggle.querySelector('span');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.childNodes[1].nodeValue = ' 라이트 모드';
        emojiSpan.textContent = '☀️';
    } else {
        themeToggle.childNodes[1].nodeValue = ' 다크 모드';
        emojiSpan.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.childNodes[1].nodeValue = ' 라이트 모드';
            emojiSpan.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.childNodes[1].nodeValue = ' 다크 모드';
            emojiSpan.textContent = '🌙';
        }
    });


    // --- 오디오 플레이어 기능 ---
    const myAudio = document.getElementById('myAudio');
    const audioFileInput = document.getElementById('audioFileInput');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeElem = document.querySelector('.current-time');
    const durationTimeElem = document.querySelector('.duration-time');
    const volumeSlider = document.getElementById('volumeSlider');
    const speedSlider = document.getElementById('speedSlider');

    let currentAudioFile = null;

    // --- 파일 업로드 처리 ---
    audioFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            currentAudioFile = file;
            const fileURL = URL.createObjectURL(file);
            myAudio.src = fileURL;
            myAudio.load();
            playAudio(); // 파일 로드 후 자동 재생
            stopBtn.disabled = false;
        }
    });

    // --- 재생 / 일시정지 버튼 토글 ---
    playPauseBtn.addEventListener('click', () => {
        if (!currentAudioFile) {
            alert('먼저 음악 파일을 선택해주세요!');
            audioFileInput.click();
            return;
        }
        if (myAudio.paused || myAudio.ended) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    function playAudio() {
        myAudio.play();
        // 재생 버튼 모양 변경: 재생 -> 일시정지
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline-block'; // 'block'으로 변경하여 중앙 정렬이 더 잘 되도록
    }

    function pauseAudio() {
        myAudio.pause();
        // 일시정지 버튼 모양 변경: 일시정지 -> 재생
        playIcon.style.display = 'inline-block'; // 'block'으로 변경
        pauseIcon.style.display = 'none';
    }

    // --- 정지 버튼 ---
    stopBtn.addEventListener('click', () => {
        myAudio.pause();
        myAudio.currentTime = 0;
        playIcon.style.display = 'inline-block'; // 정지 시 재생 아이콘 표시
        pauseIcon.style.display = 'none';
        progressBar.style.width = '0%';
        currentTimeElem.textContent = '0:00';
    });

    // --- 볼륨 조절 ---
    volumeSlider.addEventListener('input', () => {
        myAudio.volume = volumeSlider.value;
    });

    // --- 재생 속도 조절 ---
    speedSlider.addEventListener('change', () => {
        myAudio.playbackRate = speedSlider.value;
    });

    // --- 재생 시간 업데이트 (진행 바 및 텍스트) ---
    myAudio.addEventListener('timeupdate', () => {
        if (isNaN(myAudio.duration)) {
            progressBar.style.width = '0%';
            currentTimeElem.textContent = '0:00';
            durationTimeElem.textContent = '0:00';
            return;
        }
        const progressPercent = (myAudio.currentTime / myAudio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTimeElem.textContent = formatTime(myAudio.currentTime);
    });

    // --- 오디오 메타데이터 로드 시 (총 시간 표시) ---
    myAudio.addEventListener('loadedmetadata', () => {
        durationTimeElem.textContent = formatTime(myAudio.duration);
    });

    // --- 재생이 끝났을 때 ---
    myAudio.addEventListener('ended', () => {
        pauseAudio();
        myAudio.currentTime = 0;
        progressBar.style.width = '0%';
        currentTimeElem.textContent = '0:00';
    });

    // --- 진행 바 클릭으로 재생 위치 이동 ---
    progressBarContainer.addEventListener('click', (e) => {
        if (!currentAudioFile || isNaN(myAudio.duration)) return;

        const clickX = e.offsetX;
        const containerWidth = progressBarContainer.clientWidth;
        const seekTime = (clickX / containerWidth) * myAudio.duration;

        myAudio.currentTime = seekTime;
    });

    // --- 시간 포맷 함수 (초 -> 분:초) ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // 초기 볼륨 설정
    myAudio.volume = volumeSlider.value;
});