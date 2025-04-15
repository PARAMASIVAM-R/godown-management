import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "../components/BarcodeScanner";
import CompleteData from "../datas/all pds/CompleteData";
import "./PDSDashboard.css"; // Assuming you have a CSS file for styling

const itemList = [
  { id: 1, name: "Rice - General" },
  { id: 2, name: "Rice - AAY" },
  { id: 3, name: "Rice - PHH" },
  { id: 4, name: "Sugar" },
  { id: 5, name: "Wheat" },
  { id: 6, name: "Kerosene" },
  { id: 7, name: "Toor Dhall" },
  { id: 8, name: "Urad Dhall" },
  { id: 9, name: "Palm Oil" },
  { id: 10, name: "ANP Rice" },
  { id: 11, name: "OAP Rice" },
  { id: 12, name: "Fortified Rice" },
  { id: 13, name: "Masoor Dhal" },
  { id: 14, name: "Moong Dal" },
  { id: 15, name: "Bajra" },
  { id: 16, name: "Jowar" },
  { id: 17, name: "Maize" },
  { id: 18, name: "Salt" },
  { id: 19, name: "Ragi" },
  { id: 20, name: "Mustard Oil" },
  { id: 21, name: "Chana Dal" },
  { id: 22, name: "Besan (Gram Flour)" },
  { id: 23, name: "Atta (Wheat Flour)" },
  { id: 24, name: "Milk Powder" },
  { id: 25, name: "Soybean" },
  { id: 26, name: "Groundnut Oil" },
  { id: 27, name: "Jaggery" },
  { id: 28, name: "Tea Leaves" },
  { id: 29, name: "Coffee Powder" },
  { id: 30, name: "Green Gram" },
  { id: 31, name: "Pongal Rice" },
  { id: 32, name: "Pongal Jaggery" },
  { id: 33, name: "Pongal Ghee" },
  { id: 34, name: "Cashew Nuts" },
  { id: 35, name: "Raisins (Dry Grapes)" },
  { id: 36, name: "Cardamom" },
  { id: 37, name: "Pongal Moong Dal" },
];

