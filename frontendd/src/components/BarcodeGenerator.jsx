import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import Select from 'react-select';
import { districts, products, data } from '../datas/data';
import './BarcodeGenerator.css';
import { useNavigate } from "react-router-dom";

const BarcodeGenerator = () => {
     const navigate = useNavigate();
  const [district, setDistrict] = useState('01');
  const [godown, setGodown] = useState('');
  const [pdsShop, setPdsShop] = useState('000');
  const [product, setProduct] = useState('01');
  const [weight, setWeight] = useState('1');
  const [date, setDate] = useState('');
  const [startCount, setStartCount] = useState('0');
  const [endCount, setEndCount] = useState('0');
  const [barcodes, setBarcodes] = useState([]);

  const [godownOptions, setGodownOptions] = useState([]);
  const [pdsOptions, setPdsOptions] = useState([]);

  useEffect(() => {
    updateGodowns();
  }, [district]);

  useEffect(() => {
    updatePDS();
  }, [district, godown]);

  const updateGodowns = () => {
    if (data[district]) {
      const sortedGodowns = Object.entries(data[district])
        .sort(([, a], [, b]) => a.Godown.localeCompare(b.Godown))
        .map(([id, godown]) => ({
          value: id,
          label: godown.Godown
        }));
      setGodownOptions(sortedGodowns);
      setGodown(sortedGodowns[0]?.value || '');
    } else {
      setGodownOptions([]);
      setGodown('');
    }
  };

  const updatePDS = () => {
    if (data[district] && data[district][godown]) {
      const sortedPDS = Object.entries(data[district][godown].PDS_Shops)
        .sort(([idA], [idB]) => parseInt(idA) - parseInt(idB))
        .map(([id, name]) => ({
          value: id,
          label: `${id} - ${name}`
        }));
      setPdsOptions([{ value: '000', label: 'None' }, ...sortedPDS]);
    } else {
      setPdsOptions([{ value: '000', label: 'None' }]);
    }
  };

  const generateBarcodes = () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    const dateParts = date.split('-');
    const formattedDate = dateParts[2] + dateParts[1] + dateParts[0];
    const weightFormatted = weight.padStart(2, '0');
    const newBarcodes = [];

    for (let count = parseInt(startCount); count <= parseInt(endCount); count++) {
      const countFormatted = count.toString().padStart(4, '0');
      const barcodeData = `${district}${godown}${pdsShop}${product}${weightFormatted}${formattedDate}${countFormatted}`;
      newBarcodes.push(barcodeData);
    }

    setBarcodes(newBarcodes);

    setTimeout(() => {
      newBarcodes.forEach((barcode, index) => {
        JsBarcode(`#barcode-${index}`, barcode, {
          format: 'CODE128',
          lineColor: '#000',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 10
        });
      });
    }, 0);
  };

  const printBarcodes = () => {
    if (barcodes.length === 0) {
      alert('Please generate barcodes first');
      return;
    }

    const content = document.getElementById('barcode-container').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              #barcode-container { display: flex; flex-direction: column; gap: 20px; }
              .barcode-item { text-align: center; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="barcode-generator">
           <h2>
          Alagappa Chettiar Government College of Engineering & Technology,
          Karaikudi
        </h2>
        <p className="proTitle" >
        Project Title: <strong>PDS Goods Theft Prevention System</strong>
      </p>
      <div className="form-group">
        <label>🏞️ District</label>
        <Select
          options={districts}
          value={districts.find(d => d.value === district)}
          onChange={(option) => setDistrict(option.value)}
          className="label"
        />
      </div>

      <div className="form-group">
        <label>🏢 Godown</label>
        <Select
          options={godownOptions}
          value={godownOptions.find(g => g.value === godown)}
          onChange={(option) => setGodown(option.value)}
          className="label"
        />
      </div>

      <div className="form-group">
        <label>🏪 PDS Shop</label>
        <Select
          options={pdsOptions}
          value={pdsOptions.find(p => p.value === pdsShop)}
          onChange={(option) => setPdsShop(option.value)}
          className="label"
        />
      </div>

      <div className="form-group">
        <label>📦 Product</label>
        <Select
          options={products}
          value={products.find(p => p.value === product)}
          onChange={(option) => setProduct(option.value)}
          className="label"
        />
      </div>

      <div className="form-group">
        <label>⚖️ Weight (1-99)</label>
        <input
          type="number"
          min="1"
          max="99"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>📅 Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>🟢 Start Count</label>
        <input
          type="number"
          min="0"
          max="9999"
          value={startCount}
          onChange={(e) => setStartCount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>🔴 End Count </label>
        <input
          type="number"
          min="0"
          max="9999"
          value={endCount}
          onChange={(e) => setEndCount(e.target.value)}
        />
      </div>

      <button onClick={generateBarcodes}>Generate Barcodes</button>
      <button onClick={printBarcodes}>Print Barcodes</button>

      <div id="barcode-container" className="barcode-container">
        {barcodes.map((barcode, index) => (
          <div key={index} className="barcode-item">
            <svg id={`barcode-${index}`}></svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarcodeGenerator;