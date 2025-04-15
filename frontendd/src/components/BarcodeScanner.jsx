import { useState, useEffect } from "react";

const BarcodeScanner = ({ setScannedBarcode }) => {
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scannedData = "";
    let timer = null;

    const handleKeyPress = (event) => {
      if (!scanning) setScanning(true);

      if (event.key === "Enter") {
        setBarcode(scannedData);
        setScannedBarcode(scannedData); // Send scanned barcode to parent (PDSPage)
        console.log("Scanned Barcode:", scannedData);
        scannedData = "";
        setScanning(false);
      } else {
        scannedData += event.key;
        clearTimeout(timer);
        timer = setTimeout(() => {
          scannedData = "";
          setScanning(false);
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setScannedBarcode]);

  // 🔄 Auto-clear barcode after 2 seconds
  useEffect(() => {
    if (barcode) {
      const clearTimer = setTimeout(() => {
        setBarcode(""); // Clear the display after 2 seconds
      }, 1000);

      return () => clearTimeout(clearTimer);
    }
  }, [barcode]);

  return (
    <div>
      <p>{barcode ? `Scanned: ${barcode}` : "Waiting for scan..."}</p>
    </div>
  );
};

export default BarcodeScanner;
