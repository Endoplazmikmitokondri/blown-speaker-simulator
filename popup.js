const OPTIMUM_DISTORTION = 450;
const slider = document.getElementById('distortionSlider');
const levelText = document.getElementById('levelText');
const resetBtn = document.getElementById('resetBtn');
const baslatBtn = document.getElementById('baslatBtn');
const durdurBtn = document.getElementById('durdurBtn');

// Eklenti açıldığında, kullanıcının daha önce kaydettiği ayarı (yoksa varsayılanı) yükle
chrome.storage.local.get(['distortionValue'], (result) => {
  const savedValue = result.distortionValue || OPTIMUM_DISTORTION;
  slider.value = savedValue;
  levelText.innerText = savedValue;
});

// Bar kaydırıldıkça değeri güncelle, hafızaya kaydet ve canlı olarak arka plana gönder
slider.addEventListener('input', () => {
  const val = parseInt(slider.value);
  levelText.innerText = val;
  chrome.storage.local.set({ distortionValue: val });
  
  // Eğer müzik çalıyorsa canlı güncellenmesi için emir gönder
  chrome.runtime.sendMessage({ islem: "guncelle", deger: val });
});

// Reset butonu her şeyi optimum değere (450) döndürür
resetBtn.addEventListener('click', () => {
  slider.value = OPTIMUM_DISTORTION;
  levelText.innerText = OPTIMUM_DISTORTION;
  chrome.storage.local.set({ distortionValue: OPTIMUM_DISTORTION });
  chrome.runtime.sendMessage({ islem: "guncelle", deger: OPTIMUM_DISTORTION });
});

baslatBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url.startsWith("chrome://")) {
    alert("You cannot distort audio on Chrome system pages. Please open a normal website like YouTube.");
    return;
  }
  
  // Başlatırken barın o anki değerini de yolluyoruz
  const val = parseInt(slider.value);
  chrome.runtime.sendMessage({ islem: "baslat", tabId: tab.id, distortionValue: val });
});

durdurBtn.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ islem: "durdur" });
});
