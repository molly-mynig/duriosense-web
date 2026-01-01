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
      labels.push(new Date(data[k].timestamp).toLocaleTimeString());
      tempData.push(data[k].temperature);
      humData.push(data[k].humidity);
      soilData.push(data[k].soil);
      circData.push(data[k].circumference);
    });

    const latest = data[keys[keys.length - 1]];

    document.getElementById("treeType").innerText = latest.tree_type;
    document.getElementById("temp").innerText = latest.temperature + " °C";
    document.getElementById("hum").innerText = latest.humidity + " %";
    document.getElementById("soil").innerText = latest.soil + " %";
    document.getElementById("circ").innerText = latest.circumference + " cm";

    /* ADDED */
    document.getElementById("plantingDate").innerText = latest.planting_date;
    document.getElementById("treeAge").innerText = latest.tree_age + " years";

    document.getElementById("rain").innerText =
      latest.rain === "RAINING" ? "🌧 RAINING" : "☀ NO RAIN";

    document.getElementById("time").innerText =
      new Date(latest.timestamp).toLocaleString();

    new Chart(soilChart, {
      type: "line",
      data: { labels, datasets: [{ data: soilData, tension: 0.3 }] }
    });

    new Chart(circChart, {
      type: "line",
      data: { labels, datasets: [{ data: circData, tension: 0.3 }] }
    });
  });

function closeAlert() {
  document.getElementById("alertPopup").style.display = "none";
}
