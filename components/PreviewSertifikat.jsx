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
        border: "1px solid #ccc",
        
      }}
    >
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
