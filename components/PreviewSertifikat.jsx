// components/SertifikatPreview.jsx
import React from "react";

export default function SertifikatPreview({ template }) {
  if (!template) return null;

  return (
    <div
      className="relative"
      style={{
        width: "100%",
        maxWidth: "700px",
        aspectRatio: "16 / 11", // Ukuran rasio landscape A4
        backgroundImage: `url(${template.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#ffffff", // Fallback background putih
        border: "1px solid #ccc",
      }}
    >
      {/* Logo BPS dan tulisan */}
      <div style={{ position: "absolute", top: "15px", left: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/uploads/logobps.png"
          alt="Logo Kiri"
          style={{
            // top: "15px",
            // left: "20px",
            width: "60px", 
            height: "auto",
          }}
        />
        <div
          style={{
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontStyle: "italic",
            textTransform: "uppercase",
            fontSize: "8px",
            lineHeight: "1.5",
            left: "5px",
            marginTop: "-10px",
            marginLeft: "-3px",
          }}
        >
          <div>BADAN PUSAT STATISTIK</div>
          <div>KOTA BANDAR LAMPUNG</div>
        </div>
      </div>
💡

      {/* Logo Berakhlak  */}
      <img
        src="/uploads/logoberakhlak.png"
        alt="Logo Kanan 1"
        style={{
          position: "absolute",
          top: "15px",
          right: "100px",
          width: "78px",
        }}
      />

      {/* Logo melayani bangsa */}
      <img
        src="/uploads/logomelayani.png"
        alt="Logo Kanan 2"
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          width: "70px",
        }}
      />

      {template.elements.map((el) => (
        <div
          key={el.id}
          style={{
            position: "absolute",
            top: el.top ? `${el.top}px` : "0px",
            left: el.left ? `${el.left}%` : "0%",
            transform: el.transform || "translateX(-50%)",
            fontSize: el.fontSize ? `${el.fontSize}px` : "16px",
            fontWeight: el.fontWeight || "normal",
            fontFamily: el.fontFamily || "inherit",
            maxWidth: el.maxWidth || "500px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.4",
            textAlign: el.textAlign || "center",
            ...(el.label === "Jabatan" && {
              width: "190px", // Lebih kecil lagi
              minWidth: "190px", // Tambah minWidth
              maxWidth: "190px", // Tambah maxWidth
              display: "block", // Ganti ke block
              wordWrap: "break-word", // Ganti cara word wrap
              whiteSpace: "normal", // Ganti ke normal untuk wrap otomatis
            }),
          }}
        >
          {el.value}
        </div>
      ))}
    </div>
  );
}
