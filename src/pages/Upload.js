import React, { useState, useEffect } from 'react';
import { upload } from '../app/authentication.js';

function PricesPopup(props) {
  const setClickEvent = () => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        document.removeEventListener('click', close);
        props.close();
      }
    }
    document.addEventListener('click', close);
  }

  useEffect(() => {
    setTimeout(setClickEvent, 500);
  }, []);

  return (
    <div className="popup">
      <table>
        <tr>
          <th>Webinar Length</th>
          <th>Recommended Price</th>
        </tr>
        <tr>
          <th>5-10mins</th>
          <th>0.2 Pi</th>
        </tr>
        <tr>
          <th>10-20mins</th>
          <th>0.5 Pi</th>
        </tr>
        <tr>
          <th>20-40mins</th>
          <th>0.8 Pi</th>
        </tr>
        <tr>
          <th>40-60mins</th>
          <th>1 Pi</th>
        </tr>
      </table>
    </div>
  );
}

function UploadForm() {
  const [modalShown, toggleModal] = React.useState(false);
  const [fileType, setFileType] = useState("MP4");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("None");
  const [certified, setCertify] = useState(false);

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }

  const handleSubmit = async () => {
    console.log(fileType, title, description, price, category);
    const response = await upload(fileType, title, description, price, category);
    console.log(response);
  }

  const handleCertified = async () => {
    setCertify(!certified);
    const btn = document.getElementById("submitBtn");
    btn.disabled = !btn.disabled;
  }

  const setDisabled = () => {
    document.getElementById("submitBtn").disabled = true;
  }
  useEffect(() => {
    if (localStorage.userSession) setTimeout(setDisabled, 0);
  }, []);

  return (
    <>
      <form action="/upload" method="POST" id="form" onSubmit={(e) => e.preventDefault()}>
        <h1>Share your knowledge</h1><br />
        <label>Video :
          <input name="videoUpload" type="file" id="videoUpload" />
          <select style={{ display: 'none' }} id="fileType" value={fileType} onChange={handleFileTypeChange}>
            <option value="MP4">MP4</option>
            <option value="MOV">MOV</option>
          </select>
        </label><br />

        <label style={{ display: 'none' }}>Thumbnail:
          <input type="file" name="thumbnailUpload" id="videoThumbnail" />
        </label><br /><br />

        <input class="in" name="title" placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} required />
        <br /><br />

        <textArea class="in" name="description" placeholder="Description" type="text" onChange={(e) => setDescription(e.target.value)} />
        <br /><br />

        <input class="in" name="amount" placeholder="Set a price" type="number" onChange={(e) => setPrice(e.target.value)} /><br />

        <i onClick={() => {
          toggleModal(!modalShown);
        }}
        >See Price Guide</i>
        <br /><br />
        {modalShown ?
          <PricesPopup
            close={() => {
              toggleModal(!modalShown);
            }}
          />
          : null
        }

        <label>Select category:
          <select value={category} onChange={handleCategoryChange}>
            <option name="category" value="none">None</option><br />
            <option name="category" value="cryptocurrency">Cryptocurrency</option><br />
            <option name="category" value="education">Education</option><br />
            <option name="category" value="fitness">Fitness</option><br />
            <option name="category" value="food">Food</option><br />
            <option name="category" value="history">History</option><br />
            <option name="category" value="money">Money</option><br />
            <option name="category" value="nature">Nature</option><br />
            <option name="category" value="pi-network">Pi Network</option><br />
            <option name="category" value="politics">Politics</option><br />
            <option name="category" value="sports">Sports</option><br />
            <option name="category" value="technology">Technology</option><br />
          </select>
        </label><br /><br />

        <div>
          <input type="checkbox" onChange={handleCertified} id="certify" required></input>
          <label for="certify"> I certify that I own this content</label><br />
        </div><br />

        {localStorage.userSession ? <input type="button" id="submitBtn" value="Upload" onClick={handleSubmit}></input> : <p>Please login to upload!</p>}
        <p id="upload_log"></p>
      </form>
    </>
  );
}

class Upload extends React.Component {
  render() {
    return (
      <>
        <span id="uploadPage">
          <UploadForm />
        </span>
      </>
    );
  }
}

export default Upload;