let mevcutStream = null;
let audioCtx = null;
let distortionFiltresi = null; // Canlı değiştirebilmek için filtreyi dışarıya tanımladık

chrome.runtime.onMessage.addListener(async (mesaj) => {
  if (mesaj.hedef === 'offscreen') {
    
    if (mesaj.islem === 'sesi-boz') {
      sesiSifirla();

      mevcutStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: mesaj.streamId }
        }
      });

      audioCtx = new AudioContext();
      const kaynak = audioCtx.createMediaStreamSource(mevcutStream);

      const basArtirici = audioCtx.createBiquadFilter();
      basArtirici.type = 'lowshelf';
      basArtirici.frequency.value = 160;
      basArtirici.gain.value = 28;

      distortionFiltresi = audioCtx.createWaveShaper();
      // Popup'tan gelen değeri (veya yoksayılan 450'yi) kullanarak kırpma eğrisini oluştur
      distortionFiltresi.curve = egrilikOlustur(mesaj.distortionValue || 450);
      distortionFiltresi.oversample = '4x';

      kaynak.connect(basArtirici);
      basArtirici.connect(distortionFiltresi);
      distortionFiltresi.connect(audioCtx.destination);
    }

    if (mesaj.islem === 'sesi-durdur') {
      sesiSifirla();
    }

    // Bar kaydırıldıkça bu kod çalışır ve sesi canlı olarak değiştirir
    if (mesaj.islem === 'sesi-guncelle') {
      if (distortionFiltresi) {
        distortionFiltresi.curve = egrilikOlustur(mesaj.deger);
      }
    }
  }
});

function sesiSifirla() {
  if (mevcutStream) {
    mevcutStream.getTracks().forEach(track => track.stop());
    mevcutStream = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  distortionFiltresi = null;
}

function egrilikOlustur(miktar) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    let x = i * 2 / n_samples - 1;
    curve[i] = (3 + miktar) * x * 20 * deg / (Math.PI + miktar * Math.abs(x));
  }
  return curve;
}
