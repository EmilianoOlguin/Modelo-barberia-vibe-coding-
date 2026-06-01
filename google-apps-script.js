/**
 * GOOGLE APPS SCRIPT - MULTI-BRANCH VERSION
 * 
 * Este código es el "cerebro" de cada sucursal. 
 * Debes tener un script por cada Google Sheet de cada sucursal.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nueva estructura: Registro, Nombre Cliente, Fecha Turno, Hora Turno, Servicio, Barbero, Sucursal, Teléfono
    sheet.appendRow([
      new Date(),       // A: Registro
      data.name,        // B: Cliente
      data.date,        // C: Fecha Cita
      data.time,        // D: Hora Cita
      data.service,     // E: Servicio
      data.barber,      // F: Barbero
      data.branch,      // G: Sucursal (Nombre)
      data.phone        // H: Teléfono
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var bookings = [];
  
  // Empezamos en i=1 para saltar los encabezados
  for (var i = 1; i < rows.length; i++) {
    bookings.push({
      name: rows[i][1],      // Cliente
      fecha: rows[i][2],     // Fecha Cita
      hora: rows[i][3],      // Hora Cita
      service: rows[i][4],   // Servicio
      barber: rows[i][5],    // Barbero
      branch: rows[i][6],    // Sucursal
      type: rows[i][1] === "BLOQUEADO (ADMIN)" ? "BLOCK" : "BOOKING"
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ "bookings": bookings }))
    .setMimeType(ContentService.MimeType.JSON);
}
