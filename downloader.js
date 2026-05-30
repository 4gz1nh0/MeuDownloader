/**
 * Lógica centralizada no GitHub
 */
function processarDownload(url, formato, titulo) {
  var data = new Date();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Payload para o yt-dlp via API Cobalt (estável)
  var payload = {
    url: url,
    vQuality: formato !== "mp3" ? formato : "720",
    isAudioOnly: formato === "mp3",
    aFormat: formato === "mp3" ? "mp3" : "best",
    filenamePattern: "classic"
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch("https://api.cobalt.tools/", options);
    var json = JSON.parse(response.getContentText());

    if (json.url) {
      sheet.appendRow([data, url, titulo, formato.toUpperCase(), json.url, "SUCESSO"]);
      return { sucesso: true, url: json.url };
    } else {
      return { sucesso: false, erro: "Erro na API: " + JSON.stringify(json) };
    }
  } catch (e) {
    return { sucesso: false, erro: "Exceção: " + e.message };
  }
}