import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { upload } from '../app/authentication.js';

function PricesPopup(props) {
  const { t } = useTranslation();

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
          <th>{t('Webinar_Length')}</th>
          <th>{t('Recommended_Price')}</th>
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
  const { t } = useTranslation();
  const [modalShown, toggleModal] = React.useState(false);
  const [fileType, setFileType] = useState("MP4");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState("None");
  const [certified, setCertify] = useState(false);
  const [button, setButton] = useState("Upload");

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  }

  const handleSubmit = async () => {
    console.log(fileType, title, description, price, category);
    if (title.length > 30) alert('Title length must not exceed 30 characters');
    else if (title.includes("/")) alert('Title must not contain "/"');
    else {
      setButton("Uploading...");
      const response = await upload(fileType, title, description, price, category, language);
      console.log(response);
      setButton("Upload");
    }
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
        <h1>{t('Share_your_knowledge')}</h1><br />
        <label>{t('Video')} :
          <input name="videoUpload" type="file" id="videoUpload" />
          <select style={{ display: 'none' }} id="fileType" value={fileType} onChange={handleFileTypeChange}>
            <option value="MP4">MP4</option>
            <option value="MOV">MOV</option>
          </select>
        </label><br />
        <i style={{ fontSize: '12px' }}>{t('minimum_2_mins_in_length')}</i>

        <label style={{ display: 'none' }}>Thumbnail:
          <input type="file" name="thumbnailUpload" id="videoThumbnail" />
        </label><br /><br />

        <input class="in" name="title" placeholder={t('Title')} type="text" onChange={(e) => setTitle(e.target.value)} required />
        <br /><br />

        <textArea class="in" name="description" placeholder={t('Description')} type="text" onChange={(e) => setDescription(e.target.value)} />
        <br /><br />

        <input class="in" name="amount" placeholder={t('Set_a_price')} type="number" onChange={(e) => setPrice(e.target.value)} /><br />

        <i onClick={() => {
          toggleModal(!modalShown);
        }}
        >{t('See_Price_Guide')}</i>
        <br /><br />
        {modalShown ?
          <PricesPopup
            close={() => {
              toggleModal(!modalShown);
            }}
          />
          : null
        }

        <label>{t('Language_of_webinar')}:
          <select style={{ marginLeft: '10px' }} value={language} onChange={handleLanguageChange}>
            <option name="language" value="en">English</option><br />
            <option name="language" value="es">Español</option><br />
            <option name="language" value="kr">한국어</option><br />
            <option name="language" value="hi">हिन्दी</option><br />
            <option name="category" value="zh">中文</option><br />
            <option name="category" value="vi">Tiếng Việt</option><br />
            <option name="category" value="id">Indonesian</option><br />
            <option name="category" value="other">{t('Other')}</option><br />
          </select>
        </label><br /><br />

        <label>{t('Select_a_category')}:
          <select style={{ marginLeft: '10px' }} value={category} onChange={handleCategoryChange}>
            <option name="category" value="none">{t('None')}</option><br />
            <option name="category" value="cryptocurrency">{t('Cryptocurrency')}</option><br />
            <option name="category" value="education">{t('Education')}</option><br />
            <option name="category" value="fitness">{t('Fitness')}</option><br />
            <option name="category" value="food">{t('Food')}</option><br />
            <option name="category" value="history">{t('History')}</option><br />
            <option name="category" value="money">{t('Money')}</option><br />
            <option name="category" value="nature">{t('Nature')}</option><br />
            <option name="category" value="pi-network">{t('Pi Network')}</option><br />
            <option name="category" value="politics">{t('Politics')}</option><br />
            <option name="category" value="sports">{t('Sports')}</option><br />
            <option name="category" value="technology">{t('Technology')}</option><br />
          </select>
        </label><br /><br />

        <div>
          <input type="checkbox" onChange={handleCertified} id="certify" required></input>
          <label for="certify"> {t('I_certify_that_I_own_this_content')}</label><br />
        </div><br />

        {localStorage.userSession ? <input type="button" id="submitBtn" value={button} onClick={handleSubmit}></input> : <p>{t('Please_login_to_upload!')}</p>}
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