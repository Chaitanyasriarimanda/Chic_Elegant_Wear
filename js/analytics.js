document.addEventListener("DOMContentLoaded", () => {
  const base = window.products || [];
  const local = JSON.parse(localStorage.getItem("localProducts")) || [];

  const combined = [...base, ...local];
  const seen = new Set();
  const allProducts = combined.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  console.log("Base:", base.length, "Local:", local.length, "Deduped:", allProducts.length);

  // Category grouping
  const categoryMap = {};
  allProducts.forEach(p => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { count: 0, total: 0 };
    }
    categoryMap[p.category].count += 1;
    categoryMap[p.category].total += parseFloat(p.price);
  });

  const categories = Object.keys(categoryMap);
  const productCounts = categories.map(c => categoryMap[c].count);
  const totalPrices = categories.map(c => categoryMap[c].total);

  const colorPalette = {
    indian: "#FF6F61",
    western: "#6B5B95",
    kids: "#88B04B",
    accessories: "#F7CAC9",
    default: "#999"
  };
  const colors = categories.map(cat => colorPalette[cat] || colorPalette.default);

  // Bar Chart
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: categories,
      datasets: [{
        label: "# of Products",
        data: productCounts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        categoryPercentage: 0.6,
        barPercentage: 0.7
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Product Count by Category",
          font: { size: 16 }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });

  // Pie Chart
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        label: "Sales ($)",
        data: totalPrices,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Sales Contribution by Category",
          font: { size: 16 }
        }
      }
    }
  });
});
