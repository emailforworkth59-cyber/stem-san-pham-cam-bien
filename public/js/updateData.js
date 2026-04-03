// Bien toan cuc luu tru cac bieu do de khong bi ve de len nhau
const charts = {};

async function updateDashboard() {
  try {
    const response = await fetch("/api/plants-status");
    const plants = await response.json();

    plants.forEach((plant) => {
      // --- (Giữ nguyên phần code cập nhật thông số cũ của bạn ở đây) ---
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
        let statusText = "Ổn định";
        let colorClass = "text-success";
        if (plant.soil_percent < plant.min_threshold) {
          statusText = "Quá khô";
          colorClass = "text-danger";
        } else if (plant.soil_percent > plant.max_threshold) {
          statusText = "Quá ướt";
          colorClass = "text-warning";
        }
        statusEl.innerText = statusText;
        statusEl.className = `status-badge fw-bold mt-2 ${colorClass}`;
      }
      const timeEl = document.getElementById(`time-${plant.device_id}`);
      let timeString = "";
      if (plant.timestamp) {
        // Nếu Database có gửi thời gian về thì dùng thời gian đó
        timeString = new Date(plant.timestamp).toLocaleTimeString("vi-VN");
      } else {
        // Nếu Database không có thời gian, lấy luôn thời gian hiện tại của máy tính để vẽ biểu đồ
        timeString = new Date().toLocaleTimeString("vi-VN");
      }

      const canvasId = `chart-${plant.device_id}`;
      const canvasEl = document.getElementById(canvasId);

      if (canvasEl) {
        // Neu bieu do cua thiet bi nay chua duoc khoi tao, ta se tao moi
        if (!charts[canvasId]) {
          const ctx = canvasEl.getContext("2d");
          charts[canvasId] = new Chart(ctx, {
            type: "line",
            data: {
              labels: [],
              datasets: [
                {
                  label: "Do am (%)",
                  data: [],
                  borderColor: "#0dcaf0",
                  tension: 0.3,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              scales: { y: { min: 0, max: 100 } },
            },
          });
        }

        const chart = charts[canvasId];
        const timeString = new Date(plant.timestamp).toLocaleTimeString(
          "vi-VN",
        );
        if (
          chart.data.labels.length === 0 ||
          chart.data.labels[chart.data.labels.length - 1] !== timeString
        ) {
          chart.data.labels.push(timeString);
          chart.data.datasets[0].data.push(plant.soil_percent);

          // Giu lai toi da 10 diem du lieu gan nhat cho de nhin
          if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
          }
          chart.update();
        }
      }
    });
  } catch (err) {
    console.error("Lỗi lấy dữ liệu API:", err);
  }
}

updateDashboard();
setInterval(updateDashboard, 3000);
