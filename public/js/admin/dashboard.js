$.ajax({
  url: "/admin/dashboard",
  method: "PUT",
  success: (res) => {
    var orderData = res.data.orderData;
    let totalOrders = [];
    let revenuePerMonth = [];
    let avgBillPerOrder = [];
    let productsPerMonth = [];
    orderData.forEach((order) => {
      totalOrders.push(order.totalOrders);
      revenuePerMonth.push(order.revenue);
      avgBillPerOrder.push(order.avgBillPerOrder);
      productsPerMonth.push(order.totalProducts);
    });
    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Revenue",
            data: revenuePerMonth,
            borderWidth: 1,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
          },
          {
            label: "Avg. Bill per Order",
            data: avgBillPerOrder,
            borderWidth: 1,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgb(255, 159, 64)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const inTransit = res.data.inTransit;
    const cancelled = res.data.cancelled;
    const delivered = res.data.delivered;
    const ctz = document.getElementById("myChart3");
    new Chart(ctz, {
      type: "doughnut",
      data: {
        labels: ["In-Transit", "Delivered", "Cancelled"],
        datasets: [
          {
            label: "Order Status",
            data: [inTransit, delivered, cancelled],

            backgroundColor: [
              "rgb(255, 205, 86,0.9)",
              "rgb(34,139,34,0.9)",
              "rgb(255,80,66,0.9)",
            ],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });

    const cty = document.getElementById("myChart2");
    new Chart(cty, {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Orders",
            data: totalOrders,
            borderWidth: 1,

            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
          },
          {
            label: "Products sold",
            data: productsPerMonth,
            borderWidth: 1,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  },
});

$(function () {
  $("#dataTable").DataTable({
    rowReorder: {
      selector: "td:nth-child(2)",
    },
    responsive: true,
  });
  new $.fn.dataTable.FixedHeader(table);
});
