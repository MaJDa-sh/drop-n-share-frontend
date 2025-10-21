import Header from "../../components/header/Header";
import "./Profile.css";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button/Button";

const Profile = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [category, setCategory] = useState("")
  const [categoryError, setCategoryError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [profile, setProfile] = useState({
    username: "",
    files: []
  })

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/protected/profile`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          localStorage.removeItem("token")
          console.log('asdf')
          window.location.href = "/"
        } else {
          setProfile(data)
        }
      })
      .catch((error) => {
        localStorage.removeItem("token")
        console.log('fdsa')
        window.location.href = "/"
      });
  }, [])

  const HandleDownload = (fileID, fileName) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/protected/download?id=${fileID}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to download the file.");
        }
      })
      .then((blob) => {
        console.log(blob)
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  const onDrop = useCallback((acceptedFiles) => {
    setCategoryError("")
    if (category) {
      acceptedFiles.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category)

        fetch(`${process.env.REACT_APP_BACKEND_URL}/protected/upload`, {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to upload file");
            }
          })
          .then((data) => {
            setUploadStatus("File uploaded successfully!");
          })
          .then(() => { window.location.href = "/profile" })
          .catch((error) => {
            setUploadStatus("Error uploading file.");
            console.error("Error:", error);
          });
      });
    } else {
      setCategoryError("error")
      setUploadStatus("No category")
    }
  }, [category]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className='profile'>
      <Header sign={false} signOut={true} username={profile.username} />
      <input className={`category ${categoryError}`} placeholder='category' onChange={(e) => setCategory(e.target.value)} />
      <form className="file-upload-form" {...getRootProps()} onClick={e => e.stopPropagation()}>
        <label htmlFor="file" className="file-upload-label">
          <div className="file-upload-design">
            <svg viewBox="0 0 640 512" height="1em">
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
            </svg>
            <p>{uploadStatus || "Drag and Drop"}</p>
            <p>or</p>
            <span className="browse-button">Browse file</span>
          </div>
        </label>
        <input id="file" type="file" {...getInputProps()} />
      </form>
      {profile.files &&
        <div class="card">
          <div class="card__title">Your files</div>
          <div class="card__data">
            <div class="card__right">
              {profile.files.map((file) => (
                <div class="item">{file.file_name}</div>
              ))}
            </div>
            <div class="card__left">
              {profile.files.map((file) => (
                <div class="item">{file.category}</div>
              ))}
            </div>
            <div className='download__buttons'>
              {profile.files.map((file) => (
                <div className='download__button' onClick={() => HandleDownload(file.id, file.file_name)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z" />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      }

      <h2>Search for files</h2>
      <input className={`category`} placeholder='Search' onChange={(e) => setSearchQuery(e.target.value)} />
      <div className='search-button'>
        <Button variant="primary" onClick={() => { window.location.href = `/search/${searchQuery}` }}>Search</Button>
      </div>
    </div>
  );
};

export default Profile;