const PDSDashboard = () => {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");
  const [decodedDataList, setDecodedDataList] = useState([]);
  const [data, setData] = useState({ products: [] });
  const [godownData, setGodownData] = useState('');
  const [toggleState, setToggleState] = useState({
    addProduct: false,
    removeProduct: false,
  });

  const decodeBarcode = (barcode) => {
    if (!barcode || barcode.length !== 23) {
      console.error("Invalid barcode length!");
      return null;
    }

    const districtCode = barcode.substring(0, 2);
    const godownCode = barcode.substring(2, 4);
    const pdsCode = barcode.substring(4, 7);
    const productCode = barcode.substring(7, 9);
    const weight = barcode.substring(9, 11);
    const date = barcode.substring(11, 13);
    const month = barcode.substring(13, 15);
    const year = barcode.substring(15, 19);
    const count = barcode.substring(19, 23);

    const districtData = CompleteData[districtCode];
    const district = typeof districtData === "string"
      ? districtData
      : districtData?.District_Name || "Unknown District";
    const godown = districtData?.Godowns?.[godownCode]?.Godown || "Unknown Godown";
    const pdsShop = districtData?.Godowns?.[godownCode]?.PDS_Shops?.[pdsCode] || "Unknown PDS Shop";
    const product = itemList.find((item) => item.id === parseInt(productCode))?.name || "Unknown Product";

    return {
      district,
      godown,
      pdsShop,
      product,
      weight,
      date,
      month,
      year,
      barcodeCount: parseInt(count),
      barcode,
    };
  };

  const handleBarcodeScan = (scannedBarcode) => {
    if (scannedBarcode && scannedBarcode !== barcode) {
      setBarcode(scannedBarcode);

      const isDuplicate = decodedDataList.some((item) =>
        item.barcodes.includes(scannedBarcode)
      );
      if (isDuplicate) {
        console.log(`Duplicate barcode detected: ${scannedBarcode}`);
        return;
      }

      const decodedData = decodeBarcode(scannedBarcode);
      if (decodedData) {
        setDecodedDataList((prevData) => {
          const existingProduct = prevData.find(
            (item) => item.product === decodedData.product && item.weight === decodedData.weight
          );
          if (existingProduct) {
            if (!existingProduct.barcodes.includes(scannedBarcode)) {
              existingProduct.barcodes.push(scannedBarcode);
              existingProduct.totalCount = existingProduct.barcodes.length;
            }
            return [...prevData];
          } else {
            return [
              ...prevData,
              {
                ...decodedData,
                totalCount: 1,
                barcodes: [scannedBarcode],
              },
            ];
          }
        });
      }
    }
  };

  const handleToggle = (key) => {
    setToggleState({
      addProduct: key === "addProduct",
      removeProduct: key === "removeProduct",
    });
  };

  // const addProductToPDS = async (decodedData) => {
  //   const token = sessionStorage.getItem("token");
  //   try {
  //     const response = await fetch("http://localhost:5000/api/pds/add-product", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         productName: decodedData.product,
  //         weight: decodedData.weight,
  //         count: decodedData.totalCount || 1,
  //         date: `${decodedData.year}-${decodedData.month}-${decodedData.date}`,
  //         pdsname:decodedData.pdsShop
  //       }),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       throw new Error(result.error || "Failed to add product to PDS");
  //     }
  //     console.log("Product added to PDS:", result);
  //     setData({ ...result.pds, products: result.pds.products || [] });
  //     setDecodedDataList([]);
  //     alert("Product added to PDS successfully!");
  //   } catch (error) {
  //     console.error("Error adding product to PDS:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };
  const addProductToPDS = async (decodedData) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/pds/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName: decodedData.product,
          weight: decodedData.weight,
          count: decodedData.totalCount || 1,
          date: `${decodedData.year}-${decodedData.month}-${decodedData.date}`,
          pdsname: decodedData.pdsShop
        }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add product to PDS");
      }
  
      console.log("Product added to PDS:", result);
      setData({ ...result.pds, products: result.pds.products || [] });
      alert("Product added to PDS successfully!");
    } catch (error) {
      console.error("Error adding product to PDS:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setDecodedDataList([]);
      setBarcode("");
      setToggleState({ addProduct: false, removeProduct: false });
    }
  };
  
  // const removeProductFromPDS = async (decodedData) => {
  //   const token = sessionStorage.getItem("token");
  //   try {
  //     const response = await fetch("http://localhost:5000/api/pds/remove-product", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         productName: decodedData.product,
  //         date: `${decodedData.year}-${decodedData.month}-${decodedData.date}`,
  //         count: decodedData.totalCount || 1,
  //       }),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       throw new Error(result.error || "Failed to remove product from PDS");
  //     }
  //     console.log("Product removed from PDS:", result);
  //     setData({ ...result.pds, products: result.pds.products || [] });
  //     setDecodedDataList([]);
  //     alert("Product removed from PDS successfully!");
  //   } catch (error) {
  //     console.error("Error removing product from PDS:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };
  
  const removeProductFromPDS = async (decodedData) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/pds/remove-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName: decodedData.product,
          date: `${decodedData.year}-${decodedData.month}-${decodedData.date}`,
          count: decodedData.totalCount || 1,
        }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to remove product from PDS");
      }
  
      console.log("Product removed from PDS:", result);
      setData({ ...result.pds, products: result.pds.products || [] });
      alert("Product removed from PDS successfully!");
    } catch (error) {
      console.error("Error removing product from PDS:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setDecodedDataList([]);
      setBarcode("");
      setToggleState({ addProduct: false, removeProduct: false });
    }
  };
  
  // const handleSubmit = () => {
  //   if (decodedDataList.length === 0) {
  //     alert("Please scan a barcode first!");
  //     return;
  //   }

  //   const latestDecodedData = decodedDataList[decodedDataList.length - 1];
  //   if (toggleState.addProduct) {
  //     addProductToPDS(latestDecodedData);
  //   } else if (toggleState.removeProduct) {
  //     removeProductFromPDS(latestDecodedData);
  //   } else {
  //     alert("Please select an action (Add Product or Remove Product)!");
  //   }
  // };
  
  const handleSubmit = () => {
    if (decodedDataList.length === 0) {
      alert("Please scan a barcode first!");
      return;
    }
  
    const latestDecodedData = decodedDataList[decodedDataList.length - 1];
  
    if (toggleState.addProduct) {
      addProductToPDS(latestDecodedData);
    } else if (toggleState.removeProduct) {
      removeProductFromPDS(latestDecodedData);
    } else {
      alert("Please select an action (Add Product or Remove Product)!");
    }
  };

  
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pds/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch PDS dashboard data");
        }

        const result = await response.json();
        console.log("PDS Dashboard API response:", result);
        setGodownData(result);
        setData({
          pdsId: result.pdsId,
          pdsName: result.pdsName,
          district: result.district,
          linkedGodown: result.linkedGodown,
          products: result.products || [],
        });
      } catch (error) {
        console.error("Error fetching PDS data:", error);
      }
    };

    if (token) {
      fetchData();
    } else {
      console.error("No token found in sessionStorage");
    }
  }, []);

  useEffect(() => {
    if (decodedDataList.length > 0) {
      console.log("Updated decodedDataList:", decodedDataList);
    }
  }, [decodedDataList]);

  return (
    <div className="containerr">
      <div className="dashboard_container">
      <h2>
          Alagappa Chettiar Government College of Engineering & Technology,
          Karaikudi
        </h2>
        <p className="proTitle" >
        Project Title: <strong>Transparent Stock Management in PDS Using GS1-128 FIFO System</strong>
      </p>
        <h2>PDS Incharge Dashboard</h2>
        <div className="button-container">
          <button className="logout" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>

        <div className="pds-details">
          <h3>PDS Incharge Details</h3>
          {godownData ? (
            <ul>

              <li>
                Incharge Name :<strong> {godownData.pdsName || "N/A"}</strong>
              </li>
              <li>
                PDS Location  :<strong> {godownData.pdsId || "N/A"}</strong>
              </li>
              <li>
                Linked Godown :<strong> {godownData.linkedGodown || "N/A"}</strong>
              </li>
              <li>
                District     :<strong> {godownData.district || "N/A"}</strong>
              </li>
            </ul>
          ) : (
            <p>Loading details...</p>
          )}
        </div>
        <div className="row">
        <div className="scanner">
          <h4>Barcode Data</h4>
          {barcode && <p>Scanned Barcode: {barcode}</p>}
          <BarcodeScanner setScannedBarcode={handleBarcodeScan} />
        </div>
        <div className="scanner">
        <div className="toggle-buttons">
          <button
            className={toggleState.addProduct ? "active" : ""}
            onClick={() => handleToggle("addProduct")}
          >
            Add Product
          </button>
          <button
            className={toggleState.removeProduct ? "active" : ""}
            onClick={() => handleToggle("removeProduct")}
          >
            Remove Product
          </button>
        </div>

        <div className="submit-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
        </div>

        </div>
        <div className="scanned-products">
          <h4>Scanned Products</h4>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Weight</th>
                <th>Total Count</th>
              </tr>
            </thead>
            <tbody>
              {decodedDataList.length > 0 ? (
                decodedDataList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.weight}</td>
                    <td>{item.totalCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No products scanned yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* <div className="scanner">
        <div className="toggle-buttons">
          <button
            className={toggleState.addProduct ? "active" : ""}
            onClick={() => handleToggle("addProduct")}
          >
            Add Product
          </button>
          <button
            className={toggleState.removeProduct ? "active" : ""}
            onClick={() => handleToggle("removeProduct")}
          >
            Remove Product
          </button>
        </div>

        <div className="submit-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
        </div> */}

        <div className="transaction-history">
          <h2>Product Inventory</h2>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Weight (kg)</th>
                <th>Count</th>
                <th>Total Count</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.products) && data.products.length > 0 ? (
                data.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productName || "N/A"}</td>
                    <td>{product.weight || "N/A"}</td>
                    <td>{product.count || 0}</td>
                    <td>{product.totalCount || 0}</td>
                    <td>{product.date ? new Date(product.date).toISOString().split('T')[0] : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No product data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PDSDashboard;