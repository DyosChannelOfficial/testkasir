let barangDatabase = JSON.parse(localStorage.getItem("barangDatabase")) || {};

function simpanKeLocalStorage() {
  localStorage.setItem("barangDatabase", JSON.stringify(barangDatabase));
}

function renderTabel() {
  const tbody = document.querySelector("#tabelBarang tbody");
  tbody.innerHTML = "";

  Object.keys(barangDatabase).forEach((kode) => {
    const barang = barangDatabase[kode];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${kode}</td>
      <td>${barang.nama}</td>
      <td>Rp ${barang.harga}</td>
      <td>
        <button onclick="hapusBarang('${kode}')">Hapus</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function tambahBarang() {
  let kode = document.getElementById("kode").value.trim().toLowerCase();
  const nama = document.getElementById("nama").value.trim();
  const harga = parseInt(document.getElementById("harga").value);

  if (!nama || isNaN(harga)) {
    alert("Nama dan harga harus diisi.");
    return false;
  }

  if (!kode) {
    // Generate kode otomatis dari nama
    kode = nama.toLowerCase().replace(/\s+/g, '-');
  }

  barangDatabase[kode] = { nama, harga };
  simpanKeLocalStorage();
  renderTabel();

  document.getElementById("formBarang").reset();
  return false;
}

function hapusBarang(kode) {
  if (confirm(`Hapus barang dengan kode: ${kode}?`)) {
    delete barangDatabase[kode];
    simpanKeLocalStorage();
    renderTabel();
  }
}

renderTabel();
