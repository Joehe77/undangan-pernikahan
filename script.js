const TANGGAL_AKAD = "2026-12-20T08:00:00";
const NOMOR_WA = "6281234567890";

const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
if (namaTamu) {
  document.getElementById("tamuNama").textContent = decodeURIComponent(namaTamu);
}

let currentSlide = 0;

function bukaUndangan() {
  document.getElementById("cover").classList.add("hide");
  document.getElementById("bottomNav").classList.add("show");
  document.querySelector(".wa-float").classList.add("show");
  document.getElementById("musicBtn").classList.add("show");

  const music = document.getElementById("bgMusic");
  music.volume = 0.5;
  music.play()
    .then(() => {
      document.getElementById("musicBtn").classList.add("playing");
    })
    .catch(e => {
      document.addEventListener("click", function playOnClick() {
        music.play();
        document.getElementById("musicBtn").classList.add("playing");
        document.removeEventListener("click", playOnClick);
      }, { once: true });
    });
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const navBtns = document.querySelectorAll(".nav-btn");

  if (index === currentSlide) return;

  slides.forEach(s => {
    const slideNum = parseInt(s.dataset.slide);
    s.classList.remove("active", "prev");
    if (slideNum === index) s.classList.add("active");
    else if (slideNum < index) s.classList.add("prev");
  });

  navBtns.forEach(b => {
    b.classList.remove("active");
    if (parseInt(b.dataset.nav) === index) b.classList.add("active");
  });

  currentSlide = index;
  const activeSlide = document.querySelector(".slide.active");
  if (activeSlide) activeSlide.scrollTop = 0;
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const diffX = touchStartX - e.changedTouches[0].screenX;
  const diffY = touchStartY - e.changedTouches[0].screenY;
  if (Math.abs(diffX) < 60 || Math.abs(diffY) > Math.abs(diffX)) return;
  const totalSlides = document.querySelectorAll(".slide").length;
  if (diffX > 0 && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  else if (diffX < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
}, { passive: true });

function updateCountdown() {
  const target = new Date(TANGGAL_AKAD).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  if (diff < 0) {
    ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "0");
    return;
  }
  document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  document.getElementById("minutes").textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  document.getElementById("seconds").textContent = Math.floor((diff % (1000 * 60)) / 1000);
}

setInterval(updateCountdown, 1000);
updateCountdown();

function copyRekening(norek) {
  navigator.clipboard.writeText(norek).then(() => {
    alert("Nomor rekening berhasil di-copy!\n\n" + norek);
  }).catch(() => alert("Nomor rekening: " + norek));
}

let daftarUcapanData = [
  { nama: "Budi Santoso", isi: "Selamat menempuh hidup baru! Semoga menjadi keluarga sakinah, mawaddah, warahmah.", konfirmasi: "hadir", waktu: "Baru saja" },
  { nama: "Rina & Keluarga", isi: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khair. Selamat ya!", konfirmasi: "tidak", waktu: "5 menit lalu" }
];

function renderUcapan() {
  const el = document.getElementById("daftarUcapan");
  el.innerHTML = "";
  const totalHadir = daftarUcapanData.filter(u => u.konfirmasi === "hadir").length;
  const totalTidak = daftarUcapanData.filter(u => u.konfirmasi === "tidak").length;
  document.getElementById("totalComments").textContent = daftarUcapanData.length + " Comments";
  document.getElementById("totalHadir").textContent = totalHadir;
  document.getElementById("totalTidak").textContent = totalTidak;
  daftarUcapanData.slice().reverse().forEach(u => {
    const div = document.createElement("div");
    div.className = "ucapan-item";
    const badge = u.konfirmasi === "hadir"
      ? '<span class="badge-hadir">Hadir</span>'
      : '<span class="badge-tidak">Tidak Hadir</span>';
    div.innerHTML = `
      <div class="ucapan-head">
        <span class="ucapan-nama">${u.nama}</span>
        ${badge}
      </div>
      <div class="ucapan-isi">${u.isi}</div>
      <div class="ucapan-waktu">${u.waktu}</div>
    `;
    el.appendChild(div);
  });
}

function kirimUcapan(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const ucapan = document.getElementById("ucapan").value;
  const konfirmasi = document.getElementById("konfirmasi").value;
  if (!nama || !ucapan || !konfirmasi) return;
  daftarUcapanData.push({ nama, isi: ucapan, konfirmasi, waktu: "Baru saja" });
  renderUcapan();
  document.getElementById("nama").value = "";
  document.getElementById("ucapan").value = "";
  document.getElementById("konfirmasi").value = "";
  alert("Terima kasih atas ucapan & doanya!");
}

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  if (music.paused) {
    music.play();
    btn.classList.add("playing");
  } else {
    music.pause();
    btn.classList.remove("playing");
  }
}

renderUcapan();
