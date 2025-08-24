window.addEventListener('DOMContentLoaded', () => {
  // Firebase config
  const firebaseConfig = {
    databaseURL: "https://tempval-6f873-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const ref = db.ref("sensor_data");

  // Elements
  const startBtn = document.getElementById("startBtn");
  const dashboardSection = document.getElementById("dashboardSection");
  const cardsSection = document.getElementById("cardsSection");
  const alarm = document.getElementById("alarmSound");
  const tableBody = document.querySelector("#sensorTable tbody");
  const tempCard = document.getElementById("tempCard");
  const irCard = document.getElementById("irCard");
  const tempEl = document.getElementById("temp");
  const irEl = document.getElementById("ir");

  // Chart setup
  const ctx = document.getElementById('combinedChart').getContext('2d');
  const combinedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Temperature (°C)', data: [], borderColor: '#1e88e5', yAxisID: 'y', fill: false, tension: 0.2 },
        { label: 'IR Sensor', data: [], borderColor: '#e53935', yAxisID: 'y1', fill: false, tension: 0.2 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      scales: {
        y: { type: 'linear', position: 'left', title: { display: true, text: 'Temperature (°C)' } },
        y1: { type: 'linear', position: 'right', title: { display: true, text: 'IR Sensor' }, min: 0, max: 1, grid: { drawOnChartArea: false } },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });

  const TEMP_ALERT_THRESHOLD = 160.0;
  if (Notification.permission !== "granted") Notification.requestPermission();

  startBtn.addEventListener("click", () => {
    dashboardSection.style.display = "flex";
    cardsSection.style.display = "flex";
    startBtn.style.display = "none";

    // Unlock alarm
    alarm.loop = true;
    alarm.volume = 1;
    alarm.load();
    alarm.play().then(() => { alarm.pause(); alarm.currentTime = 0; }).catch(e => console.log("Audio unlock failed:", e));

    startFirebaseListener();
  });

  // Firebase listener every 5 sec
  function startFirebaseListener() {
    setInterval(async () => {
      const snapshot = await ref.limitToLast(1).get();
      const latest = snapshot.val();
      if (!latest) return;

      const key = Object.keys(latest)[0];
      const data = latest[key];

      const tempVal = Number(data.temperature);
      const irVal = Number(data.ir);
      const timeLabel = data.timestamp.split(" ")[1];

      // Update cards
      tempEl.textContent = tempVal.toFixed(1);
      irEl.textContent = irVal;
      tempCard.classList.toggle("alert", tempVal > TEMP_ALERT_THRESHOLD);
      irCard.classList.toggle("alert", irVal !== 1 && irVal !== 0);

      // Alarm
      if (tempVal > TEMP_ALERT_THRESHOLD) alarm.play().catch(e => console.log("Alarm blocked"));
      else { alarm.pause(); alarm.currentTime = 0; }

      // Update table
      const row = document.createElement("tr");
      if (tempVal > TEMP_ALERT_THRESHOLD) row.classList.add("alert");
      row.innerHTML = `<td>${timeLabel}</td><td>${tempVal.toFixed(1)}</td><td>${irVal}</td>`;
      tableBody.appendChild(row);
      if (tableBody.rows.length > 20) tableBody.deleteRow(0);

      // Update chart
      combinedChart.data.labels.push(timeLabel);
      combinedChart.data.datasets[0].data.push(tempVal);
      combinedChart.data.datasets[1].data.push(irVal);
      if (combinedChart.data.labels.length > 20) {
        combinedChart.data.labels.shift();
        combinedChart.data.datasets[0].data.shift();
        combinedChart.data.datasets[1].data.shift();
      }
      combinedChart.update();
    }, 5000);
  }
});


// Sidebar toggle
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const mainContent = document.querySelector('.main-content');

menuBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
  mainContent.classList.add('shifted');
});

closeSidebar.addEventListener('click', () => {
  sidebar.classList.remove('active');
  mainContent.classList.remove('shifted');
});
