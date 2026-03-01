async function updateDashboard() {
  try {
    const response = await fetch("/api/plants-status");
    const plants = await response.json();

    plants.forEach((plant) => {
      const moistureEl = document.getElementById(
        `moisture-val-${plant.device_id}`,
      );
      if (moistureEl) {
        const newVal = plant.soil_percent !== null ? plant.soil_percent : "--";

        if (moistureEl.innerText != newVal) {
          moistureEl.innerText = newVal;
        }
      }
      const statusEl = document.getElementById(`status-${plant.device_id}`);
      if (statusEl) {
        let statusText = "🟢 Ổn định";
        let colorClass = "text-success";

        if (plant.soil_percent < plant.min_threshold) {
          statusText = "🔴 Quá khô";
          colorClass = "text-danger";
        } else if (plant.soil_percent > plant.max_threshold) {
          statusText = "🟡 Quá ướt";
          colorClass = "text-warning";
        }

        statusEl.innerText = statusText;
        statusEl.className = `status-badge fw-bold mt-2 ${colorClass}`;
      }
      const timeEl = document.getElementById(`time-${plant.device_id}`);
      if (timeEl && plant.timestamp) {
        timeEl.innerText = new Date(plant.timestamp).toLocaleString("vi-VN");
      }
    });
  } catch (err) {
    console.error("Lỗi lấy dữ liệu API:", err);
  }
}

updateDashboard();
setInterval(updateDashboard, 3000);
