// Este arquivo lida com a busca e processamento
function processarDownload(url, formato, titulo) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
      sheet.appendRow([new Date(), url, titulo, formato.toUpperCase(), json.url, "SUCESSO"]);
      return { sucesso: true, url: json.url };
    }
    return { sucesso: false, erro: "API retornou: " + JSON.stringify(json) };
  } catch (e) {
    return { sucesso: false, erro: e.message };
  }
}

function buscarMetadados(url) {
  var res = UrlFetchApp.fetch("https://noembed.com/embed?url=" + encodeURIComponent(url), {muteHttpExceptions: true});
  return JSON.parse(res.getContentText());
}
