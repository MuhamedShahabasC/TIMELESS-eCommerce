function reduceCount(productID, i) {
  $.ajax({
    url: "/users/cart/count",
    method: "delete",
    data: { id: productID },
    success: (res) => {
      $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
      $(`#totalItems`).html(res.data.userCart.totalQuantity);
      $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
    },
  });
}

function addCount(productID, i) {
  $.ajax({
    url: "/users/cart/count",
    method: "put",
    data: { id: productID },
    success: (res) => {
      $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
      $(`#totalItems`).html(res.data.userCart.totalQuantity);
      $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
    },
  });
}

function removeFromCart(productID) {
  $.ajax({
    url: "/users/cart",
    method: "delete",
    data: {
      id: productID,
    },
    success: (res) => {
      if (res.success === "removed") {
        $("#cart").load(location.href + " #cart");
        Swal.fire({
          toast: true,
          icon: "error",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Removed from cart",
        });
      }
    },
  });
}
