// Ambil data dari file JSON
let barangDatabase = {};
let daftarBelanja = [];

fetch('data-barang.json')
  .then(res => res.json())
  .then(data => {
    barangDatabase = data;
  });

function formatRupiah(angka) {
  return 'Rp. ' + angka.toLocaleString('id-ID');
}

function tambahBarang() {
  let kode = document.getElementById('barcode').value.trim().toLowerCase().replace(/\s+/g, '-');
  const barang = barangDatabase[kode];
  if (barang) {
    daftarBelanja.push(barang);
    updateTabel();
    document.getElementById('barcode').value = '';
  } else {
    alert("Barang tidak ditemukan.");
  }
}

function updateTabel() {
  const tbody = document.querySelector('#daftarBarang tbody');
  tbody.innerHTML = '';
  let total = 0;
  daftarBelanja.forEach((item, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${formatRupiah(item.harga)}</td>
      <td><button onclick="hapusBarang(${i})">Hapus</button></td>
    `;
    tbody.appendChild(row);
    total += item.harga;
  });
  document.getElementById('totalHarga').textContent = formatRupiah(total);
}

function hapusBarang(index) {
  daftarBelanja.splice(index, 1);
  updateTabel();
}

function resetTransaksi() {
  daftarBelanja = [];
  updateTabel();
  document.getElementById('strukArea').style.display = 'none';
}

function cetakStruk() {
  const namaKasir = document.getElementById('namaKasir').value.trim();
  const namaPelanggan = document.getElementById('namaPelanggan').value.trim();
  const uangPelanggan = parseInt(document.getElementById('uangPelanggan').value);
  const pajakPersen = parseInt(document.getElementById('pajakOpsi').value);

  if (!namaKasir || !namaPelanggan || isNaN(uangPelanggan)) {
    alert("Harap isi semua data kasir, pelanggan, dan uang.");
    return;
  }

  let total = daftarBelanja.reduce((sum, b) => sum + b.harga, 0);
  const pajak = Math.round((pajakPersen / 100) * total);
  const totalAkhir = total + pajak;
  const kembalian = uangPelanggan - totalAkhir;

  if (kembalian < 0) {
    alert("Uang pelanggan kurang!");
    return;
  }

  let struk = '';
  struk += 'QiyaAzka Mart\n';
  struk += '--------------------------\n';
  struk += `Kasir: ${namaKasir}\n`;
  struk += `Pelanggan: ${namaPelanggan}\n`;
  struk += '--------------------------\n';

  daftarBelanja.forEach(item => {
    struk += `${item.nama.padEnd(15)} ${formatRupiah(item.harga)}\n`;
  });

  struk += '--------------------------\n';
  struk += `Total Belanja : ${formatRupiah(total)}\n`;
  struk += `Pajak ${pajakPersen}%    : ${formatRupiah(pajak)}\n`;
  struk += `Uang Pelanggan: ${formatRupiah(uangPelanggan)}\n`;
  struk += `Kembalian     : ${formatRupiah(kembalian)}\n`;
  struk += '--------------------------\n';
  struk += 'Terima Kasih! Di Tunggu kedatangannya kembali\n';

  document.getElementById('strukTeks').textContent = struk;
  document.getElementById('strukArea').style.display = 'block';

  setTimeout(() => window.print(), 300);
}

function salinStruk() {
  const struk = document.getElementById("strukTeks").textContent;
  navigator.clipboard.writeText(struk).then(() => {
    alert("Struk berhasil disalin. Tempel di aplikasi seperti RawBT untuk mencetak.");
  }).catch(() => {
    alert("Gagal menyalin struk.");
  });
}
