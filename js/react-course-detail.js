
// --- 1. STATE MANAGEMENT ---
let player;
let currentPlayingIndex = 0;
let maxUnlockedIndex = 0;
const totalLessons = 5; // Matches the 5 videos in the list
let errorTimeout;

// --- 2. YOUTUBE API SETUP ---
function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-video', {
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

// --- 3. VIDEO END DETECTOR (Unlock Logic) ---
function onPlayerStateChange(event) {
    // YT.PlayerState.ENDED is 0
    if (event.data === 0) {
        unlockNextLesson();
    }
}

function unlockNextLesson() {
    if (currentPlayingIndex === maxUnlockedIndex) {
        if (maxUnlockedIndex < totalLessons - 1) {
            maxUnlockedIndex++;
            updatePlaylistUI();
        }
    }
}

// --- 4. CLICK HANDLER (The Gatekeeper) ---
function attemptPlay(index, videoId, title, duration) {
    // SECURITY CHECK: Is this index allowed?
    if (index > maxUnlockedIndex) {
        showLockedError(index);
        return;
    }

    // SUCCESS
    document.getElementById('lock-alert').classList.add('hidden');
    currentPlayingIndex = index;

    if (player && player.loadVideoById) {
        player.loadVideoById(videoId);
    } else {
        document.getElementById('main-video').src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
    }

    document.getElementById('video-title').textContent = title;
    document.getElementById('video-duration').textContent = duration;
    document.getElementById('video-container').scrollIntoView({ behavior: 'smooth', block: 'center' });

    updatePlaylistUI();
}

// --- 5. ERROR FEEDBACK (Red Button + Text) ---
function showLockedError(clickedIndex) {
    const currentButton = document.getElementById(`btn-${maxUnlockedIndex}`);
    const currentTitle = currentButton.querySelector('.flex-grow p').innerText;

    const alertBox = document.getElementById('lock-alert');
    const alertMsg = document.getElementById('lock-msg');

    alertMsg.innerHTML = `You must finish watching <span class="font-bold text-white">"${currentTitle}"</span> to unlock this lesson.`;
    alertBox.classList.remove('hidden');

    const clickedBtn = document.getElementById(`btn-${clickedIndex}`);
    clickedBtn.classList.add('border-red-500', 'bg-red-500/10', 'shake-animation');
    clickedBtn.classList.remove('border-transparent');

    if (errorTimeout) clearTimeout(errorTimeout);

    errorTimeout = setTimeout(() => {
        alertBox.classList.add('hidden');
        clickedBtn.classList.remove('border-red-500', 'bg-red-500/10', 'shake-animation');
        clickedBtn.classList.add('border-transparent');
    }, 4000);
}

// --- 6. UI UPDATER ---
function updatePlaylistUI() {
    for (let i = 0; i < totalLessons; i++) {
        const btn = document.getElementById(`btn-${i}`);
        const iconBox = btn.querySelector('.icon-box');
        const titleText = btn.querySelector('.flex-grow p');
        const durText = btn.querySelector('.flex-grow span');

        // Clean Slate
        btn.className = "playlist-item w-full flex items-center gap-3 p-3 rounded-xl border border-transparent text-left transition group";
        iconBox.className = "icon-box flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs";
        durText.innerText = durText.innerText.replace(' • Playing', '');

        // LOGIC: CURRENT PLAYING
        if (i === currentPlayingIndex) {
            btn.classList.add('bg-primary/20', 'border-primary/50');
            btn.classList.remove('border-transparent');
            iconBox.classList.add('bg-primary', 'text-white', 'font-bold');
            iconBox.innerHTML = '<i class="fa-solid fa-play text-[10px]"></i>';
            titleText.className = "text-sm font-semibold text-white";
            durText.className = "text-xs text-primary font-medium";
            durText.innerText += ' • Playing';
        }
        // LOGIC: UNLOCKED
        else if (i <= maxUnlockedIndex) {
            btn.classList.add('hover:bg-gray-700/50', 'hover:border-gray-600');
            iconBox.classList.add('border', 'border-gray-500', 'text-gray-400', 'group-hover:border-white', 'group-hover:text-white');

            if (i < maxUnlockedIndex) {
                iconBox.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i>';
                iconBox.classList.remove('border-gray-500', 'text-gray-400');
                iconBox.classList.add('text-green-500', 'border-green-500');
            } else {
                iconBox.innerText = i + 1;
            }

            titleText.className = "text-sm font-medium text-gray-300 group-hover:text-white";
            durText.className = "text-xs text-gray-500";
        }
        // LOGIC: LOCKED
        else {
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            iconBox.classList.add('border', 'border-gray-500', 'text-gray-400');
            iconBox.innerHTML = '<i class="fa-solid fa-lock text-[10px]"></i>';
            titleText.className = "text-sm font-medium text-gray-500";
            durText.className = "text-xs text-gray-600";
        }
    }
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const percent = ((currentPlayingIndex + 1) / totalLessons) * 100;
    progressBar.style.width = `${percent}%`;

    progressBar.classList.remove('bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500');

    if (percent <= 25) progressBar.classList.add('bg-red-500');
    else if (percent <= 50) progressBar.classList.add('bg-orange-500');
    else if (percent <= 75) progressBar.classList.add('bg-yellow-400');
    else progressBar.classList.add('bg-green-500');
}

// --- SAVE COURSE LOGIC (Updated for React) ---
function saveCurrentCourse() {
    const courseData = {
        id: 'react-202',
        title: 'Modern React.js Masterclass',
        lessons: '24 Lessons',
        duration: '10h 15m',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300',
        link: 'react-course-detail.html'
    };

    let savedCourses = JSON.parse(localStorage.getItem('learnify_saved')) || [];
    const isSaved = savedCourses.some(course => course.id === courseData.id);

    if (isSaved) {
        savedCourses = savedCourses.filter(course => course.id !== courseData.id);
        updateSaveButtonUI(false);
    } else {
        savedCourses.push(courseData);
        updateSaveButtonUI(true);
    }
    localStorage.setItem('learnify_saved', JSON.stringify(savedCourses));
}

function updateSaveButtonUI(isSaved) {
    const icon = document.getElementById('save-icon');
    const text = document.getElementById('save-text');
    if (isSaved) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-accent');
        text.innerText = "Saved";
        text.classList.add('text-accent');
    } else {
        icon.classList.remove('fa-solid', 'text-accent');
        icon.classList.add('fa-regular');
        text.innerText = "Save";
        text.classList.remove('text-accent');
    }
}

window.onload = function () {
    // Check if saved
    let savedCourses = JSON.parse(localStorage.getItem('learnify_saved')) || [];
    const isSaved = savedCourses.some(course => course.id === 'react-202');
    if (isSaved) updateSaveButtonUI(true);

    // Init UI
    updatePlaylistUI();
}
