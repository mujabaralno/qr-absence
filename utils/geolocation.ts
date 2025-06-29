export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
  
    if (!response.ok) {
      throw new Error("Gagal mengambil alamat dari koordinat");
    }
  
    const data = await response.json();
    return data.display_name ?? "Alamat tidak ditemukan";
  }
  