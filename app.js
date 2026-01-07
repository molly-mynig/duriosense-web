const firebaseURL =
  "https://duriosense-57a90-default-rtdb.asia-southeast1.firebasedatabase.app/duriosense/tree1/history.json";

fetch(firebaseURL)
  .then(res => res.json())
  .then(data => {

    const keys = Object.keys(data).slice(-10);
    const labels = [];

    const tempData = [];
    const humData = [];
    const soilData = [];
    const circData = [];

    keys.forEach(k => {
      const d = data[k];
      labels.push(new Date(d.timestamp).toLocaleTimeString());
      tempData.push(d.temperature);
      humData.push(d.humidity);
      soilData.push(d.soil);
      circData.push(d.circumference);
    });

    const latest = data[keys[keys.length - 1]];

// ===== TREE HEALTH ALERT LOGIC WITH SEVERITY =====
let alerts = [];
let severity = "green";
let action = "Monitoring conditions are normal.";

// Temperature
if (latest.temperature > 35) {
  alerts.push("🌡 High temperature may cause heat stress and flower drop.");
  severity = "red";
  action = "Provide shade and ensure sufficient irrigation.";
}
else if (latest.temperature < 22) {
  alerts.push("🌡 Low temperature may slow tree growth.");
  severity = "orange";
  action = "Monitor temperature conditions closely.";
}

// Humidity
if (latest.humidity > 90) {
  alerts.push("💧 High humidity increases fungal disease risk.");
  severity = "orange";
  action = "Improve airflow and monitor disease symptoms.";
}
else if (latest.humidity < 50) {
  alerts.push("💧 Low humidity may cause leaf dryness.");
  severity = "orange";
  action = "Ensure adequate watering and shading.";
}

// Soil Moisture
if (latest.soil < 30) {
  alerts.push("🌱 Low soil moisture may cause water stress.");
  severity = "red";
  action = "Irrigate immediately.";
}
else if (latest.soil > 80) {
  alerts.push("🌱 Excess soil moisture may cause root rot.");
  severity = "red";
  action = "Improve drainage and reduce watering.";
}

// Rain + Soil
if (latest.rain === "RAINING" && latest.soil > 80) {
  alerts.push("🌧 Continuous rain with saturated soil may cause waterlogging.");
  severity = "red";
  action = "Check drainage and prevent standing water.";
}

if (alerts.length > 0) {
  showAlert(alerts.join("\n\n"), severity, action);
}

    document.getElementById("treeType").innerText = latest.tree_type;
    document.getElementById("treeMeta").innerText =
  "Planting Date: " + latest.planting_date + " | Tree Age: " + latest.tree_age + " years";
    document.getElementById("temp").innerText = latest.temperature + " °C";
    document.getElementById("hum").innerText = latest.humidity + " %";
    document.getElementById("soil").innerText = latest.soil + " %";
    document.getElementById("circ").innerText = latest.circumference + " cm";
    document.getElementById("rain").innerText =
      latest.rain === "RAINING" ? "🌧 RAINING" : "☀ NO RAIN";
    document.getElementById("time").innerText =
      new Date(latest.timestamp).toLocaleString();
// SIMPLE WEATHER STATUS
let weatherText = "";

if (latest.rain === "RAINING") {
  weatherText = "🌧 Raining";
}
else if (latest.humidity > 80) {
  weatherText = "☁ Cloudy / Humid";
}
else {
  weatherText = "☀ Sunny";
}

document.getElementById("simpleWeather").innerText = weatherText;

    new Chart(tempChart, {
      type: "line",
      data: { labels, datasets: [{ data: tempData, borderColor: "#ff4d4d", tension: 0.3 }] }
    });

    new Chart(humChart, {
      type: "line",
      data: { labels, datasets: [{ data: humData, borderColor: "#3399ff", tension: 0.3 }] }
    });

    new Chart(soilChart, {
      type: "line",
      data: { labels, datasets: [{ data: soilData, borderColor: "#28a745", tension: 0.3 }] }
    });

    new Chart(circChart, {
      type: "line",
      data: { labels, datasets: [{ data: circData, borderColor: "#ffcc00", tension: 0.3 }] }
    });

  });
  // ===== ALERT POPUP FUNCTIONS =====
function showAlert(message, severity, action) {
  const popup = document.getElementById("alertPopup");
  const box = popup.querySelector(".alert-box");

  box.className = "alert-box " + severity;
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("alertAction").innerText =
    "Recommended Action: " + action;

  popup.style.display = "flex";
}

function closeAlert() {
  document.getElementById("alertPopup").style.display = "none";
}


  
