const dialog = document.getElementById("myDialog");
const openButton = document.getElementById("openDialog");
const closeButton = document.getElementById("closeDialog");

openButton.addEventListener("click", () => {
  console.log("exampledialog click open");
  dialog.showModal(); // Opens as a modal dialog
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
