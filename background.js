chrome.runtime.onMessage.addListener(async (mesaj) => {
  
  if (mesaj.islem === "baslat") {
    const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'To distort tab audio for simulation effects'
      });
    }

    chrome.tabCapture.getMediaStreamId({ targetTabId: mesaj.tabId }, (streamId) => {
      if (chrome.runtime.lastError) {
        console.warn("Capture Error:", chrome.runtime.lastError.message);
        return; 
      }
      
      // GÖRSEL GERİ BİLDİRİM: İkonun üzerine kırmızı "ON" rozeti ekle
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#ff4757" });

      chrome.runtime.sendMessage({ 
        hedef: 'offscreen', 
        islem: 'sesi-boz', 
        streamId: streamId,
        distortionValue: mesaj.distortionValue
      });
    });
  }

  if (mesaj.islem === "durdur") {
    // GÖRSEL GERİ BİLDİRİM: Sesi durdurduğumuzda rozeti temizle
    chrome.action.setBadgeText({ text: "" });

    chrome.runtime.sendMessage({ hedef: 'offscreen', islem: 'sesi-durdur' });
  }

  // Bar kaydırıldığında sesi canlı güncelleme emrini aktar
  if (mesaj.islem === "guncelle") {
    chrome.runtime.sendMessage({ hedef: 'offscreen', islem: 'sesi-guncelle', deger: mesaj.deger });
  }
});
