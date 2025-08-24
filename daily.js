window.addEventListener('DOMContentLoaded', () => {
  // ===== Firebase configuration =====
  const firebaseConfig = {
    databaseURL: "https://tempval-6f873-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const ref = db.ref("sensor_data");

  const tableBody = document.querySelector("#dailyTable tbody");
  const ctx = document.getElementById('dailyChart').getContext('2d');

  const dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: '#1e88e5',
          fill: false,
          tension: 0.2
        },
        {
          label: 'IR Sensor',
          data: [],
          borderColor: '#e53935',
          fill: false,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false },
        y1: { beginAtZero: true },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });

  // ===== Fetch last hour data =====
  ref.limitToLast(60).get().then(snapshot => {
    const dataObj = snapshot.val();
    if (!dataObj) return;

    Object.values(dataObj).forEach(data => {
      const timeLabel = data.timestamp.split(" ")[1];
      const temp = Number(data.temperature);
      const ir = Number(data.ir);

      // Table
      const row = document.createElement("tr");
      row.innerHTML = `<td>${timeLabel}</td><td>${temp.toFixed(1)}</td><td>${ir}</td>`;
      tableBody.appendChild(row);

      // Chart
      dailyChart.data.labels.push(timeLabel);
      dailyChart.data.datasets[0].data.push(temp);
      dailyChart.data.datasets[1].data.push(ir);
    });

    dailyChart.update();
  });
});
