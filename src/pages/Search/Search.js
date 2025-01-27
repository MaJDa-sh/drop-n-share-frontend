import { useParams } from 'wouter';
import { useState, useEffect } from 'react';
import "./Search.css"
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';

const Search = () => {
    const { query } = useParams();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("")

    const HandleDownload = (fileID, fileName) => {
        const url = `${process.env.BACKEND_URL}/protected/download?id=${fileID}`;
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

    useEffect(() => {

        const fetchFiles = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/files/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }
                const data = await response.json();
                if (data.files) {
                    setFiles(data.files);
                } else {
                    setError("No files found")
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [query]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="search">
            <Header sign={false} />
            <h2>Search results</h2>
            <div class="card">
                <div class="card__title">Found files</div>
                <div class="card__data">
                    <div class="card__right">
                        {files.map((file) => (
                            <div class="item">{file.file_name}</div>
                        ))}
                    </div>
                    <div class="card__left">
                        {files.map((file) => (
                            <div class="item">{file.category}</div>
                        ))}
                    </div>
                    <div className='download__buttons'>
                        {files.map((file) => (
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

            <h2>Search for files</h2>
            <input className={`category`} placeholder='Search' onChange={(e) => setSearchQuery(e.target.value)} />
            <div className='search-button'>
                <Button variant="primary" onClick={() => { window.location.href = `/search/${searchQuery}` }}>Search</Button>
            </div>
        </div>
    );
};

export default Search;